import express from "express";
import { createServer as createViteServer } from "vite";
import * as path from "path";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Trust proxy for rate limiting behind Nginx/Cloud Run
  app.set("trust proxy", 1);

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Rate limiter for SEO Audit to prevent abuse and cost spikes
  const auditLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 auditorias por IP a cada 15 minutos
    message: { error: "Muitas solicitações de auditoria em pouco tempo. Tente novamente em 15 minutos." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Load Firebase Config once
  let firebaseApp: any = null;
  const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
  let firebaseConfig: any = null;
  try {
    const fs = await import("fs");
    if (fs.existsSync(configPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch (e) {
    console.error("Erro ao carregar firebase-applet-config.json:", e);
  }

  async function getFirebaseDb() {
    if (!firebaseConfig) return null;
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    
    if (!firebaseApp) {
      const apps = getApps();
      firebaseApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    }
    
    return getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
  }

  // API para Auditoria Técnica (Health Check)
  app.post("/api/audit-health", async (req, res) => {
    try {
      const { agencyUid } = req.body;
      if (!agencyUid) return res.status(400).json({ error: "agencyUid é obrigatório" });

      const db = await getFirebaseDb();
      if (!db) throw new Error("Firebase não configurado.");

      const { collection, getDocs, query, where, updateDoc, doc } = await import("firebase/firestore");
      const axios = (await import("axios")).default;

      // Buscar todas as páginas SEO desta agência
      const seoRef = collection(db, 'seo_pages');
      const q = query(seoRef, where('agencyUid', '==', agencyUid));
      const snapshot = await getDocs(q);

      const results = [];
      const promises = snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const url = data.url;
        
        if (!url || !url.startsWith('http')) return;

        try {
          const response = await axios.get(url, { 
            timeout: 8000,
            headers: { 'User-Agent': 'SEO-Bot-Auditor/1.0' },
            validateStatus: () => true // Não jogar erro para 404, queremos o código
          });

          const status = response.status;
          const statusText = status === 200 ? 'Online' : `Erro ${status}`;
          
          await updateDoc(doc(db, 'seo_pages', docSnapshot.id), {
            lastAuditStatus: status,
            lastAuditAt: new Date().toISOString(),
            health: status === 200 ? 'healthy' : 'critical'
          });

          results.push({ url, status });
        } catch (err) {
          await updateDoc(doc(db, 'seo_pages', docSnapshot.id), {
            lastAuditStatus: 'Timeout/Error',
            lastAuditAt: new Date().toISOString(),
            health: 'critical'
          });
          results.push({ url, status: 'Error' });
        }
      });

      await Promise.all(promises);
      res.json({ success: true, count: results.length });
    } catch (err) {
      console.error("Erro na auditoria:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API route for Google Search Console
  app.get("/api/search-console", async (req, res) => {
    try {
      const siteUrl = req.query.siteUrl as string;
      const serviceAccountJsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      if (!siteUrl) {
        return res.status(400).json({ error: "Parâmetro siteUrl é obrigatório." });
      }

      if (!serviceAccountJsonStr) {
        return res.status(503).json({ error: "Credenciais da API não configuradas no servidor." });
      }

      // O pacote googleapis pode ser importado via require inline ou você pode importá-lo no topo. 
      // Mas já que é Typescript com ESM node mod, faremos require ou import de googleapis.
      const { google } = await import("googleapis");

      let credentials;
      try {
         credentials = JSON.parse(serviceAccountJsonStr);
      } catch (e) {
         return res.status(500).json({ error: "JSON de credenciais inválido no servidor." });
      }

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      });

      const searchconsole = google.searchconsole({ version: "v1", auth });

      // Search Console data is normally delayed by ~3 days
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 3);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      // Query para cliques ao longo do tempo (últimos 30 dias)
      const timeResponse = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["date"],
        },
      });

      // Query para keywords mais clicadas (top 10)
      const kwResponse = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["query"],
          rowLimit: 10,
        },
      });

      res.json({
        clicksOverTime: timeResponse.data.rows || [],
        topKeywords: kwResponse.data.rows || [],
      });
    } catch (error: any) {
      console.error("[Search Console API Error]:", error);
      res.status(500).json({ error: error.message || "Erro interno ao consultar GSC API." });
    }
  });

  // API route for SEO Audit fetching
  app.post("/api/audit", auditLimiter, async (req, res) => {
    try {
      const { targetUrl } = req.body;
      if (!targetUrl) return res.status(400).json({ error: "A URL é obrigatória" });

      // Detect if it is a client automatically
      let isClientDetected = false;
      try {
        const db = await getFirebaseDb();
        if (db) {
          const { collection, getDocs } = await import("firebase/firestore");

          // Normalize URL for comparison (remove protocol and trailing slash)
          const normalize = (u: string) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
          const normalizedTarget = normalize(targetUrl);

          const clientsRef = collection(db, 'clients');
          const snapshot = await getDocs(clientsRef);
          
          snapshot.forEach(doc => {
            const clientData = doc.data();
            if (clientData.websiteUrl) {
              const normalizedClientUrl = normalize(clientData.websiteUrl);
              if (normalizedClientUrl === normalizedTarget || normalizedTarget.includes(normalizedClientUrl)) {
                isClientDetected = true;
              }
            }
          });
        }
      } catch (dbErr) {
        console.error("[Audit Client Detection Error]:", dbErr);
      }

      console.log(`[SEO Audit] Buscando HTML de: ${targetUrl} (Modo: ${isClientDetected ? 'Cliente' : 'Prospect'})`);
      
      const fetchRes = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
      });
      
      if (!fetchRes.ok) {
        throw new Error(`Falha ao acessar o site. Status: ${fetchRes.status}`);
      }

      const html = await fetchRes.text();

      // Utilizar cheerio para extrair dados estruturados
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);

      const structuredData = {
        title: $("title").text(),
        description: $('meta[name="description"]').attr("content") || "",
        headers: {
          h1: $("h1").map((_, el) => $(el).text()).get(),
          h2: $("h2").map((_, el) => $(el).text()).get().slice(0, 10),
        },
        links: {
          total: $("a").length,
          internal: $("a[href^='/'], a[href^='" + targetUrl + "']").length,
        }
      };

      const jsonResponse = {
        structuredData,
        isClientDetected,
        targetUrl
      };

      const persona = isClientDetected 
        ? "Parceiro Estratégico de Crescimento e Sucesso do Cliente." 
        : "Auditor de SEO Implacável e focado em Conversão de Vendas.";

      const toneInstructions = isClientDetected
        ? `Nível de Rigor: Construtivo e Positivo. O site analisado é de um CLIENTE ATUAL da agência.
           - O objetivo é mostrar que o trabalho está no caminho certo e apontar 'Próximos Passos' para escala.
           - Em vez de 'Erro' ou 'Crítico', use termos como 'Oportunidade de Otimização' ou 'Refinamento Estratégico'.
           - A nota (score) deve ser motivadora, refletindo o cuidado que o site já recebe.`
        : `Nível de Rigor: Crítico e Persuasivo. O site analisado é de um PROSPECT (cliente em potencial).
           - O objetivo é gerar senso de urgência e mostrar o que ele está PERDENDO hoje.
           - Use linguagem direta sobre falhas técnicas e impacto no faturamento.
           - Seja rigoroso na nota para justificar a contratação da agência.`;

      const prompt = `Você é um ${persona}
Data atual: ${new Date().toLocaleDateString('pt-BR')}.

${toneInstructions}

Análise Técnica do Site: ${targetUrl}
Dados Extraídos: ${JSON.stringify(structuredData, null, 2)}

Regras de Resposta:
1. Retorne APENAS um JSON puro (sem markdown):
{
  "score": number, 
  "goodPoints": [ { "title": string, "description": string } ],
  "badPoints": [ { "title": string, "description": string, "impact": "high" | "medium" | "low" } ]
}
2. 'goodPoints': Liste o que está bem feito tecnicamente.
3. 'badPoints': Se for CLIENTE, trate como 'Oportunidades de Melhoria' para o futuro. Se for PROSPECT, trate como 'Erros Graves'.
4. Títulos dos pontos devem ser curtos e profissionais.`;

      const { GoogleGenAI } = await import('@google/genai');
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: "A chave GEMINI_API_KEY não está configurada. Por favor, adicione sua chave nas configurações do app." });
      }
      let data = {};
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      const responseText = geminiRes.text || "{}";
      data = JSON.parse(responseText);

      res.json(data);

    } catch (error: any) {
      console.error("[SEO Audit Error]:", error);
      res.status(500).json({ error: error.message || "Erro ao capturar dados do site." });
    }
  });

  // Sitemap generation
  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    try {
      const db = await getFirebaseDb();
      if (!db) throw new Error("Firebase não configurado.");

      const { collection, getDocs, query, where } = await import("firebase/firestore");

      const baseUrl = `https://${req.get("host")}`;
      const now = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/sobre</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/auditoria</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/servicos</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, where('status', '==', 'Publicado'));
      const snapshot = await getDocs(q);

      snapshot.forEach(doc => {
        const data = doc.data();
        const slug = data.slug;
        if (slug) {
          xml += `  <url>\n    <loc>${baseUrl}/blog/${slug}</loc>\n`;
          if (data.updatedAt) {
            let updateDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
            if (!isNaN(updateDate.getTime())) {
              xml += `    <lastmod>${updateDate.toISOString().split('T')[0]}</lastmod>\n`;
            }
          } else if (data.createdAt) {
            let createDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            if (!isNaN(createDate.getTime())) {
              xml += `    <lastmod>${createDate.toISOString().split('T')[0]}</lastmod>\n`;
            }
          }
          xml += `    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        }
      });

      xml += `</urlset>`;
      res.send(xml);

    } catch (error) {
      console.error("[Sitemap Error]", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

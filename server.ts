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

  // Load Firebase Admin
  let adminDb: any = null;
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

  async function getFirebaseAdminDb() {
    if (adminDb) return adminDb;
    const admin = (await import("firebase-admin")).default;
    if (admin.apps.length === 0) {
      // If we have GOOGLE_SERVICE_ACCOUNT_JSON, use it. Otherwise, use project default.
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (serviceAccountJson) {
        try {
          const cert = JSON.parse(serviceAccountJson);
          admin.initializeApp({
            credential: admin.credential.cert(cert),
            databaseURL: firebaseConfig?.firestoreDatabaseId ? `https://${firebaseConfig.firestoreDatabaseId}.firebaseio.com` : undefined
          });
        } catch (e) {
          console.error("Erro ao parsear GOOGLE_SERVICE_ACCOUNT_JSON, falhando para default:", e);
          admin.initializeApp();
        }
      } else {
        admin.initializeApp();
      }
    }
    adminDb = admin.firestore();
    return adminDb;
  }

  // API para Auditoria Técnica (Health Check)
  app.post("/api/audit-health", async (req, res) => {
    try {
      const { agencyUid } = req.body;
      if (!agencyUid) return res.status(400).json({ error: "agencyUid é obrigatório" });

      const db = await getFirebaseAdminDb();
      const axios = (await import("axios")).default;

      // Buscar todas as páginas SEO desta agência
      const snapshot = await db.collection('seo_pages').where('agencyUid', '==', agencyUid).get();

      const results = [];
      const promises = snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const url = data.url;
        
        if (!url || !url.startsWith('http')) return;

        try {
          const response = await axios.get(url, { 
            timeout: 10000,
            headers: { 'User-Agent': 'SEO-Bot-Auditor/1.0' },
            validateStatus: () => true
          });

          const status = response.status;
          
          await docSnapshot.ref.update({
            lastAuditStatus: status,
            lastAuditAt: new Date().toISOString(),
            health: status === 200 ? 'healthy' : 'critical'
          });

          results.push({ url, status });
        } catch (err) {
          await docSnapshot.ref.update({
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
      console.error("Erro na auditoria de saúde:", err);
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

      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 3);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      const timeResponse = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["date"],
        },
      });

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

      // Detect if it is a client automatically using Admin SDK
      let isClientDetected = false;
      try {
        const db = await getFirebaseAdminDb();
        const normalize = (u: string) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
        const normalizedTarget = normalize(targetUrl);

        const clientsSnapshot = await db.collection('clients').get();
        clientsSnapshot.forEach((doc: any) => {
          const clientData = doc.data();
          if (clientData.websiteUrl) {
            const normalizedClientUrl = normalize(clientData.websiteUrl);
            if (normalizedClientUrl === normalizedTarget || normalizedTarget.includes(normalizedClientUrl)) {
              isClientDetected = true;
            }
          }
        });
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
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);

      const structuredData = {
        title: $("title").length > 0 ? $("title").text() : "Sem título definido",
        description: $('meta[name="description"]').attr("content") || "",
        headers: {
          h1: $("h1").map((_, el) => $(el).text()).get().filter(t => t.trim()),
          h2: $("h2").map((_, el) => $(el).text()).get().filter(t => t.trim()).slice(0, 15),
        },
        links: {
          total: $("a").length,
          internal: $("a[href^='/'], a[href^='" + targetUrl + "']").length,
        }
      };

      const persona = isClientDetected 
        ? "Parceiro Estratégico de Crescimento e Sucesso do Cliente." 
        : "Auditor de SEO Implacável e focado em Conversão de Vendas.";

      const toneInstructions = isClientDetected
        ? `Nível de Rigor: Construtivo e Positivo. Site de CLIENTE ATUAL. Objetivo: Retenção e Próximos Passos.`
        : `Nível de Rigor: Crítico e Persuasivo. Site de PROSPECT. Objetivo: Gerar urgência e converter venda.`;

      const prompt = `Você é um ${persona}
${toneInstructions}
Contexto: Auditoria SEO de ${targetUrl}
Dados Extraídos: ${JSON.stringify(structuredData)}

Regras de Resposta:
1. Retorne APENAS um JSON: { "score": number, "goodPoints": [{ "title", "description" }], "badPoints": [{ "title", "description", "impact" }] }
2. Pontuação (score) deve ser sincera baseada no rigor acima.
3. Descrições devem ser em Português do Brasil.`;

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY não configurada.");
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Using gemini-3.1-flash-lite-preview for maximum cost efficiency as requested (Flash/Lite version)
      const genResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      const responseText = genResponse.text || "{}";
      const auditResult = JSON.parse(responseText.replace(/```json|```/g, '').trim());

      res.json(auditResult);

    } catch (error: any) {
      console.error("[SEO Audit Error]:", error);
      res.status(500).json({ error: error.message || "Erro ao processar auditoria." });
    }
  });

  // Sitemap generation
  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    try {
      const db = await getFirebaseAdminDb();
      const baseUrl = `https://${req.get("host")}`;
      const now = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      const staticPages = ['', '/sobre', '/auditoria', '/servicos', '/blog'];
      staticPages.forEach(p => {
        xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
      });

      const snapshot = await db.collection('blog_posts').where('status', '==', 'Publicado').get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.slug) {
          xml += `  <url>\n    <loc>${baseUrl}/blog/${data.slug}</loc>\n`;
          const date = data.updatedAt || data.publishedAt || now;
          const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : (date.toDate ? date.toDate().toISOString().split('T')[0] : String(date).split('T')[0]);
          xml += `    <lastmod>${formattedDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
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

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

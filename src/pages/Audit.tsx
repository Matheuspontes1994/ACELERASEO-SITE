import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Activity, Target, Link as LinkIcon, ExternalLink, User, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

import { GoogleGenAI } from '@google/genai';

interface AuditResult {
  score: number;
  goodPoints: { title: string; description: string }[];
  badPoints: { title: string; description: string; impact: 'high' | 'medium' | 'low' }[];
}

export default function Audit() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [progress, setProgress] = useState(0);
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const validatePhone = (p: string) => {
    const cleaned = p.replace(/\D/g, '');
    // DDD (2 digits) + 9 digits = 11 digits
    if (cleaned.length !== 11) return false;
    // Check if it's all same digits (e.g. 11999999999 or 00000000000)
    if (/^(\d)\1+$/.test(cleaned)) return false;
    // Specific block for "999999999" pattern within the string if it's the last 9 digits
    if (cleaned.endsWith('999999999')) return false;
    return true;
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMsg('Por favor, informe um WhatsApp válido (DDD + 9 dígitos).');
      return;
    }

    if (!url) {
      setErrorMsg('Por favor, informe a URL do site.');
      return;
    }

    setStatus('scanning');
    setProgress(0);
    
    // Save lead to Firestore
    try {
      await addDoc(collection(db, 'audit_leads'), {
        name,
        phone: phone.replace(/\D/g, ''),
        url,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Erro ao salvar lead", err);
    }

    // Simulate scanning progress UX
    const interval = setInterval(() => {
      setProgress(p => (p >= 90 ? 90 : p + Math.floor(Math.random() * 8)));
    }, 500);

    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // 1. Fetch HTML from backend
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetUrl: formattedUrl,
          name, // sending name/phone just in case backend needs it for logging
          phone: phone.replace(/\D/g, '')
        })
      });
      
      const siteData = await res.json();
      if (!res.ok) throw new Error(siteData.error || 'Falha ao acessar site');
      
      // 2. Process with Gemini on Frontend
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const { structuredData, isClientDetected, targetUrl: auditTargetUrl } = siteData;
      
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

Análise Técnica do Site: ${auditTargetUrl}
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

      const geminiRes = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const responseText = geminiRes.text || "{}";
      const data = JSON.parse(responseText);
      
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setAuditData(data);
        setStatus('results');
      }, 500); // give the user 0.5s to see 100%

    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || 'Erro desconhecido');
      setStatus('idle');
    }
  };

  return (
    <>
    <Helmet>
      <title>Auditoria de SEO Gratuita | Otimize com a nossa Agência SEO Profissional</title>
      <meta name="description" content="Nossa auditoria de SEO detalhada encontra as falhas de SEO que a sua empresa possui e o que não permite que você lidere as buscas online." />
      <link rel="canonical" href="https://acelera-seo.com.br/auditoria" />
      <meta property="og:title" content="Auditoria de SEO Gratuita | Otimize com a nossa Agência SEO Profissional" />
      <meta property="og:description" content="Nossa auditoria de SEO detalhada encontra as falhas de SEO que a sua empresa possui e o que não permite que você lidere as buscas online." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://acelera-seo.com.br/auditoria" />
    </Helmet>

    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-24">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-brand-900/5 to-transparent pointer-events-none"></div>

      <main className="max-w-7xl mx-auto relative z-10 px-6">
        
        <AnimatePresence mode="wait">
          {status !== 'results' ? (
            <motion.div 
              key="form-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 items-center gap-8 lg:gap-20 md:gap-16"
            >
              <div className="text-left order-2 lg:order-1 pt-0 lg:pt-8">
                <div className="inline-flex items-center justify-center bg-white text-brand-600 border border-brand-100 rounded-2xl md:rounded-full shadow-sm text-[11px] sm:text-xs font-bold uppercase tracking-widest py-2 px-4 mb-6 gap-2 w-fit max-w-[90vw] whitespace-normal flex-wrap text-center mx-auto md:mx-0">
                   <Search size={16} /> Diagnóstico Técnico Gratuito
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold tracking-tight text-slate-900 font-display mb-8 text-center md:text-center">
                  Faça sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Auditoria de SEO</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-10 text-justify md:text-left">
                  Descubra os bloqueios que impedem o seu site de alcançar o topo do Google. Com nossa <strong>Auditoria de SEO</strong>, você terá um raio-x completo identificando falhas de estrutura, conteúdo e autoridade, para parar de perder vendas para seus concorrentes.
                </p>
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center text-slate-700 font-medium gap-3">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                    Análise técnica de código e performance (On-Page)
                  </li>
                  <li className="flex items-center text-slate-700 font-medium gap-3">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                    Diagnóstico de palavras-chave e semântica
                  </li>
                  <li className="flex items-center text-slate-700 font-medium gap-3">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                    Insights de Link Building para Autoridade
                  </li>
                </ul>
              </div>

              <div className="order-1 lg:order-2">
                {status === 'idle' && (
                  <motion.form 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleAudit}
                    className="flex flex-col max-w-lg mx-auto lg:ml-auto lg:mr-0 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full relative overflow-hidden gap-5 p-8 md:p-10"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-[100px] pointer-events-none -translate-x-1/4 -translate-y-1/4"></div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 font-display relative z-10 mb-1 text-center md:text-left">Inicie o Diagnóstico</h3>
                    <p className="text-slate-500 font-light text-sm relative z-10 mb-6 text-justify md:text-left">Insira seus dados reais para receber o relatório completo e automatizado em sua tela instantaneamente.</p>
                    
                    <div className="space-y-4 relative z-10 text-justify md:text-left">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all px-4">
                        <User size={18} className="text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu Nome completo" 
                          className="w-full bg-transparent text-slate-900 py-3.5 outline-none placeholder:text-slate-400 font-medium text-sm sm:text-base px-3"
                          required
                        />
                      </div>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all px-4">
                        <Phone size={18} className="text-slate-400 shrink-0" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Celular / WhatsApp" 
                          className="w-full bg-transparent text-slate-900 py-3.5 outline-none placeholder:text-slate-400 font-medium text-sm sm:text-base px-3"
                          required
                        />
                      </div>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all px-4">
                        <LinkIcon size={18} className="text-slate-400 shrink-0" />
                        <input 
                          type="url" 
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://seusite.com.br" 
                          className="w-full bg-transparent text-slate-900 py-3.5 outline-none placeholder:text-slate-400 font-medium text-sm sm:text-base min-w-0 px-3"
                          required
                        />
                      </div>
                    </div>
                    
                    <button className="w-full bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20 transition-all text-base sm:text-lg flex items-center justify-center group relative z-10 mt-4 px-8 py-4 gap-2">
                      Iniciar Análise <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="text-slate-400 text-xs text-center font-medium opacity-80 mt-4">
                      *A nossa ferramenta fará uma varredura real do código fonte front-end do domínio informado.
                    </div>
                    {errorMsg && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 font-medium text-sm text-center mt-2">
                        <AlertTriangle className="inline mr-1" size={16} /> {errorMsg}
                      </motion.div>
                    )}
                  </motion.form>
                )}

                {status === 'scanning' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-lg mx-auto lg:ml-auto lg:mr-0 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full p-10"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-8">
                         <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center shadow-inner">
                            <Activity className="text-brand-600 animate-pulse" size={32} />
                         </div>
                         <svg className="absolute top-0 left-0 w-24 h-24 -rotate-90">
                           <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-500" strokeDasharray="276" strokeDashoffset={276 - (276 * Math.min(progress, 100)) / 100} style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} />
                         </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 font-display mb-2 text-center md:text-left">Conectando...</h3>
                      <p className="text-slate-500 font-medium mb-8">Capturando código fonte e metadados de <strong className="text-slate-800">{new URL(url.startsWith('http') ? url : `https://${url}`).hostname}</strong></p>
                      
                      <div className="w-full space-y-3 text-justify md:text-left">
                        <div className="flex justify-between text-sm font-bold text-slate-600 w-full">
                          <span>Avanço da Auditoria de SEO</span>
                          <span className="text-brand-600">{Math.min(progress, 100)}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-left space-y-8 max-w-5xl mx-auto"
            >
              {/* Score Header */}
              <div className="bg-white rounded-[2rem] shadow-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between text-center md:text-left p-6 sm:p-8 gap-6 sm:gap-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-2 text-center md:text-left">Auditoria de SEO Concluída</h2>
                  <p className="text-slate-500 font-medium break-all text-sm sm:text-base">Relatório gerado para <strong className="text-slate-800">{new URL(url.startsWith('http') ? url : `https://${url}`).hostname}</strong></p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center md:text-right">
                    <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                    <p className={`text-4xl sm:text-5xl font-extrabold font-display ${auditData!.score >= 80 ? 'text-emerald-500' : auditData!.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {auditData!.score}<span className="text-xl sm:text-2xl text-slate-300">/100</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* O que está bom */}
                <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8">
                  <h3 className="text-xl font-bold flex items-center text-emerald-700 border-b border-emerald-50 gap-2 mb-6 pb-4 text-center md:text-left">
                    <CheckCircle2 className="text-emerald-500" /> O que está Bom
                  </h3>
                  <ul className="space-y-4">
                    {auditData!.goodPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">{point.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{point.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* O que está ruim */}
                <div className="bg-white rounded-3xl shadow-sm border border-rose-100 relative p-8">
                   <div className="absolute top-4 right-4 animate-pulse">
                      <span className="bg-rose-100 text-rose-600 text-xs font-bold rounded-full uppercase tracking-wider px-3 py-1">Atenção Necessária</span>
                   </div>
                  <h3 className="text-xl font-bold flex items-center text-rose-700 border-b border-rose-50 gap-2 mb-6 pb-4 text-center md:text-left">
                    <XCircle className="text-rose-500" /> O que está Ruim
                  </h3>
                  <ul className="space-y-4">
                    {auditData!.badPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {point.impact === 'high' ? (
                          <XCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{point.title}</p>
                          <p className={`text-sm font-medium mt-1 ${point.impact === 'high' ? 'text-rose-500' : 'text-amber-600'}`}>{point.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conversion Section */}
              <div className="bg-slate-900 rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl border border-slate-800 p-8 md:p-14 mt-8 lg:mt-12">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-900/60 via-slate-900 to-slate-900"></div>
                 
                 <div className="relative z-10 max-w-3xl mx-auto">
                   <Target size={48} className="mx-auto text-brand-400 mb-6" />
                   <h2 className="text-2xl sm:text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display leading-tight tracking-tight mb-6 text-center md:text-left">Escale seu projeto e resolva isso agora.</h2>
                   <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-8 sm:mb-10 text-justify md:text-left">
                     Essa auditoria de SEO revela apenas a superfície do que seu domínio enfrenta. Existem falhas graves tirando você da primeira página todos os dias. Fale com um Especialista e descubra o plano de ação exato para alavancar seu crescimento orgânico.
                   </p>
                   
                   <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+fiz+uma+auditoria+SEO+no+meu+site+e+percebi+que+preciso+de+ajuda!" target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition-all shadow-xl shadow-brand-500/20 text-base sm:text-lg group gap-3 px-8 sm:px-10 py-4 sm:py-5">
                      Corrigir meu Site com um Especialista <ArrowRight size={20} className="hidden sm:inline group-hover:translate-x-1 transition-transform" />
                   </a>
                 </div>
              </div>

              <div className="text-center opacity-80 backdrop-blur-sm relative z-20 pt-8">
                <button onClick={() => { setStatus('idle'); setUrl(''); setAuditData(null); setProgress(0); }} className="text-slate-500 font-bold hover:text-brand-600 transition-colors flex items-center mx-auto bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer hover:shadow-md gap-2 px-6 py-3">
                  <Search size={16} /> Realizar nova Auditoria de SEO
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <section className="max-w-5xl mx-auto px-6 mt-8 lg:mt-24 md:mt-8 mb-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm relative z-10 p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mb-6 text-center md:text-left">A Importância da Auditoria de SEO para o seu Negócio</h2>
          
          <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg text-justify md:text-left">
            <p>
              Em um mercado competitivo, estar na primeira página do Google não é apenas uma questão de vaidade: é sobre sobrevivência financeira. Realizar uma <strong>Auditoria de SEO</strong> completa é o primeiro passo para encontrar gargalos técnicos invisíveis ao usuário, mas evidentes aos motores de busca. Um simples tempo de resposta lento do servidor ou redirecionamentos malfeitos podem minar sua principal fonte de tráfego de vendas.
            </p>
            <p>
              Muitas empresas focam unicamente no conteúdo, esquecendo que o <Link to="/consultoria-seo" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">SEO Técnico e Consultoria Guiada</Link> são a base estrutural que mantém tudo de pé. Se a "casa" não tiver fundações sólidas (bom <Link to="/blog" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">Core Web Vitals</Link> e performance), nenhum conteúdo, por melhor que seja, conseguirá disputar o Top 3 em palavras-chave competitivas.
            </p>
            <p>
              Outro aspecto extremamente negligenciado apontado por nossa auditoria é o seu perfil de backlinks. Uma <strong>Auditoria de SEO</strong> robusta verifica a saúde da sua autoridade online. Se existirem links tóxicos apontando para o seu domínio, é necessário removê-los e iniciar uma estratégia limpa com a nossa agência focada em <Link to="/agencia-link-building" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">link building</Link> ou explorar a <Link to="/venda-backlinks" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">presença premium e venda de backlinks</Link> garantindo indicações reais e qualificadas.
            </p>
            <p>
              E-commerces, especialmente, sofrem muito com páginas duplicadas e falta de otimização on-page. Nesses casos de escala, indicamos atuar com um <Link to="/especialista-em-seo" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">Especialista de SEO</Link> que entenda a fundo a arquitetura da sua plataforma, desenvolvendo as <Link to="/servicos" className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">soluções</Link> focadas no melhor ROI. Não adie o reparo da sua infraestrutura; uma falha técnica pode estar custando leads qualificados hoje mesmo.
            </p>
          </div>
        </div>
      </section>
    </div>

    {/* Floating CTA for extreme accessibility */}
    {status === 'results' && (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      >
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+fiz+uma+auditoria+SEO+no+meu+site+e+percebi+que+preciso+de+ajuda!" 
           target="_blank" rel="noopener noreferrer" 
           className="flex flex-col sm:flex-row items-center bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-2xl shadow-slate-900/40 border border-slate-700 group text-sm sm:text-base text-center hover:scale-105 gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4"
           aria-label="Falar com Especialista no WhatsApp"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
          </div>
          Corrigir meu site <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    )}
    </>
  );
}
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Users, Search, CheckCircle2, TrendingUp, Lightbulb, FileText, ArrowRight } from 'lucide-react';
import { JsonLd } from '../components/JsonLd';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function ConsultoriaSeoPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Consultoria SEO",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Acelera SEO",
      "url": "https://aceleraseo.com.br"
    },
    "description": "Consultoria SEO técnica e estratégica para empresas que buscam crescimento orgânico exponencial.",
    "areaServed": "BR"
  };
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>Consultoria SEO Especializada | Acelere o Crescimento do seu Time</title>
        <meta name="description" content="Consultoria SEO técnica e estratégica. Entregamos roadmaps de alto impacto, documentação para desenvolvedores e direcionamento para equipes de marketing." />
        <link rel="canonical" href="https://aceleraseo.com.br/consultoria-seo" />
        <meta property="og:title" content="Consultoria SEO Especializada | Agência de Alta Performance" />
        <meta property="og:description" content="Consultoria SEO técnica e estratégica. Entregamos roadmaps de alto impacto e direcionamento para equipes de marketing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/consultoria-seo" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Consultoria SEO Especializada | Agência de Alta Performance" />
        <meta name="twitter:description" content="Consultoria SEO técnica e estratégica. Entregamos roadmaps de alto impacto e direcionamento para equipes de marketing." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <JsonLd data={serviceSchema} />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-8 md:pt-16 lg:pt-24 pb-20 md:pb-28 lg:pb-36">
        <div className="hero-glow" />
        <div className="tech-grid" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs bg-brand-50/80 backdrop-blur-sm py-2 px-4 rounded-full inline-flex items-center gap-2 mb-4 border border-brand-100/50"
              >
                <Target size={14} className="animate-pulse" /> Mentoria & Consultoria Avançada
              </motion.span>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8">
                Empodere seu Time com <span className="text-brand-600 relative inline-block">SEO<span className="absolute -bottom-1 left-0 w-full h-[6px] bg-brand-200/50 -z-10"></span></span> Orientado a Dados
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-xl">
                Nossa <strong>Consultoria SEO</strong> foi moldada para guiar times internos rumo às melhores práticas de otimização, com metodologias testadas em operações de alta performance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-lg rounded-2xl hover:bg-brand-700 hover:shadow-2xl hover:shadow-brand-600/30 transition-all flex items-center justify-center px-10 py-5 gap-3 group">
                  Falar com Especialista <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-3 items-center ml-2 border-l border-slate-200 pl-6 h-12 my-auto">
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User 1" className="w-full h-full object-cover" />
                   </div>
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="User 2" className="w-full h-full object-cover" />
                   </div>
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden text-[10px] font-bold text-slate-500">
                      +50
                   </div>
                   <div className="ml-4 flex flex-col">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <CheckCircle2 key={i} size={12} className="text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">Marcas Aceleradas</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">+140% Crescimento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">Time In-house</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Search size={18} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">Audit Sênior</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100/50 to-transparent blur-3xl -z-10 rounded-full animate-pulse" />
                <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative">
                    <img 
                       src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop" 
                       alt="Estrategistas de SEO em reunião de consultoria" 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    
                    {/* Floating Stats Card in Hero */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-2xl"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">ROI Orgânico</span>
                          <span className="text-3xl font-black text-slate-900">328%</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                          <TrendingUp size={24} />
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ delay: 1.5, duration: 1 }}
                          className="h-full bg-brand-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-200/30 rounded-full blur-2xl -z-20" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-200/40 rounded-full blur-3xl -z-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Consultor Especialista em SEO apresentando métricas avançadas em uma reunião de planejamento com a equipe de marketing" 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 decoding="async"
               />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">Para Empresas que Precisam de Validação e Direção</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 Você tem os desenvolvedores e os redatores, mas não sabe por onde começar ou o que priorizar? É exatamente nesse cenário de desorganização tática que a nossa <strong>consultoria de search engine optimization</strong> se encaixa perfeitamente.
               </p>
               <p>
                 Atuamos como um cérebro analítico terceirizado. Nossa equipe realiza as investigações altamente técnicas em logs, código fonte e concorrência, e devolve para as suas lideranças apenas o <strong>plano de ação priorizado</strong> (Roadmap) pronto para ser inserido nos sprints do seu desenvolvimento.
               </p>
               <p>
                 Sem achismos, sem tentativas e falhas. Encurte a jornada da sua empresa. Deixe a nossa agência liderar a sua arquitetura, enquanto sua equipe opera a longo prazo com acompanhamento quinzenal dos nossos diretores.
               </p>
            </div>
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Acesso direto a estratégias fechadas por nossos analistas sêniores.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Reuniões periódicas (Sprint Planning & Reviews) para destravar bugs.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Alinhamento entre as estruturas <Link to="/seo-ecommerce" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">e-commerce</Link>, conteúdo institucional e integrações.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-slate-900 py-32 mb-28">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-8 lg:mb-20">
               <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-center">
                  Como funciona nosso escopo de Consultoria SEO?
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  Não trabalhamos com relatórios automatizados de ferramentas. O grande diferencial de estar conosco é a curadoria humana em cada etapa técnica da construção dos seus ativos na web.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Search className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">1. Raio-X Técnico</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Iniciamos com uma imersão na saúde atual do domínio. Identificamos as perdas invisíveis (páginas canibalizadas, thin content, códigos quebrados) através de uma minuciosa <Link to="/auditoria" className="text-white hover:text-emerald-400 font-semibold underline underline-offset-2 transition-colors">auditoria especializada</Link>. Esta fase estabiliza a "casa".
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <FileText className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">2. Masterplan e Keyword Strategy</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Criamos o plano de ataque. Mapeamos os clusters de tópicos e as deficiências de palavras-chave da sua operação frente aos concorrentes no Google. Elaboramos o planejamento de conteúdo semestral ou anual, orientando o seu time de redação exatamente em quais pautas escrever.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <TrendingUp className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">3. Escalonamento e Off-Page</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Com a estrutura perfeita e o plano de conteúdo ativo, direcionamos toda a orientação para as melhores estratégias de mercado envolvendo Relações Públicas, definindo o setup correto com auxílio de uma <Link to="/agencia-link-building" className="text-white hover:text-emerald-400 font-semibold underline underline-offset-2 transition-colors">agência de link building</Link> experiente para turbinar sua autoridade.
                   </p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Lightbulb className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">Pare de andar no escuro orgânico.</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Dê ao seu time de in-house o direcionamento cirúrgico de analistas de nível executivo. Contrate nossa consultoria para liderar seu processo de crescimento online orgânico e descubra o que falta para chegar à primeira posição.
           </p>
           <Link to="/contato" className="bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 transition-colors shadow-2xl shadow-brand-500/20 inline-flex items-center group px-12 py-6 gap-4">
             Solicitar Proposta de Consultoria
           </Link>
        </div>
      </section>
    </div>
  );
}


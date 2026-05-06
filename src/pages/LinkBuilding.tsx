import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Target, TrendingUp, ShieldCheck, Activity, Globe, Award, CheckCircle2, Search, Mail, Newspaper, FileCheck, ArrowRight } from 'lucide-react';
import { JsonLd } from '../components/JsonLd';
import { ServiceRoadmap } from '../components/ServiceRoadmap';
import { ServiceFAQ } from '../components/ServiceFAQ';

export default function LinkBuildingPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      <Helmet>
        <title>Agência de Link Building e Digital PR | Conquiste Backlinks de Alta Autoridade</title>
        <meta name="description" content="Escale a autoridade do seu domínio e conquiste o topo do Google com a principal agência de Link Building do mercado. Especialistas em Digital PR e Backlinks." />
        <link rel="canonical" href="https://aceleraseo.com.br/agencia-link-building" />
        <meta property="og:title" content="Agência de Link Building e Digital PR | Conquiste Backlinks de Alta Autoridade" />
        <meta property="og:description" content="Escale a autoridade do seu domínio e conquiste o topo do Google com a principal agência de Link Building do mercado. Especialistas em Digital PR e Backlinks." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/agencia-link-building" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agência de Link Building e Digital PR | Conquiste Backlinks de Alta Autoridade" />
        <meta name="twitter:description" content="Escale a autoridade do seu domínio e conquiste o topo do Google com a principal agência de Link Building do mercado. Especialistas em Digital PR e Backlinks." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Link Building e Digital PR",
        "description": "Serviços especializados de aquisição de backlinks e Digital PR para aumentar a autoridade de domínios.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "Acelera SEO",
          "url": "https://aceleraseo.com.br"
        }
      }} />



      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-12 md:pt-20 pb-20 md:pb-32">
        <div className="tech-grid" />
        <div className="hero-glow" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="inline-flex items-center rounded-full bg-white border border-slate-200 shadow-sm text-[10px] md:text-xs font-bold text-brand-600 uppercase tracking-widest gap-2 px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Engenharia de Autoridade Off-Page
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8">
                Autoridade Digital que Conquista o <span className="text-brand-600">Topo</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                Não adianta ter o melhor conteúdo do mundo se o Google não enxerga o seu site como uma referência. Nossa <Link to="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de SEO</Link> fornece credibilidade real através de backlinks estratégicos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Falar com Consultor <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#processo" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Ver Nossos Planos
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative mt-10 lg:mt-0"
            >
              <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(41,96,150,0.12)] rounded-[3rem] relative z-10 w-full overflow-hidden p-4 sm:p-6 ring-1 ring-white/50">
                <div className="aspect-[4/3] rounded-[2.2rem] overflow-hidden group relative">
                  <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
                      alt="Monitoramento de Autoridade e Domain Rating" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating labels inside card */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">Crescimento de DR</p>
                      <p className="text-sm font-extrabold text-slate-900">Autoridade Máxima +45 pts</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <LinkIcon size={24} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* External decorative blurs */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-400/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-200/5 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section 1: The Problem & The Concept */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div>
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">O que é Link Building e como impacta o seu SEO?</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-left md:text-left">
               <p>
                 O processo de <strong>Link Building</strong> é o pilar mais crítico e desafiador do <Link to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">SEO Off-Page</Link>. Ele consiste em articular e conquistar links de outros sites respeitados da internet apontando diretamente para o seu domínio (os famosos <strong>backlinks</strong>).
               </p>
               <p>
                 Esses apontamentos funcionam como &quot;votos de confiança&quot; aos olhos do algoritmo de busca. Quanto mais portais jornalísticos, universidades e blogs de alto <strong>Domain Rating (DR)</strong> fizerem referências ao seu negócio, mais o Google entenderá que a sua empresa é a principal autoridade sobre aquele tema no Brasil.
               </p>
               <p>
                 É impossível rankear para palavras-chave altamente competitivas e de alto volume de busca contando apenas com conteúdo. Você precisa de <strong>autoridade</strong>. Nós ajudamos você a construir essa autoridade através de campanhas puras de <Link to="/servicos" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">Digital PR e prospecção ativa de parceiros</Link>.
               </p>
            </div>
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Aumento dramático e consolidado do tráfego orgânico mensal.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Transferência de PageRank de domínios corporativos para suas páginas de produto.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Crescimento acelerado das métricas globais de SEO (DA, DR, TF e CF).</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Analista de SEO sênior monitorando um dashboard interativo exibindo o crescimento exponencial do tráfego orgânico e a evolução saudável do Domain Rating da empresa." 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 decoding="async"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <ServiceRoadmap 
        title="Nossa Engenharia de Autoridade"
        subtitle="Entenda como construímos a credibilidade do seu domínio de forma segura, escalável e livre de punições do Google."
        steps={[
          {
            title: "Auditoria de Link Profile",
            description: "Analisamos seus links atuais e os dos concorrentes. Identificamos o 'Gap de Autoridade' e as âncoras ideais para posicionar suas páginas mais importantes.",
            icon: <Search size={24} />
          },
          {
            title: "Prospecção e Digital PR",
            description: "Nossa equipe de assessoria filtra portais e blogs com alto tráfego e relevância temática. Iniciamos o contato para garantir referências orgânicas e contextuais.",
            icon: <Newspaper size={24} />
          },
          {
            title: "Curadoria de Conteúdo",
            description: <>Produzimos ou otimizamos o <Link to="/blog" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">conteúdo relevante</Link> que receberá o link. Garantimos que o contexto semântico seja perfeito para que o Google transfira o máximo de PageRank possível.</>,
            icon: <FileCheck size={24} />
          },
          {
            title: "Monitoramento e Disavow",
            description: "Acompanhamos a indexação de cada link conquistado. Caso identifiquemos links tóxicos externos (spam) apontando para você, realizamos a limpeza imediata via Search Console.",
            icon: <Activity size={24} />
          }
        ]}
      />

      {/* FAQ Section */}
      <ServiceFAQ 
        faqs={[
          {
            question: "Quanto tempo leva para um backlink fazer efeito?",
            answer: "Geralmente o Google leva de 3 a 8 semanas para re-rastrear o site de origem e processar a nova autoridade no seu domínio. Os efeitos em posicionamento costumam ser graduais."
          },
          {
            question: "Os links são permanentes?",
            answer: "Sim. Trabalhamos exclusivamente com links inseridos de forma definitiva no corpo editorial dos parceiros. Não utilizamos aluguel de links ou esquemas temporários."
          },
          {
            question: "Como vocês escolhem os sites parceiros?",
            answer: "Filtramos por relevância temática (nicho), Domain Rating (DR), Tráfego Orgânico real e ausência de spam. Você não receberá links de sites que não tenham audiência real."
          },
          {
            question: "Existe risco de punição?",
            answer: "Nossa metodologia de Digital PR e conquista orgânica de links é focada em segurança. Evitamos padrões artificiais e seguimos as diretrizes do Google para construção de autoridade."
          }
        ]}
      />

      {/* Content Section 2: Link Quality */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-16">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl relative border-[10px] border-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Gestores e especialistas em Digital PR organizando uma campanha elaborada de Link Building em uma agência moderna de tecnologia da informação e SEO." 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 decoding="async"
               />
            </div>
          </div>
          
          <div className="order-1 md:order-2">
             <div className="inline-flex items-center bg-amber-50 text-amber-900 rounded-lg text-[11px] font-bold tracking-widest uppercase gap-2 px-4 py-2 mb-6 border border-amber-100">
                <Award size={14} /> Qualidade Absoluta
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">O fim dos pacotes cegos e listas perigosas.</h2>
             <p className="text-lg text-slate-600 font-light leading-relaxed mb-6 text-left md:text-left">
                O modelo atrasado de <strong>venda de backlinks</strong> baseava-se em "Pacotes com 50 links de alta qualidade" onde o cliente não via nada. Isso é passado.
             </p>
             <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 text-left md:text-left">
                A estruturação do Link Profile de uma marca requer transparência total. Você saberá exatamente de onde cada link está vindo, qual o DA/DR do projeto nativo e nós auxiliaremos na escolha da <strong>ancoragem (anchor text)</strong> perfeita para que pareça exatamente um voto orgânico e limpo. Isso protege o seu capital investido.
             </p>

             <Link to="/contato" className="inline-flex items-center justify-center bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 px-10 py-5">
               Solicitar Orçamento de Link Building
             </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Activity className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center px-4">Escale a Autoridade do seu Site Agora</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-left md:text-center px-4">
             A maior rede premium privada de publisher do mercado de buscas aliado à inteligência de negócio. Supere seus concorrentes nas SERPs com um planejamento de Off-Page estratégico. Fale agora com nossa equipe em uma rápida <Link to="/auditoria" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">sessão de avaliação com consultores</Link>.
           </p>
           <Link to="/contato" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Quero um Plano de Link Building VIP
           </Link>
        </div>
      </section>
    </div>
  );
}

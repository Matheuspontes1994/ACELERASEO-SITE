import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Users, Search, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, BookOpen, LineChart, Cpu } from 'lucide-react';

export default function EspecialistaSeoPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-16 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>Especialista em SEO | Consultoria de Alto Desempenho</title>
        <meta name="description" content="Contrate um especialista em SEO sênior para alavancar suas vendas orgânicas. Otimização técnica, consultoria avançada e estratégias validadas de posicionamento no Google." />
        <link rel="canonical" href="https://aceleraseo.com.br/especialista-em-seo" />
        <meta property="og:title" content="Especialista em SEO | Consultoria de Alto Desempenho" />
        <meta property="og:description" content="Contrate um especialista em SEO sênior para alavancar suas vendas orgânicas. Otimização técnica, consultoria avançada e estratégias validadas de posicionamento no Google." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/especialista-em-seo" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Especialista em SEO | Consultoria de Alto Desempenho" />
        <meta name="twitter:description" content="Contrate um especialista em SEO sênior para alavancar suas vendas orgânicas. Otimização técnica, consultoria avançada e estratégias validadas de posicionamento no Google." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 px-5 mb-8 gap-2">
            <Target size={16} /> Consultoria Sênior Direcionada
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Contrate o Especialista em SEO que Faltava na Sua Equipe
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Mude o jogo orgânico da sua empresa com um <strong>Especialista de SEO focado em resultados</strong> rápidos (Quick Wins) e performance de longo prazo, reduzindo permanentemente seus custos de aquisição.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#experiencia" className="bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group px-10 py-5 gap-2">
              Conheça a Experiência <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/contato" className="bg-white border border-slate-200 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center group px-10 py-5 gap-2">
              Solicitar Contato Especializado
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28" id="experiencia">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Especialista em SEO apresentando resultados orgânicos" 
                 className="w-full h-full object-cover" 
               />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">Para Quem Exige Precisão e Senioridade</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 O papel de um <strong>Consultor SEO</strong> moderno não se limita apenas a incluir palavras-chave em conteúdos. Operar o funil orgânico de ponta a ponta exige compreensão completa de arquitetura web, logs de servidores e mapeamento de intenção de busca.
               </p>
               <p>
                 É aqui que um <strong>Especialista SEO focado em resultados</strong> entra em cena. Atuamos de forma consultiva e executiva diretamente no seu fluxo de desenvolvimento e marketing. 
               </p>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 font-display mt-10 mb-6 text-center md:text-left">O Que Nossos Analistas Sêniores Analisam:</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Investigação Avançada de <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">Problemas Técnicos</Link> Críticos (Auditoria Profunda).</span>
              </li>
              <li className="flex items-start gap-4">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Arquitetura de Informação e Silos de Conteúdo semântico.</span>
              </li>
              <li className="flex items-start gap-4">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Link Profile e Táticas Massivas de Aquisição de Backlinks Direcionados.</span>
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
                  A Rotina de um Especialista em Operações
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  Não entregamos relatórios automáticos. Nossos especialistas analisam e diagnosticam problemas complexos diretamente no seu ecossistema.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Search className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Pesquisa Avançada (Mapeamento)</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Identificamos oportunidades de "Low Hanging Fruits" (frutos mais baixos). Descobrimos termos rentáveis que seus concorrentes estão de fora e posicionamos o seu negócio usando intenção exata.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Cpu className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Engenharia On-Page</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Reestruturamos a infraestrutura do seu site, desde a semântica W3C até os microdados essenciais (Schema.org) necessários para acionar Rich Snippets e aumentar exponencialmente o seu CTR na busca orgânica.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <LineChart className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Execução e Roadmap</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Trabalhamos junto do seu time. Um especialista em SEO formula um escopo (Sprints) para que seus programadores não fiquem confusos. Mapeamos, validamos e metrificamos cada deployment realizado.
                   </p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <BookOpen className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">O Fim da Dependência em Tráfego Pago</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Aumente o patrimônio do seu negócio estabilizando líderes orgânicos no Google. <Link to="/blog" className="font-semibold text-brand-600 hover:opacity-80 underline underline-offset-2">Estude com nossos especialistas no Blog</Link>, ou marque uma reunião técnica executável agora mesmo.
           </p>
           <Link to="/contato" className="bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 transition-colors shadow-2xl shadow-brand-500/20 inline-flex items-center group px-12 py-6 gap-4">
             Falar com o Especialista
           </Link>
        </div>
      </section>

    </div>
  );
}

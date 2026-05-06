import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Users, Search, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, BookOpen, LineChart, Cpu, FileSearch, Code2, Rocket, BarChart2 } from 'lucide-react';
import { ServiceRoadmap } from '../components/ServiceRoadmap';
import { ServiceFAQ } from '../components/ServiceFAQ';

export default function EspecialistaSeoPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
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
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Expertise Sênior & Performance
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8">
                Contrate o Especialista que seu <span className="text-brand-600">SEO</span> Merece.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                Mude o jogo orgânico da sua empresa com a expertise de uma <Link to="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de SEO</Link> focada em resultados rápidos e performance de longo prazo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Solicitar Contato <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#experiencia" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Conheça a Experiência
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
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop" 
                      alt="Especialista em SEO Analisando Performance" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating labels inside card */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">Nível de Expertise</p>
                      <p className="text-sm font-extrabold text-slate-900">Consultoria Sênior 10+ anos</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <Target size={24} />
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

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24" id="experiencia">
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
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-left md:text-left">
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
                <span className="text-slate-700 text-lg">Investigação Avançada de <Link to="/auditoria" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">Problemas Técnicos</Link> Críticos (Auditoria Profunda).</span>
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

      {/* Roadmap Section */}
      <ServiceRoadmap 
        title="Jornada de Atuação do Especialista"
        subtitle="Não entregamos relatórios automáticos. Nossos especialistas analisam e diagnosticam problemas complexos diretamente no seu ecossistema."
        steps={[
          {
            title: "Mapeamento e Quick Wins",
            description: "Identificamos oportunidades de ganhos rápidos (frutos mais baixos). Descobrimos termos rentáveis que seus concorrentes estão ignorando e posicionamos o seu negócio usando intenção exata.",
            icon: <FileSearch size={24} />
          },
          {
            title: "Engenharia On-Page",
            description: "Reestruturamos a infraestrutura do seu site, desde a semântica W3C até os microdados essenciais (Schema.org) necessários para aumentar seu CTR na busca orgânica.",
            icon: <Code2 size={24} />
          },
          {
            title: "Execução Técnica (Sprints)",
            description: "Trabalhamos junto do seu time. Formulamos escopos claros (Sprints) para que seus programadores não fiquem confusos. Validamos cada deployment realizado em tempo real.",
            icon: <Rocket size={24} />
          },
          {
            title: "Consolidação e Escala",
            description: "Com a fundação sólida, escalamos a autoridade do domínio através de estratégias avançadas de aquisição de links e expansão de mercado orgânico.",
            icon: <BarChart2 size={24} />
          }
        ]}
      />

      {/* FAQ Section */}
      <ServiceFAQ 
        faqs={[
          {
            question: "Qual a diferença entre um consultor e um especialista?",
            answer: "Enquanto um consultor muitas vezes foca apenas no direcionamento, nosso serviço de especialista é focado na operação. Entramos no seu Slack, Trello ou Jira para garantir que as coisas aconteçam."
          },
          {
            question: "Como é feita a medição de resultados?",
            answer: "Utilizamos dashboards avançados (Looker Studio) integrados ao Google Search Console e GA4 para monitorar o crescimento de impressões, cliques e principalmente conversões assistidas pelo SEO."
          },
          {
            question: "Vocês atendem e-commerces?",
            answer: "Sim, temos especialistas focados em SEO para e-commerce que compreendem as nuances de plataformas como Vtex, Shopify e Magento."
          },
          {
            question: "O que recebo de entregáveis?",
            answer: "Roadmaps técnicos, documentos de pautas de conteúdo, especificações para desenvolvedores e relatórios de performance mensal detalhando o crescimento orgânico."
          }
        ]}
      />

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
           <BookOpen className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center px-4">O Fim da Dependência em Tráfego Pago</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-left md:text-center px-4">
             Aumente o patrimônio do seu negócio estabilizando líderes orgânicos no Google. <Link to="/blog" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">Estude com nossos especialistas no Blog</Link>, ou marque uma reunião técnica executável agora mesmo.
           </p>
           <Link to="/contato" className="bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 transition-colors shadow-2xl shadow-brand-500/20 inline-flex items-center group px-12 py-6 gap-4">
             Falar com o Especialista
           </Link>
        </div>
      </section>

    </div>
  );
}

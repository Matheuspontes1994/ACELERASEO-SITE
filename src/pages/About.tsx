import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Target, Zap, Shield, Users, ArrowRight, Building, Award, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JsonLd, generateBreadcrumbSchema } from '../components/JsonLd';

export default function About() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Acelera SEO",
    "url": "https://aceleraseo.com.br",
    "logo": "https://aceleraseo.com.br/logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/acelera-seo"
    ],
    "description": "Agência boutique de SEO técnico e estratégico focada em performance orgânica e crescimento exponencial de tráfego.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-31-99922-9927",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      <Helmet>
        <title>Sobre a Agência SEO | Acelera SEO Especialistas</title>
        <meta name="description" content="Conheça a agência de marketing SEO especializada em transformar a sua engenharia de busca em lucro previsível. Fazemos muito mais do que simples SEO para sites." />
        <link rel="canonical" href="https://aceleraseo.com.br/sobre" />
        <meta property="og:title" content="Sobre a Agência SEO | Acelera SEO Especialistas" />
        <meta property="og:description" content="Conheça a agência de marketing SEO especializada em transformar a sua engenharia de busca em lucro previsível. Fazemos muito mais do que simples SEO para sites." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/sobre" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <JsonLd data={organizationSchema} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Início', item: 'https://aceleraseo.com.br/' },
        { name: 'Sobre Nós', item: 'https://aceleraseo.com.br/sobre' }
      ])} />

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
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Nossa Identidade
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8 text-balance">
                Decodificamos a Web para <span className="text-brand-600 italic">Potencializar</span> Negócios.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                A Acelera SEO nasceu do compromisso com o <span className="text-slate-900 font-medium font-display italic">SEO técnico raiz</span>. Somos uma agência boutique focada em performance e crescimento orgânico real.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Fale com um Especialista <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/servicos" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Ver Soluções Técnicas
                </Link>
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
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop" 
                      alt="Sobre a Acelera SEO" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">Performance Garantida</p>
                      <p className="text-sm font-extrabold text-slate-900">Especialistas Sêniores</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <Award size={24} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-400/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-200/5 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Equipe de especialistas sêniores na agência Acelera SEO debatendo métricas e performance de ranking." 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 decoding="async"
               />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">A Visão por Trás da Máquina</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 Diferente do mercado tradicional de marketing 360º que faz de tudo um pouco e não foca em nada, a Acelera SEO é um laboratório focado em uma única disciplina: <strong>Dominar a SERP do Google</strong>.
               </p>
               <p>
                 Nossa equipe atua em profunda sinergia entre <Link to="/servicos" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">soluções estratégicas de SEO para sites</Link>, desenvolvimento backend ágil e relações públicas estruturadas corporativamente para aquisição de links.
               </p>
               <p>
                 Se o seu negócio precisa ser encontrado hoje para não perder faturamento amanhã, você encontrou a parceria ideal. Construímos pontes sólidas sustentadas pela nossa metodologia técnica exclusiva.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-slate-900 py-32 mb-28">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-8 lg:mb-20">
               <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-center">
                  Os Princípios da Acelera SEO
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  Estes são os quatro pilares inegociáveis que sustentam todas as nossas operações técnicas na agência.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-8">
                <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6"><Target size={28} className="text-brand-400" /></div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Foco em Receita</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed text-justify md:text-left">Não priorizamos ego ou tráfego inútil. Buscamos as palavras-chave que trazem clientes com cartão de crédito na mão (Fundo de funil).</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-8">
                <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6"><Zap size={28} className="text-brand-400"/></div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Velocidade</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed text-justify md:text-left">Resultados de SEO levam tempo, mas iniciamos as correções com otimizações de impacto rápido (Quick Wins) para gerar tração veloz.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-8">
                <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6"><Shield size={28} className="text-brand-400"/></div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Segurança White Hat</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed text-justify md:text-left">Dormimos tranquilos. Usamos apenas táticas limpas aprovadas pelas diretrizes do Google, garantindo resultados não-penalizáveis e íntegros.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-8">
                <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6"><Users size={28} className="text-brand-400"/></div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Pactos Transparentes</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed text-justify md:text-left">Ocultar os processos não é nosso estilo. Nossos clientes têm acesso restrito aos dashboards, tarefas táticas semanais e documentações de engenharia.</p>
              </motion.div>
            </div>
         </div>
      </section>

      {/* História / Founder */}
      <section id="nossa-historia" className="max-w-6xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="md:w-5/12 relative min-h-[400px] h-full w-full">
             {/* Substitua a URL abaixo pela sua foto se quiser */}
             <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
               alt="Equipe Acelera SEO" 
               className="absolute inset-0 w-full h-full object-cover" 
               loading="lazy"
               decoding="async"
             />
          </div>
          <div className="md:w-7/12 p-10 md:p-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-bold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">O DNA Técnico</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-lg mb-10 text-justify md:text-left">
              <p>
                Com anos de experiência cruzando desenvolvimento web e marketing digital orgânico de larga escala, a Acelera SEO foi fundada após avaliarmos um vácuo persistente: a carência de uma <strong>agência de SEO</strong> que aliasse profundo conhecimento raiz em algoritmo, linguagens de programação e curadoria de autoridade Off-Page.
              </p>
              <p>
                A maioria das empresas sofriam para passar de uma básica <strong>auditoria de SEO</strong>, travando seus projetos em checklists infinitos sem priorização.
              </p>
              <p>
                Hoje temos orgulho de tratar cada site corporativo de um parceiro como se fosse um ativo vivo de software, onde o crescimento se encontra na margem da performance de front-end com os pilares sagrados do Google. Recomendo começar acessando o nosso <Link to="/blog" className="font-semibold underline underline-offset-2 hover:opacity-80 text-brand-600 transition-opacity">blog especializado</Link>.
              </p>
            </div>
            
            <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 gap-6 p-6">
               <div>
                 <h4 className="font-extrabold text-slate-900 text-xl">Acelera SEO</h4>
                 <p className="text-brand-600 font-medium tracking-wide uppercase text-sm mt-1">Especialistas em SEO Estratégico</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white border-t border-slate-100 py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">Pronto para dominar sua indústria?</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Pare de vender o seu posicionamento natural para empresas que possuem um site muito inferior ao seu.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://wa.me/5531999229927?text=Ol%C3%A1%2C+gostaria+de+falar+com+os+especialistas+da+Acelera+SEO!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center justify-center group px-12 py-6 gap-4">
                Explorar Solução Dedicada
              </a>
              <Link to="/servicos" className="bg-white border border-slate-200 text-slate-700 font-bold text-xl rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center px-12 py-6 gap-2">
                Ver Nossas Soluções <ArrowRight size={20} />
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
}

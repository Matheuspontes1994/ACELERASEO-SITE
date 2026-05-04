import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Target, Zap, Shield, Users, ArrowRight, Building, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre a Agência SEO | Acelera SEO Especialistas" />
        <meta name="twitter:description" content="Conheça a agência de marketing SEO especializada em transformar a sua web performance de busca em lucro através de tráfego orgânico." />
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
            <Building size={16} /> Nossa Essência
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Engenharia de Busca Focada no Crescimento Corporativo
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            A Acelera SEO nasceu de uma frustração simples com o mercado: estamos fartos de empresas que vendem "achismos" disfarçados de estratégia. Como uma verdadeira <strong>agência de marketing SEO</strong>, somos movidos a dados, testes validados e <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">auditoria técnica de SEO rigorosa</Link>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#nossa-historia" className="bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group px-10 py-5 gap-2">
              Conheça Nossa História <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Equipe de especialistas sêniores na agência Acelera SEO debatendo métricas e performance de ranking." 
                 className="w-full h-full object-cover" 
               />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white rounded-[2rem] shadow-2xl max-w-[280px] border border-slate-100 p-6 md:p-8">
               <div className="flex items-center gap-4 mb-3">
                 <div className="bg-brand-100 rounded-full text-brand-600 p-3">
                    <Award size={24} />
                 </div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Excelência</div>
               </div>
               <div className="text-3xl font-black text-slate-900 mb-2">Top 1%</div>
               <p className="text-slate-500 text-sm font-medium text-justify md:text-left">Das equipes especializadas no mercado de tráfego orgânico.</p>
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
             <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" alt="Equipe Acelera SEO" className="absolute inset-0 w-full h-full object-cover" />
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
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+gostaria+de+falar+com+os+especialistas+da+Acelera+SEO!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center justify-center group px-12 py-6 gap-4">
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

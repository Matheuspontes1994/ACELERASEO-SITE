import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Users, Search, CheckCircle2, TrendingUp, Lightbulb, FileText, ArrowRight } from 'lucide-react';

export default function ConsultoriaSeoPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>Consultoria SEO Especializada | Acelere o Crescimento do seu Time</title>
        <meta name="description" content="Consultoria SEO técnica e estratégica. Entregamos roadmaps de alto impacto, documentação para desenvolvedores e direcionamento para equipes de marketing." />
        <link rel="canonical" href="https://acelera-seo.com.br/consultoria-seo" />
        <meta property="og:title" content="Consultoria SEO Especializada | Agência de Alta Performance" />
        <meta property="og:description" content="Consultoria SEO técnica e estratégica. Entregamos roadmaps de alto impacto e direcionamento para equipes de marketing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://acelera-seo.com.br/consultoria-seo" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 px-5 mb-8 gap-2">
            <Target size={16} /> Mentoria & Consultoria Avançada
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Empodere sua Equipe com Estratégia de SEO Orientada a Dados
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Não terceirize o que sua equipe pode aprender. Nossa <strong>Consultoria SEO</strong> foi moldada para guiar times internos de marketing e tecnologia rumo às melhores práticas de otimização orgânica, com metodologias testadas em operações de alta performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contato" className="bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group px-10 py-5 gap-2">
               Falar com um Consultor SEO Sênior <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
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


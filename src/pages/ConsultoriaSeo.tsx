import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Users, Search, CheckCircle2, TrendingUp, Lightbulb, FileText, ArrowRight, ShieldAlert, Zap, BarChart3, Settings2 } from 'lucide-react';
import { JsonLd } from '../components/JsonLd';
import { ServiceRoadmap } from '../components/ServiceRoadmap';
import { ServiceFAQ } from '../components/ServiceFAQ';

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
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Mentoria & Consultoria Avançada
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8">
                Empodere seu Time com SEO <span className="text-brand-600">Estratégico</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                Nossa <strong>Consultoria SEO</strong> foi moldada para guiar times internos rumo às melhores práticas de otimização, com metodologias testadas em operações de alta performance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Falar com Especialista <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#experiencia" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Ver Metodologia
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
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop" 
                      alt="Estrategistas de SEO em reunião de consultoria" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating labels inside card */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">Status do Projeto</p>
                      <p className="text-sm font-extrabold text-slate-900">Otimização Ativa 98%</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <TrendingUp size={24} />
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
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
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
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-left md:text-left">
               <p>
                 Você tem os desenvolvedores e os redatores, mas não sabe por onde começar ou o que priorizar? É exatamente nesse cenário de desorganização tática que a nossa <Link to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">consultoria de search engine optimization</Link> se encaixa perfeitamente.
               </p>
               <p>
                 Atuamos como um cérebro analítico terceirizado. Nossa equipe realiza as investigações altamente técnicas em logs, código fonte e concorrência, e devolve para as suas lideranças apenas o <Link to="/servicos" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">plano de ação priorizado</Link> (Roadmap) pronto para ser inserido nos sprints do seu desenvolvimento.
               </p>
               <p>
                 Sem achismos, sem tentativas e falhas. Encurte a jornada da sua empresa. Deixe a nossa <Link to="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de SEO</Link> liderar a sua <Link to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">arquitetura</Link>, enquanto sua equipe opera a longo prazo com acompanhamento quinzenal dos nossos diretores.
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
                <span className="text-slate-700 text-lg">Alinhamento entre as estruturas <Link to="/seo-ecommerce" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">SEO para e-commerce</Link>, conteúdo institucional e integrações.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <ServiceRoadmap 
        title="O Ciclo da nossa Consultoria SEO"
        subtitle="Não trabalhamos com relatórios automatizados. Nosso diferencial é a curadoria humana em cada etapa técnica e estratégica."
        steps={[
          {
            title: "Diagnóstico e Raio-X",
            description: <>Iniciamos com uma imersão na saúde atual do domínio. Identificamos as perdas invisíveis (páginas canibalizadas, thin content, códigos quebrados) através de uma minuciosa <Link to="/auditoria" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">auditoria técnica</Link> especializada.</>,
            icon: <Search size={24} />
          },
          {
            title: "Masterplan Estratégico",
            description: <>Criamos o plano de ataque. Mapeamos os clusters de tópicos e as deficiências de palavras-chave da sua operação frente aos concorrentes, orientando o seu time de redação exatamente em qual <Link to="/blog" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">estratégia de conteúdo</Link> focar.</>,
            icon: <Settings2 size={24} />
          },
          {
            title: "Execução e Sprints",
            description: "Trabalhamos em ciclos quinzenais com sua equipe. Validamos cada implementação técnica e garantimos que o roadmap de SEO seja seguido à risca pelos seus desenvolvedores.",
            icon: <Zap size={24} />
          },
          {
            title: "Monitoramento e SEO ROI",
            description: <>Acompanhamento em tempo real do crescimento de <Link to="/agencia-link-building" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">autoridade de domínio</Link> e tráfego orgânico, com foco total na conversão e no retorno sobre o investimento realizado na consultoria.</>,
            icon: <BarChart3 size={24} />
          }
        ]}
      />

      {/* FAQ Section */}
      <ServiceFAQ 
        faqs={[
          {
            question: "Quanto tempo dura um contrato de consultoria?",
            answer: "Nossos contratos padrão têm duração de 6 a 12 meses. O SEO é um canal de médio a longo prazo, e esse tempo é necessário para que as correções técnicas e a autoridade construída maturarem no Google."
          },
          {
            question: "O que recebo mensalmente?",
            answer: "Você recebe o acompanhamento direto de um analista sênior, reuniões periódicas de alinhamento, auditorias técnicas constantes e o Roadmap priorizado para sua equipe de marketing e TI executar."
          },
          {
            question: "Vocês implementam as alterações no site?",
            answer: "No modelo de consultoria, nós fornecemos toda a documentação técnica (issues) detalhada para que o seu time de desenvolvimento interno realize as alterações. Também validamos se a implementação foi feita corretamente."
          },
          {
            question: "Para quem é indicada a consultoria?",
            answer: "É ideal para empresas que já possuem uma equipe interna (desenvolvedores e redatores), mas precisam de uma inteligência estratégica especializada para direcionar o trabalho e garantir resultados."
          }
        ]}
      />

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Lightbulb className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center px-4">Pare de andar no escuro orgânico.</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-left md:text-center px-4">
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


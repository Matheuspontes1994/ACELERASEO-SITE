import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Activity, 
  Link as LinkIcon, 
  PenTool, 
  ArrowRight, 
  CheckCircle2,
  LineChart,
  Code2,
  Cpu
} from 'lucide-react';

const services = [
  {
    id: "auditoria-tecnica",
    icon: <Activity size={32} className="text-brand-500" />,
    title: "Auditoria de SEO Técnico",
    description: "Revisão profunda no código, velocidade e arquitetura do seu site para garantir que o Google rastreie e indexe suas páginas sem obstáculos.",
    features: ["Análise de Core Web Vitals e PageSpeed", "Otimização de rastreamento (Crawl Budget)", "Correção de erros estruturais e Server Logs", "Implementação de Dados Estruturados (Schema)"],
  },
  {
    id: "consultoria-seo",
    icon: <LineChart size={32} className="text-brand-500" />,
    title: "Consultoria Estratégica",
    description: "Direcionamento cirúrgico focado em conversão. Não buscamos apenas cliques e impressões, buscamos usuários no fundo de funil, prontos para a compra.",
    features: ["Mapeamento Avançado de Keyword Clusters", "Análise de Arquitetura de Informação", "Roadmaps técnicos para o time de desenvolvimento", "Implementação de estratégias em E-commerce"],
  },
  {
    id: "link-building",
    icon: <LinkIcon size={32} className="text-brand-500" />,
    title: "Link Building e Digital PR",
    description: "Aceleração exponencial da Autoridade (DR/DA). Nossa equipe gere projetos massivos de assessoria e garantimos inserções em portais premium do Brasil e LATAM.",
    features: ["Venda de Backlinks Dofollow e Seguros", "Digital PR Focado em Notícias", "Aproveitamento e Recuperação de Link Juice", "Disavow Técnico (Limpeza de links tóxicos)"],
  },
  {
    id: "conteudo-seo",
    icon: <PenTool size={32} className="text-brand-500" />,
    title: "SEO de Conteúdo Semântico",
    description: "Alinhamento das intenções de busca com as respostas oferecidas pelo seu site, cobrindo o modelo E-E-A-T do algoritmo e silando o seu conhecimento.",
    features: ["Matriz e Clusters de Conteúdo Funcional", "Criação de Topic Clusters Estruturados", "Revitalização e Otimização de Artigos Legados", "Gestão de Briefings baseados em SERP"],
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>Nossos Serviços | Agência de SEO Focada em Resultados e Venda de Backlinks</title>
        <meta name="description" content="Conheça nossas soluções completas como uma das melhores agências de marketing SEO. Oferecemos tudo, desde auditorias técnicas até venda de backlinks e SEO para sites." />
        <link rel="canonical" href="https://aceleraseo.com.br/servicos" />
        <meta property="og:title" content="Nossos Serviços | Agência de SEO Focada em Resultados e Venda de Backlinks" />
        <meta property="og:description" content="Conheça nossas soluções completas como uma das melhores agências de marketing SEO. Oferecemos tudo, desde auditorias técnicas até venda de backlinks e SEO para sites." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/servicos" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nossos Serviços | Agência de SEO Focada em Resultados" />
        <meta name="twitter:description" content="Desde auditorias técnicas até Link Building avançado. Estratégias táticas para a escalabilidade da sua receita online." />
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
            <Cpu size={16} /> Nossas Soluções de SEO Táticas
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Estratégias de SEO Avançadas para Dominar Buscas Competitivas
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Diferente de uma agência tradicional, operamos como uma engenharia de busca focada estritamente no avanço do seu faturamento e tráfego orgânico.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+quero+saber+mais+sobre+os+servi%C3%A7os+de+SEO!" target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center group px-10 py-5 gap-2">
              Agendar Reunião Técnica <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </a>
            <Link to="/auditoria" className="bg-white border border-slate-200 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center px-10 py-5 gap-2">
              Fazer Auditoria do Site Integrada
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Intro Context */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display mb-8 text-center md:text-left">A Morte do SEO Baseado em "Achismo"</h2>
            <div className="space-y-6 text-slate-300 leading-relaxed font-light text-lg text-justify md:text-left">
               <p>
                 Ao longo da última década, o SEO no Brasil foi reduzido a táticas simplórias de adicionar palavras-chave em títulos. Essa abordagem parou de funcionar em 2018. Hoje, o algoritmo do Google recruta inteligência artificial para avaliar arquitetura, intenção e autoridade real.
               </p>
               <p>
                 A Acelera SEO trabalha exclusivamente resolvendo problemas complexos usando nossas suítes de ferramentas avançadas, log analisys e campanhas parrudas de off-page para destravar o tráfego bloqueado.
               </p>
            </div>
            <ul className="space-y-5 border-t border-slate-800 mt-8 pt-8">
              <li className="flex items-start gap-4">
                <Code2 className="text-brand-400 shrink-0 mt-1" size={24} />
                <span className="text-slate-200 text-lg">Tratamos SEO como Engenharia de Software focada em captação de Leads.</span>
              </li>
              <li className="flex items-start gap-4">
                <Search className="text-brand-400 shrink-0 mt-1" size={24} />
                <span className="text-slate-200 text-lg">Realizamos a <Link to="/auditoria" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">auditoria técnica avançada</Link> aliada ao crescimento corporativo.</span>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border border-slate-700 bg-slate-800/80">
               <img 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Métricas complexas, log server analysis e dashboards orientando equipe técnica em otimização web." 
                 className="w-full h-full object-cover opacity-80" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto space-y-16 px-6 mb-28">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-8 lg:mb-16">
           <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-6 text-center md:text-center">Nosso Arsenal de Crescimento</h2>
           <p className="text-lg text-slate-600 font-light text-justify md:text-left">Seja na correção invisível da arquitetura do servidor, orientando equipes internas, até campanhas milionárias em autoridade.</p>
        </div>

        {services.map((service, idx) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-200 flex flex-col xl:flex-row shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="xl:w-5/12 flex flex-col items-start bg-slate-50 border-b xl:border-b-0 xl:border-r border-slate-100 p-10 md:p-16">
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shadow-sm mb-8">
                {service.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 font-display leading-tight mb-6 text-center md:text-left">{service.title}</h3>
              <p className="text-slate-600 font-light text-lg leading-relaxed mb-10 text-justify md:text-left">
                {service.description}
              </p>
              <a href={`https://wa.me/5511999999999?text=Quero+saber+detalhes+sobre+${service.title}`} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center bg-white border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-100 transition-colors gap-3 px-8 py-4">
                Solicitar Proposta Comercial <ArrowRight size={18} />
              </a>
            </div>

            <div className="xl:w-7/12 relative bg-white flex flex-col justify-center p-10 md:p-16">
              <h4 className="text-base font-bold uppercase tracking-widest text-brand-600 flex items-center mb-8 gap-3">
                 <CheckCircle2 size={20} className="text-brand-500" /> Principais Entregas
              </h4>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-2.5 shrink-0"></div>
                    <span className="text-slate-800 font-medium text-lg leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Final CTA */}
      <section className="bg-white border-t border-slate-100 py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Activity className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">O mercado orgânico não espera.</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Enquanto você adia a priorização do seu projeto de SEO, seus concorrentes assumem a demanda e coletam a sua receita. Inicie com quem aplica performance validada na última década. Descubra mais <Link to="/sobre" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">sobre a nossa metodologia</Link>.
           </p>
           <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+iniciar+meu+projeto+de+SEO!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Reservar Espaço para Atendimento
           </a>
        </div>
      </section>
    </div>
  );
}

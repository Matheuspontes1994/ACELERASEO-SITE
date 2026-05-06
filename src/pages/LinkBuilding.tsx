import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Target, TrendingUp, ShieldCheck, Activity, Globe, Award, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { JsonLd } from '../components/JsonLd';

export default function LinkBuildingPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
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

      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 px-5 mb-8 gap-2">
            <LinkIcon size={16} /> Link Building de Alta Performance
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Autoridade Digital que Conquista a 1ª Página do Google
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Não adianta ter o melhor conteúdo do mundo se o Google não enxerga o seu site como uma referência. Nossa <strong>agência de link building</strong> atua fornecendo credibilidade através da <strong>venda de backlinks</strong> estratégicos, elevando o seu Domain Rating (DR).
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contato" className="bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center group px-10 py-5 gap-2">
               Falar com um Especialista em Link Building
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Content Section 1: The Problem & The Concept */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div>
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">O que é Link Building e como impacta o seu SEO?</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 O processo de <strong>Link Building</strong> é o pilar mais crítico e desafiador do <strong>SEO Off-Page</strong>. Ele consiste em articular e conquistar links de outros sites respeitados da internet apontando diretamente para o seu domínio (os famosos <strong>backlinks</strong>).
               </p>
               <p>
                 Esses apontamentos funcionam como &quot;votos de confiança&quot; aos olhos do algoritmo de busca. Quanto mais portais jornalísticos, universidades e blogs de alto <strong>Domain Rating (DR)</strong> fizerem referências ao seu negócio, mais o Google entenderá que a sua empresa é a principal autoridade sobre aquele tema no Brasil.
               </p>
               <p>
                 É impossível rankear para palavras-chave altamente competitivas e de alto volume de busca contando apenas com conteúdo. Você precisa de <strong>autoridade</strong>. Nós ajudamos você a construir essa autoridade através de campanhas puras de <Link to="/servicos" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">Digital PR e prospecção ativa de parceiros</Link>.
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

      {/* Feature Grids */}
      <section className="bg-slate-900 py-32 mb-28">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-8 lg:mb-20">
               <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-center">
                  Nossa Metodologia Essencial contra as &quot;Fábricas de Links&quot;
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  O algoritmo rigoroso do <strong>Google Penguin</strong> varre a internet diariamente. Comprar backlinks tóxicos ou pacotes baratos de PBNs indianas destruirá a credibilidade da sua marca (Shadowban). Entenda como operamos com total segurança:
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Globe className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Digital PR Real</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Produzimos estudos de caso, pesquisas exclusivas do seu mercado e matérias densas. Nossa equipe de assessoria entra em contato com jornalistas e redações de grandes portais que, naturalmente, citam o seu estudo linkando para o seu site original de forma orgânica e livre de riscos.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Target className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Coesão Semântica</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Nós aplicamos a engenharia reversa nas SERPs focando na relevância tópica (Topical Authority). Não aceitamos que uma clínica médica receba um <strong>backlink</strong> de um blog de receitas de maquiagem. Filtramos estritamente o nicho do domínio parceiro.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <ShieldCheck className="text-brand-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Auditoria e Limpeza (Disavow)</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Parte de uma <strong>estratégia avançada de Link Building</strong> é remover as toxinas que âncoram o seu projeto. Usando as melhores ferramentas de mercado, filtramos todos os links apontados para você que estão gerando <em>spam score</em> e os rejeitamos através do Google Search Console. Faça uma <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">auditoria técnica de SEO conosco</Link> para investigar.
                   </p>
               </div>
            </div>
         </div>
      </section>

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
            
            <div className="absolute -bottom-8 -right-8 bg-white rounded-[2rem] shadow-2xl max-w-[280px] border border-slate-100 p-6 md:p-8">
               <div className="flex items-center gap-4 mb-3">
                 <div className="bg-green-100 rounded-full text-green-600 p-3">
                    <TrendingUp size={24} />
                 </div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">DR Médio</div>
               </div>
               <div className="text-4xl font-black text-slate-900">+ 55.0</div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
             <div className="inline-flex items-center bg-amber-100 text-amber-800 rounded-lg text-sm font-bold tracking-wide uppercase gap-2 px-4 py-2 mb-6">
                <Award size={18} /> Qualidade Absoluta
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display leading-[1.1] mb-8 text-center md:text-center">O fim dos pacotes cegos e listas perigosas.</h2>
             <p className="text-lg text-slate-600 font-light leading-relaxed mb-6 text-justify md:text-left">
                O modelo atrasado de <strong>venda de backlinks</strong> baseava-se em "Pacotes com 50 links de alta qualidade" onde o cliente não via nada. Isso é passado.
             </p>
             <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 text-justify md:text-left">
                A estruturação do Link Profile de uma marca requer transparência total. Você saberá exatamente de onde cada link está vindo, qual o DA/DR do projeto nativo e nós auxiliaremos na escolha da <strong>ancoragem (anchor text)</strong> perfeita para que pareça exatamente um voto orgânico e limpo. Isso protege o seu capital investido.
             </p>

             <Link to="/contato" className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-bold text-lg rounded-xl hover:bg-slate-200 transition-colors gap-3 px-8 py-4">
               Ver portfólio de cases Off-Page
             </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-100 py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Activity className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">Escale a Autoridade do seu Site Agora</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             A maior rede premium privada de publisher do mercado de buscas aliado à inteligência de negócio. Supere seus concorrentes nas SERPs com um planejamento de Off-Page estratégico. Fale agora com nossa equipe em uma rápida <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">sessão de avaliação com consultores</Link>.
           </p>
           <Link to="/contato" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Quero um Plano de Link Building VIP
           </Link>
        </div>
      </section>
    </div>
  );
}

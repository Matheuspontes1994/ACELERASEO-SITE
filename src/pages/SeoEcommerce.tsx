import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Search, Zap, CheckCircle2, BarChart, Tag, Layers, Activity, FileSearch, Code2, Rocket, BarChart3, ArrowRight } from 'lucide-react';
import { JsonLd } from '../components/JsonLd';
import { ServiceRoadmap } from '../components/ServiceRoadmap';
import { ServiceFAQ } from '../components/ServiceFAQ';

export default function SeoEcommercePage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      <Helmet>
        <title>SEO para E-commerce | Aumente as Vendas da sua Loja Virtual</title>
        <meta name="description" content="Escale o faturamento da sua loja virtual saindo da dependência de anúncios. Agência especialista em SEO para E-commerce, categorias e Core Web Vitals." />
        <link rel="canonical" href="https://aceleraseo.com.br/seo-ecommerce" />
        <meta property="og:title" content="SEO para E-commerce | Aumente as Vendas da sua Loja Virtual" />
        <meta property="og:description" content="Escale o faturamento da sua loja virtual saindo da dependência de anúncios. Agência especialista em SEO para E-commerce, categorias e Core Web Vitals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/seo-ecommerce" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO para E-commerce | Aumente as Vendas da sua Loja Virtual" />
        <meta name="twitter:description" content="Escale o faturamento da sua loja virtual saindo da dependência de anúncios. Agência especialista em SEO para E-commerce, categorias e Core Web Vitals." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "SEO para E-commerce",
        "description": "Estratégias de SEO técnico, conteúdo e link building focadas em aumentar as vendas orgânicas de lojas virtuais.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "Acelera SEO",
          "url": "https://aceleraseo.com.br"
        },
        "serviceType": "Search Engine Optimization"
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
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> SEO de Performance para Varejo
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8">
                O SEO que Multiplica suas <span className="text-brand-600">Vendas</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                Chega de depender exclusivamente de tráfego pago. Escalar o faturamento da sua loja de forma orgânica e previsível é o nosso negócio. Nossa <Link to="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de SEO</Link> conserta a estrutura do seu e-commerce.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/auditoria" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Auditoria de E-commerce <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#metodologia" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Ver Cases de Sucesso
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
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop" 
                      alt="Performance de E-commerce e Vendas Orgânicas" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating labels inside card */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">ROI Orgânico</p>
                      <p className="text-sm font-extrabold text-slate-900">Conversão +120%</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <ShoppingCart size={24} />
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

      {/* Intro & The Real Challenge */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Especialista de performance de e-commerce analisando um terminal de pagamentos e a tela de vendas demonstrando alta conversão através de tráfego orgânico" 
                 className="w-full h-full object-cover" 
               />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">Aumente sua Conversão com Tráfego Orgânico</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-left md:text-left">
               <p>
                 Quando se trata de varejo online, não basta apenas atrair acessos curiosos; é preciso fisgar o cliente que já está com o cartão na mão (Fundo de Funil). Nosso serviço de <strong>SEO para e-commerce</strong> otimiza suas páginas estruturais para intenção transacional.
               </p>
               <p>
                 A maioria das lojas virtuais sofre com rastreamento "aranha" incorreto (Crawl Budget). Elas indexam acidentalmente milhares de páginas duplicadas graças aos links de paginação e filtros desorganizados, o que suga o poder do domínio. Nós solucionamos a <Link to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">Faceted Navigation</Link> para focar a força do ranqueamento onde realmente importa: nas categorias e produtos mais lucrativos.
               </p>
               <p>
                 Você tem interesse em como organizamos seu catálogo em clusters? Confira a nossa página de <Link to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">Consultoria de SEO técnico</Link> para equipes in-house.
               </p>
            </div>
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Tagueamento e Marcação Schema (Rich Snippets) para exibir preços e avaliações no Google.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Eliminação de canibalização de palavras-chave entre páginas de categorias e blog corporativo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <ServiceRoadmap 
        title="O Caminho do Lucro Orgânico"
        subtitle="Construímos fundações sólidas em desempenho, autoridade e indexabilidade para sua loja virtual faturar mais."
        steps={[
          {
            title: "Auditoria de Catálogo e TI",
            description: "Identificamos erros de Crawl Budget, Faceted Navigation e Core Web Vitals. Mapeamos tudo o que impede o Google de indexar seus produtos corretamente.",
            icon: <FileSearch size={24} />
          },
          {
            title: "Taxonomia e On-Page",
            description: "Reestruturamos categorias silo e URLs parametrizadas. Implementamos Schema.org avançado para exibir preços e avaliações diretamente nos resultados de busca.",
            icon: <Code2 size={24} />
          },
          {
            title: "Conteúdo Transacional",
            description: "Otimizamos suas descrições de produtos e categorias para intenção de compra. Eliminamos a canibalização entre blog e loja virtual.",
            icon: <Rocket size={24} />
          },
          {
            title: "Escala de Autoridade de Vitrine",
            description: <>Direcionamos força de <Link to="/agencia-link-building" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">backlinks</Link> para as categorias mais lucrativas da sua loja, aumentando a relevância comercial do seu domínio perante os concorrentes.</>,
            icon: <BarChart3 size={24} />
          }
        ]}
      />

      {/* FAQ Section */}
      <ServiceFAQ 
        faqs={[
          {
            question: "Vocês atendem quais plataformas de e-commerce?",
            answer: "Atendemos todas as principais plataformas do mercado: Vtex, Shopify, Nuvemshop, Magento, WooCommerce, Tray e Loja Integrada. Cada uma possui suas particularidades técnicas que dominamos."
          },
          {
            question: "SEO para e-commerce demora muito a dar resultado?",
            answer: "Os primeiros resultados em termos de indexação ocorrem nas primeiras semanas. Resultados em faturamento costumam ser visíveis a partir do 3º ou 4º mês de execução constante."
          },
          {
            question: "Como o SEO ajuda a reduzir o CAC?",
            answer: "Ao estabilizar sua marca no tráfego orgânico, você deixa de pagar por cada clique que recebe. Isso reduz o custo de aquisição (CAC) e aumenta a margem líquida da sua operação."
          },
          {
            question: "A auditoria de e-commerce é gratuita?",
            answer: "Realizamos uma avaliação inicial para entender o cenário. A auditoria técnica profunda faz parte do escopo de contratação da consultoria ou serviço especializado."
          }
        ]}
      />

      {/* Call to action */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <BarChart className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center px-4">Vamos acelerar suas vendas?</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-left md:text-center px-4">
             Faça uma profunda <Link to="/auditoria" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">auditoria técnica exclusiva para e-commerces</Link>. Identifique gargalos na jornada do consumidor e descubra o verdadeiro potencial oculto de faturamento no seu catálogo.
           </p>
           <a href="https://wa.me/5531999229927?text=Ol%C3%A1%2C+quero+saber+mais+sobre+o+servi%C3%A7o+de+SEO+para+Ecommerce!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Solicitar Análise da minha Loja Virtual
           </a>
        </div>
      </section>
    </div>
  );
}

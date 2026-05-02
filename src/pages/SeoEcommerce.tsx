import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Search, Zap, CheckCircle2, BarChart, Tag, Layers, Activity } from 'lucide-react';

export default function SeoEcommercePage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>SEO para E-commerce | Aumente as Vendas da sua Loja Virtual</title>
        <meta name="description" content="Escale o faturamento da sua loja virtual saindo da dependência de anúncios. Agência especialista em SEO para E-commerce, categorias e Core Web Vitals." />
        <link rel="canonical" href="https://acelera-seo.com.br/seo-ecommerce" />
        <meta property="og:title" content="SEO para E-commerce | Aumente as Vendas da sua Loja Virtual" />
        <meta property="og:description" content="Escale o faturamento da sua loja virtual saindo da dependência de anúncios. Agência especialista em SEO para E-commerce, categorias e Core Web Vitals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://acelera-seo.com.br/seo-ecommerce" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 px-5 mb-8 gap-2">
            <ShoppingCart size={16} /> Especialistas em Lojas Virtuais
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            O SEO para E-commerce que Multiplica suas Vendas
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Chega de depender exclusivamente de tráfego pago. Escalar o faturamento da sua loja de forma orgânica e previsível é o nosso negócio. Nós consertamos a estrutura do seu e-commerce para dominar as buscas do Google no momento exato em que seu cliente quer comprar.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auditoria" className="bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center group px-10 py-5 gap-2">
               Solicitar Auditoria de E-commerce
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Intro & The Real Challenge */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Especialista de performance de e-commerce analisando um terminal de pagamentos e a tela de vendas demonstrando alta conversão através de tráfego orgânico" 
                 className="w-full h-full object-cover" 
               />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-[240px] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tráfego Qualificado</div>
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">+127% de ROI</div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">Aumente sua Conversão com Tráfego Orgânico</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 Quando se trata de varejo online, não basta apenas atrair acessos curiosos; é preciso fisgar o cliente que já está com o cartão na mão (Fundo de Funil). Nosso serviço de <strong>SEO para e-commerce</strong> otimiza suas páginas estruturais para intenção transacional.
               </p>
               <p>
                 A maioria das lojas virtuais sofre com rastreamento "aranha" incorreto (Crawl Budget). Elas indexam acidentalmente milhares de páginas duplicadas graças aos links de paginação e filtros desorganizados, o que suga o poder do domínio. Nós solucionamos a <strong>Faceted Navigation</strong> para focar a força do ranqueamento onde realmente importa: nas categorias e produtos mais lucrativos.
               </p>
               <p>
                 Você tem interesse em como organizamos seu catálogo em clusters? Confira a nossa página de <Link to="/consultoria-seo" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">Consultoria de SEO técnico</Link> para equipes in-house.
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

      {/* Metodology Grid */}
      <section className="bg-slate-900 py-32 mb-28">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-8 lg:mb-20">
               <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-center">
                  Nossos Pilares Técnicos para Lojas Virtuais
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  Para uma loja virtual faturar com SEO, precisamos ir muito além de otimizar meta descriptions. Construímos fundações em desempenho, autoridade e indexabilidade.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl hover:-translate-y-2 transition-transform duration-300 p-10">
                  <Zap className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Core Web Vitals</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     A velocidade da sua loja impacta não apenas o ranqueamento, mas a taxa de conversão final (CRO). Trabalhamos lado a lado para ajustar TTFB, LCP e CLS, tornando seu site instantâneo, seja em Vtex, Shopify, Nuvemshop ou Magento.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl hover:-translate-y-2 transition-transform duration-300 p-10">
                  <Layers className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Taxonomia e Filtros</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Estruturamos categorias silo e hierarquias semânticas perfeitas. Arrumamos as URLs parametrizadas de filtros (tamanho, cor, preço) para que o Google indexe apenas as combinações mais pesquisadas e lucrativas do seu segmento de atuação com parametrização inteligente.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl hover:-translate-y-2 transition-transform duration-300 p-10">
                  <Tag className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Autoridade Comercial</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Nenhuma estratégia on-page resiste à falta de PageRank. Combinamos o front-end perfeito com campanhas sofisticadas em nossa equipe como <Link to="/agencia-link-building" className="text-white hover:text-emerald-400 font-semibold underline underline-offset-2 transition-colors">agência de link building</Link> apontando autoridade diretamente para suas vitrines principais.
                   </p>
               </div>
            </div>
         </div>
      </section>

      {/* Call to action */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <BarChart className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">Vamos acelerar suas vendas?</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Faça uma profunda <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">auditoria técnica exclusiva para e-commerces</Link>. Identifique gargalos na jornada do consumidor e descubra o verdadeiro potencial oculto de faturamento no seu catálogo.
           </p>
           <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+quero+saber+mais+sobre+o+servi%C3%A7o+de+SEO+para+Ecommerce!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Solicitar Análise da minha Loja Virtual
           </a>
        </div>
      </section>
    </div>
  );
}

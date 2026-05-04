import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Target, CheckCircle2, ArrowRight, Building2, Search, LineChart, Globe } from 'lucide-react';

interface SeoLocalProps {
  city: string;
  state: string;
  slug: string;
}

const cityData = {
  'agencia-seo-sao-paulo': {
    title: 'Consultoria e Agência de SEO em São Paulo (SP) | Alta Performance',
    description: 'Buscando uma agência de SEO em São Paulo focada em resultados? Especialistas em Link Building, Conteúdo e SEO Técnico para empresas paulistas.',
    heroTitle: 'Acelere suas Vendas Orgânicas em São Paulo',
    heroSubtitle: 'Domine o mercado mais competitivo do Brasil. Estratégias robustas de SEO Local e Nacional para empresas da capital paulista e interior.',
    keywords: ['Agência de SEO SP', 'Consultoria SEO São Paulo', 'Especialista em SEO São Paulo', 'Link Building SP'],
    customContent: 'Em São Paulo (SP), o nível de maturidade do mercado exige mais do que apenas criar artigos. Nós implementamos auditorias técnicas avançadas, recuperamos tráfego perdido e construímos autoridade real de marca na maior metrópole da América Latina.',
    image: 'https://images.unsplash.com/photo-1543083652-19e4aaefe333?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-rio-de-janeiro': {
    title: 'Agência de SEO no Rio de Janeiro (RJ) | Consultoria Especializada',
    description: 'Escale seu faturamento com a principal Agência de SEO atuando no Rio de Janeiro (RJ). Estratégias validadas de tráfego orgânico para negócios cariocas.',
    heroTitle: 'Liderança em SEO no Rio de Janeiro',
    heroSubtitle: 'Colocamos sua marca no topo do Google. Consultoria de SEO completa, com foco em conversões e performance técnica para empresas do RJ.',
    keywords: ['SEO Rio de Janeiro', 'Agência SEO RJ', 'Consultor SEO Rio de Janeiro', 'Posicionamento Google RJ'],
    customContent: 'No mercado dinâmico do Rio de Janeiro, a visibilidade online é crucial. Especialistas experientes desenham campanhas para e-commerces e serviços B2B no estado, através de engenharia reversa nas SERPs e aquisição massiva de backlinks de qualidade.',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-belo-horizonte': {
    title: 'Agência de SEO em Belo Horizonte (MG) | Acelera SEO',
    description: 'Especialistas em SEO em Belo Horizonte. Alavanque o tráfego orgânico do seu negócio em Minas Gerais com estratégias de alta performance no Google.',
    heroTitle: 'Destaque-se no Google em Belo Horizonte',
    heroSubtitle: 'Conquiste clientes todos os dias. Nossa agência de SEO atende Belo Horizonte (MG) com foco total em ROI e crescimento sustentável.',
    keywords: ['SEO BH', 'Agência SEO Belo Horizonte', 'Consultoria de SEO MG', 'Otimização de Sites BH'],
    customContent: 'Se a sua empresa está em Belo Horizonte (MG), você sabe que precisa de inteligência de mercado para crescer. Projetamos silos de conteúdos semânticos e otimização técnica que fazem o Google amar sua arquitetura digital e destacar a sua marca.',
    image: 'https://images.unsplash.com/photo-1542456485-80252199b58f?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-vitoria': {
    title: 'Agência de SEO em Vitória (ES) | Especialistas em Otimização',
    description: 'Descubra a melhor consultoria em SEO para empresas de Vitória. Conquiste as primeiras posições no Google e deixe seus concorrentes no Espírito Santo para trás.',
    heroTitle: 'Potencialize suas Vendas Orgânicas em Vitória',
    heroSubtitle: 'Estratégias sob medida de ranqueamento para empresas do Espírito Santo. Do SEO técnico ao Link Building de alta autoridade.',
    keywords: ['Agência SEO Vitória', 'SEO Espírito Santo', 'Consultoria SEO ES', 'Especialista Google Vitória'],
    customContent: 'Vitória e o estado do ES estão em expansão. Como agência e consultoria de SEO, entregamos o que há de mais moderno na documentação oficial do Google para otimizar sua taxa de conversão orgânica sem falsas promessas.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-curitiba': {
    title: 'Consultoria e Agência de SEO em Curitiba (PR) | Resultados Exatos',
    description: 'Transforme o Google no seu melhor canal de vendas com nossa agência de SEO em Curitiba. Estruturas avançadas de Search Engine Optimization para o PR.',
    heroTitle: 'Otimização de Alta Performance em Curitiba',
    heroSubtitle: 'Implementação de growth orgânico especializado. Colocamos empresas de Curitiba e região no topo absoluto das pesquisas.',
    keywords: ['SEO Curitiba', 'Agência de SEO Curitiba', 'Consultor SEO PR', 'Link Building Curitiba'],
    customContent: 'Curitiba possui um ecossistema de negócios ágil e maduro. Nossos especialistas mapeiam a intenção de compra de seus clientes, construindo campanhas de SEO que geram visitas altamente qualificadas no Paraná e no Brasil todo.',
    image: 'https://images.unsplash.com/photo-1610484081033-90d3dcefaccc?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-florianopolis': {
    title: 'Agência de SEO em Florianópolis (SC) | Otimização para Empresas',
    description: 'Soluções avançadas de SEO em Florianópolis. Faça sua empresa crescer exponencialmente na busca orgânica com métricas transparentes.',
    heroTitle: 'Crescimento Orgânico Acelerado em Florianópolis',
    heroSubtitle: 'Estratégias de ponta em ranqueamento para a Ilha do Silício e todo estado de Santa Catarina. Torne as buscas sua principal aquisição.',
    keywords: ['SEO Florianópolis', 'Agência SEO SC', 'Consultoria Google Floripa', 'Otimização de sites SC'],
    customContent: 'Com a inovação no DNA de Florianópolis, seu site não pode ter uma arquitetura engessada. Alavancamos leads orgânicos qualificando seu tráfego através das melhores práticas mundiais de SEO on-page e off-page.',
    image: 'https://images.unsplash.com/photo-1518167389283-05459f21422b?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-porto-alegre': {
    title: 'Agência de SEO em Porto Alegre (RS) | Engenharia de Tráfego',
    description: 'Sua empresa nas primeiras posições com nossa consultoria de SEO para Porto Alegre e RS. Auditoria profunda, link building e performance focada em lucro.',
    heroTitle: 'Lidere o Mercado de Buscas em Porto Alegre',
    heroSubtitle: 'Metodologia validada de SEO para empresas gaúchas que desejam quebrar a barreira do tráfego pago e estabilizar as vendas.',
    keywords: ['Agência de SEO Porto Alegre', 'SEO RS', 'Otimização de SEO POA', 'Posicionamento Orgânico RS'],
    customContent: 'Temos a metodologia exata para empresas de Porto Alegre e Rio Grande do Sul. Nossa equipe destrincha os problemas do seu Core Web Vitals, analisa seus concorrentes diretos e desenvolve um roadmap infalível para o sucesso.',
    image: 'https://images.unsplash.com/photo-1543083652-19e4aaefe333?q=80&w=2000&auto=format&fit=crop'
  }
};

const defaultData = {
  title: 'Agência de SEO em | Otimização e Consultoria',
  description: 'Acelere suas vendas orgânicas com a principal agência de SEO. Consultoria técnica, Link Building e performance.',
  heroTitle: 'Agência de SEO para Empresas',
  heroSubtitle: 'Domine as buscas na sua região e em todo o Brasil. Desenvolvemos estratégias de Search Engine Optimization (SEO) avançadas.',
  keywords: ['Agência de SEO', 'Consultoria Local', 'SEO Técnico', 'Otimização'],
  customContent: 'A competição orgânica exige uma abordagem cirúrgica. Nossa Agência de SEO aplica engenharia reversa nos dados do Google para estruturar campanhas precisas.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop'
};

export default function SeoLocalPage({ city, state, slug }: SeoLocalProps) {
  const meta = cityData[slug as keyof typeof cityData] || defaultData;
  
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://aceleraseo.com.br/${slug}`} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://aceleraseo.com.br/${slug}`} />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 shadow-sm px-5 mb-8 gap-2">
            <MapPin size={16} /> Atendimento em {city} - {state}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            {meta.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            {meta.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contato" className="bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group px-10 py-5 gap-2">
              Analisar meu site agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/servicos" className="bg-white border border-slate-200 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center group shadow-sm hover:shadow-md transition-shadow px-10 py-5 gap-2">
              Conhecer Nossas Soluções
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
                 src={meta.image} 
                 alt={`Agência de SEO focada em performance e resultados para empresas de ${city}`} 
                 className="w-full h-full object-cover" 
               />
            </div>
             
             {/* Floating Badge */}
             <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col z-10 hidden sm:flex p-5 gap-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Keywords Map</span>
               {meta.keywords.slice(0, 3).map((kw, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <Target size={16} className="text-brand-500" />
                   <span className="text-sm font-semibold text-slate-700">{kw}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display mb-8 text-center md:text-left">SEO Local e Nacional Direto ao Ponto</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 {meta.customContent}
               </p>
               <p>
                 Atendemos contas corporativas e e-commerces aplicando <strong>auditorias técnicas severas</strong>, estratégias de Link Building premium nacional e otimização semântica robusta. 
               </p>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 font-display mt-10 mb-6 text-center md:text-left">Como alavancamos empresas locais:</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Search className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Auditoria em <strong>Google Meu Negócio</strong> e mapas para domínio absoluto nas buscas locais de {city}.</span>
              </li>
              <li className="flex items-start gap-4">
                <LineChart className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Mapeamento e clusterização de palavras-chave geolocalizadas versus nacionais de alto valor.</span>
              </li>
              <li className="flex items-start gap-4">
                <Globe className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg">Link Building estratégico, apontando relevância diretamente para sua presença de negócios em {state}.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-slate-900 py-24 mb-0">
        <div className="max-w-4xl mx-auto text-center px-6">
           <Building2 className="text-emerald-400 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-left">Escale seu negócio em {city}</h2>
           <p className="text-xl text-slate-300 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-left">
             Solicite uma análise preliminar gratuita do seu domínio e descubra exatamente o que está bloqueando o seu fluxo natural de vendas no Google.
           </p>
           <Link to="/contato" className="bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-500 transition-colors shadow-2xl shadow-brand-500/20 inline-flex items-center group px-12 py-6 gap-4">
             Solicitar Orçamento SEO
           </Link>
        </div>
      </section>
    </div>
  );
}

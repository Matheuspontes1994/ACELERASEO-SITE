import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Target, CheckCircle2, ArrowRight, Building2, 
  Search, LineChart, Globe, Star, Users, Zap, ShieldCheck, Mail
} from 'lucide-react';
import { JsonLd } from '../components/JsonLd';

interface SeoLocalProps {
  city: string;
  state: string;
  slug: string;
}

const cityData = {
  'agencia-seo-sao-paulo': {
    title: 'Agencia de seo em São Paulo (SP) | Consultoria Especializada',
    description: 'Buscando uma agência de SEO em São Paulo focada em resultados? Especialistas em Link Building, Conteúdo e SEO Técnico para empresas paulistas.',
    heroTitle: 'Agencia de seo em São Paulo',
    heroSubtitle: 'Domine o mercado mais competitivo do Brasil. Estratégias robustas de SEO Local e Nacional para empresas da capital paulista e interior.',
    keywords: ['Agência de SEO SP', 'Consultoria SEO São Paulo', 'Especialista em SEO São Paulo', 'Link Building SP'],
    customContent: 'Em São Paulo (SP), o nível de maturidade do mercado exige mais do que apenas criar artigos. Nós implementamos auditorias técnicas avançadas, recuperamos tráfego perdido e construímos autoridade real de marca na maior metrópole da América Latina.',
    image: 'https://images.unsplash.com/photo-1543083652-19e4aaefe333?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-rio-de-janeiro': {
    title: 'Agencia de seo em Rio de Janeiro (RJ) | Consultoria Especializada',
    description: 'Escale seu faturamento com a principal Agência de SEO atuando no Rio de Janeiro (RJ). Estratégias validadas de tráfego orgânico para negócios cariocas.',
    heroTitle: 'Agencia de seo em Rio de Janeiro',
    heroSubtitle: 'Colocamos sua marca no topo do Google. Consultoria de SEO completa, com foco em conversões e performance técnica para empresas do RJ.',
    keywords: ['SEO Rio de Janeiro', 'Agência SEO RJ', 'Consultor SEO Rio de Janeiro', 'Posicionamento Google RJ'],
    customContent: 'No mercado dinâmico do Rio de Janeiro, a visibilidade online é crucial. Especialistas experientes desenham campanhas para e-commerces e serviços B2B no estado, através de engenharia reversa nas SERPs e aquisição massiva de backlinks de qualidade.',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-belo-horizonte': {
    title: 'Agencia de seo em Belo Horizonte (MG) | Consultoria Especializada',
    description: 'Especialistas em SEO em Belo Horizonte. Alavanque o tráfego orgânico do seu negócio em Minas Gerais com estratégias de alta performance no Google.',
    heroTitle: 'Agencia de seo em Belo Horizonte',
    heroSubtitle: 'Conquiste clientes todos os dias. Nossa agência de SEO atende Belo Horizonte (MG) com foco total em ROI e crescimento sustentável.',
    keywords: ['SEO BH', 'Agência SEO Belo Horizonte', 'Consultoria de SEO MG', 'Otimização de Sites BH'],
    customContent: 'Se a sua empresa está em Belo Horizonte (MG), você sabe que precisa de inteligência de mercado para crescer. Projetamos silos de conteúdos semânticos e otimização técnica que fazem o Google amar sua arquitetura digital e destacar a sua marca.',
    image: 'https://images.unsplash.com/photo-1542456485-80252199b58f?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-vitoria': {
    title: 'Agencia de seo em Vitória (ES) | Consultoria Especializada',
    description: 'Descubra a melhor consultoria em SEO para empresas de Vitória. Conquiste as primeiras posições no Google e deixe seus concorrentes no Espírito Santo para trás.',
    heroTitle: 'Agencia de seo em Vitória',
    heroSubtitle: 'Estratégias sob medida de ranqueamento para empresas do Espírito Santo. Do SEO técnico ao Link Building de alta autoridade.',
    keywords: ['Agência SEO Vitória', 'SEO Espírito Santo', 'Consultoria SEO ES', 'Especialista Google Vitória'],
    customContent: 'Vitória e o estado do ES estão em expansão. Como agência e consultoria de SEO, entregamos o que há de mais moderno na documentação oficial do Google para otimizar sua taxa de conversão orgânica sem falsas promessas.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-curitiba': {
    title: 'Agencia de seo em Curitiba (PR) | Consultoria Especializada',
    description: 'Transforme o Google no seu melhor canal de vendas com nossa agência de SEO em Curitiba. Estruturas avançadas de Search Engine Optimization para o PR.',
    heroTitle: 'Agencia de seo em Curitiba',
    heroSubtitle: 'Implementação de growth orgânico especializado. Colocamos empresas de Curitiba e região no topo absoluto das pesquisas.',
    keywords: ['SEO Curitiba', 'Agência de SEO Curitiba', 'Consultor SEO PR', 'Link Building Curitiba'],
    customContent: 'Curitiba possui um ecossistema de negócios ágil e maduro. Nossos especialistas mapeiam a intenção de compra de seus clientes, construindo campanhas de SEO que geram visitas altamente qualificadas no Paraná e no Brasil todo.',
    image: 'https://images.unsplash.com/photo-1610484081033-90d3dcefaccc?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-florianopolis': {
    title: 'Agencia de seo em Florianópolis (SC) | Consultoria Especializada',
    description: 'Soluções avançadas de SEO em Florianópolis. Faça sua empresa crescer exponencialmente na busca orgânica com métricas transparentes.',
    heroTitle: 'Agencia de seo em Florianópolis',
    heroSubtitle: 'Estratégias de ponta em ranqueamento para a Ilha do Silício e todo estado de Santa Catarina. Torne as buscas sua principal aquisição.',
    keywords: ['SEO Florianópolis', 'Agência SEO SC', 'Consultoria Google Floripa', 'Otimização de sites SC'],
    customContent: 'Com a inovação no DNA de Florianópolis, seu site não pode ter uma arquitetura engessada. Alavancamos leads orgânicos qualificando seu tráfego através das melhores práticas mundiais de SEO on-page e off-page.',
    image: 'https://images.unsplash.com/photo-1518167389283-05459f21422b?q=80&w=2000&auto=format&fit=crop'
  },
  'agencia-seo-porto-alegre': {
    title: 'Agencia de seo em Porto Alegre (RS) | Consultoria Especializada',
    description: 'Sua empresa nas primeiras posições com nossa consultoria de SEO para Porto Alegre e RS. Auditoria profunda, link building e performance focada em lucro.',
    heroTitle: 'Agencia de seo em Porto Alegre',
    heroSubtitle: 'Metodologia validada de SEO para empresas gaúchas que desejam quebrar a barreira do tráfego pago e estabilizar as vendas.',
    keywords: ['Agência de SEO Porto Alegre', 'SEO RS', 'Otimização de SEO POA', 'Posicionamento Orgânico RS'],
    customContent: 'Temos a metodologia exata para empresas de Porto Alegre e Rio Grande do Sul. Nossa equipe destrincha os problemas do seu Core Web Vitals, analisa seus concorrentes diretos e desenvolve um roadmap infalível para o sucesso.',
    image: 'https://images.unsplash.com/photo-1543083652-19e4aaefe333?q=80&w=2000&auto=format&fit=crop'
  }
};

const defaultData = {
  title: 'Agencia de seo Local | Domine as Buscas na Sua Região',
  description: 'Acelere suas vendas locais com a principal agência de SEO. Foco em Google Meu Negócio, mapas e ranqueamento regional.',
  heroTitle: 'Agencia de seo Local',
  heroSubtitle: 'Seja a primeira opção quando seus clientes buscarem pelos seus serviços no Google. Especialistas em dominar mercados regionais.',
  keywords: ['SEO Local', 'Google Maps', 'SEO Regional', 'Presença Online'],
  customContent: 'O SEO Local não é apenas estar no Google, é ser a autoridade máxima em uma região específica. Implementamos o que há de mais avançado em sinais de ranking locais.',
  image: 'https://images.unsplash.com/photo-1582213726883-9b7e79391ab2?q=80&w=2000&auto=format&fit=crop'
};

const faqs = [
  {
    q: "O que é SEO Local e como ele ajuda meu negócio?",
    a: "SEO Local é um conjunto de estratégias focadas em otimizar sua presença online para atrair mais negócios de pesquisas locais relevantes."
  },
  {
    q: "Quanto tempo demora para ver resultados no Google Maps?",
    a: "Diferente do SEO tradicional que pode levar 6 meses, o SEO Local costuma apresentar melhorias significativas em 4 a 12 semanas."
  },
  {
    q: "Só preciso do Google Meu Negócio para o SEO Local?",
    a: "Não. Embora o Google Business Profile seja central, o Google também analisa a autoridade do seu site principal e a consistência dos seus dados."
  },
  {
    q: "Vocês atendem em qualquer cidade do Brasil?",
    a: "Sim. Nossas estratégias são fundamentadas em algoritmos globais do Google e podem ser adaptadas para qualquer região."
  }
];

export default function SeoLocalPage({ city, state, slug }: SeoLocalProps) {
  const meta = cityData[slug as keyof typeof cityData] || {
    ...defaultData,
    heroTitle: `Agencia de seo em ${city}`,
    title: `Agencia de seo em ${city} | Consultoria Especializada`
  };
  
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-16 lg:pt-24 pb-0">
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
      </Helmet>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": `Acelera SEO - ${city}`,
        "description": meta.description,
        "image": meta.image,
        "url": `https://aceleraseo.com.br/${slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "BR"
        }
      }} />



      {/* Hero Section */}
      <section className="relative px-6 pt-0 pb-16 lg:pt-4 lg:pb-24 overflow-hidden">
        <div className="tech-grid" />
        <div className="hero-glow" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full mb-8">
                <MapPin size={16} className="text-brand-600" />
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Especialistas em {city} - {state}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.05] mb-8">
                {meta.heroTitle}
              </h1>
              
              <p className="text-xl text-slate-600 font-light leading-relaxed mb-12 max-w-xl">
                {meta.heroSubtitle} Colocamos seu negócio nas primeiras posições do Google e do Waze para quem está perto de você.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contato" className="bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-brand-600 transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center group px-10 py-5 gap-2">
                  Analisar meu Ranking em {city} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative lg:block hidden"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600/20 to-brand-400/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white shadow-2xl">
                  <img src={meta.image} alt={meta.heroTitle} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20 mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight mb-6">
              Como Fazemos do Google o <span className="text-brand-600">Melhor Vendedor</span> em {city}
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed">
              {meta.customContent} Nossa estratégia é dividida em pilares fundamentais para o sucesso regional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <MapPin className="text-brand-600" />,
                title: "Google Business Profile",
                desc: "Otimização profunda da sua ficha no Google para aparecer no 'Local Pack' (os 3 primeiros resultados do mapa)."
              },
              {
                icon: <ShieldCheck className="text-brand-600" />,
                title: "Consistência NAP",
                desc: "Garantimos que seu Nome, Endereço e Telefone estejam 100% idênticos em toda a internet, gerando confiança absoluta."
              },
              {
                icon: <Users className="text-brand-600" />,
                title: "Gestão de Reviews",
                desc: "Estratégias para adquirir e gerenciar avaliações positivas que convertem cliques em vendas reais."
              },
              {
                icon: <Globe className="text-brand-600" />,
                title: "Citações Locais",
                desc: `Criação de autoridade em portais e diretórios locais relevantes para o mercado de ${city}.`
              },
              {
                icon: <Zap className="text-brand-600" />,
                title: "SEO On-Page Local",
                desc: "Conteúdo otimizado com palavras-chave geolocalizadas que respondem exatamente à intenção do usuário local."
              },
              {
                icon: <LineChart className="text-brand-600" />,
                title: "Tracking de Proximidade",
                desc: "Monitoramento de posição baseado em onde o usuário está fisicamente, não apenas na cidade geral."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(41,96,150,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white font-display tracking-tight mb-8">
              Nossa Metodologia em 4 Passos
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { step: "01", title: "Auditoria Técnica", desc: "Varredura completa em erros técnicos e duplicidade de dados." },
              { step: "02", title: "Setup Local", desc: "Otimização do GBP e integração de rastreio de geolocalização." },
              { step: "03", title: "Content & Citations", desc: "Produção de conteúdo local e aquisição de citações regionais." },
              { step: "04", title: "Growth & Reviews", desc: "Escalonamento orgânico e automação de feedbacks positivos." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <span className="text-5xl font-black text-brand-600/30 font-display mb-8 block">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 font-display mb-6">Perguntas Frequentes</h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed">Tudo o que você precisa saber sobre SEO Local.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 text-sm">?</span>
                  {faq.q}
                </h3>
                <p className="text-slate-600 font-light leading-relaxed pl-12">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-0 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400/10 blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Mail className="text-brand-600 mx-auto mb-8" size={64} />
              <h2 className="text-3xl lg:text-6xl font-extrabold text-white font-display mb-8">
                Pronto para ser o #1 em {city}?
              </h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed mb-12">
                Não deixe seus clientes encontrarem o concorrente por falta de visibilidade. Peça sua análise gratuita hoje.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/20 px-12 py-6">
                  Quero Vender Mais no Google
                </Link>
                <Link to="/servicos" className="bg-white/5 text-white border border-white/10 font-bold text-xl rounded-2xl hover:bg-white/10 transition-all px-12 py-6">
                  Ver Todos os Serviços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer spacing */}
      <div className="h-24 bg-slate-50" />
    </div>
  );
}

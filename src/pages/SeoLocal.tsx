import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Target, CheckCircle2, ArrowRight, Building2, 
  Search, LineChart, Globe, Star, Users, Zap, ShieldCheck, Mail, FileSearch, Settings2, Newspaper, Rocket
} from 'lucide-react';
import { JsonLd } from '../components/JsonLd';
import { ServiceRoadmap } from '../components/ServiceRoadmap';
import { ServiceFAQ } from '../components/ServiceFAQ';

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
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
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
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Especialistas em {city} - {state}
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] tracking-tight font-extrabold text-slate-900 font-display mb-8 text-balance">
                {meta.heroTitle}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl text-balance">
                Seja a primeira opção quando seus clientes buscarem pelos seus serviços no Google em sua região. Colocamos seu negócio no topo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contato" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center group px-8 py-4 gap-2">
                  Analisar meu Ranking <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#modulos" className="bg-white border border-slate-200 text-slate-700 font-semibold text-base rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm px-8 py-4 gap-2">
                  Ver Metodologia Local
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
                      src={meta.image} 
                      alt={meta.heroTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating labels inside card */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">Localização Prioritária</p>
                      <p className="text-sm font-extrabold text-slate-900">Domínio de Mercado: {city}</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                      <MapPin size={24} />
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

      {/* Modules Section */}
      <section id="modulos" className="py-24 bg-white relative overflow-hidden">
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

      {/* Roadmap Section */}
      <ServiceRoadmap 
        title="Nossa Metodologia em 4 Passos"
        subtitle="Um processo estruturado para transformar sua visibilidade regional e dominar as buscas locais."
        steps={[
          {
            title: "Auditoria Técnica Local",
            description: "Varredura completa em erros técnicos, duplicidade de dados e análise de como o Google enxerga seu negócio hoje na região.",
            icon: <FileSearch size={24} />
          },
          {
            title: "Setup Local e GBP",
            description: "Otimização profunda do Google Business Profile (Ficha do Google) e integração de rastreio de geolocalização preciso.",
            icon: <Settings2 size={24} />
          },
          {
            title: "Content & Citations",
            description: "Produção de conteúdo local estratégico e aquisição de citações em diretórios regionais para fortalecer sua relevância geográfica.",
            icon: <Newspaper size={24} />
          },
          {
            title: "Growth & Reviews",
            description: "Escalonamento orgânico através de estratégias para adquirir avaliações positivas reais e manter o topo das buscas.",
            icon: <Rocket size={24} />
          }
        ]}
      />

      {/* FAQ Section */}
      <ServiceFAQ 
        faqs={faqs.map(faq => ({
          question: faq.q,
          answer: faq.a
        }))}
      />

      {/* Final CTA */}
      <section className="py-24 bg-slate-50 relative">
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

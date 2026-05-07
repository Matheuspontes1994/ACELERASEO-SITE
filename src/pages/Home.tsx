import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  BarChart3, 
  Search, 
  Target, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  Activity,
  Layers,
  Code2,
  Users,
  LayoutTemplate,
  Globe2
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { Tooltip } from '../components/Tooltip';
import { ServiceFAQ } from '../components/ServiceFAQ';

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-24 md:pt-32 pb-20 md:pb-32"
    >
      <div className="tech-grid" />
      <div className="hero-glow" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center w-full relative z-10 px-6 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="inline-flex items-center w-fit max-w-[90vw] md:max-w-full whitespace-normal flex-wrap text-center justify-center rounded-2xl md:rounded-full bg-white border border-slate-200 shadow-sm text-[11px] sm:text-xs font-semibold text-brand-600 uppercase tracking-widest gap-2 px-4 py-2 mb-6 mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> AGÊNCIA DE SEO
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] font-extrabold text-slate-900 font-display tracking-tight text-balance mb-6 mx-auto lg:mx-0 text-center lg:text-left">
            A Agência de SEO <span className="text-brand-600">perfeita</span> para o seu Negócio.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl font-light leading-relaxed mb-10 mx-auto lg:mx-0">
            Nós decodificamos o algoritmo. Escale sua empresa com uma infraestrutura técnica feita por uma <RouterLink to="/especialista-em-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência SEO</RouterLink> focada em <Tooltip term="E-E-A-T" definition="Experiência, Especialidade, Autoridade e Confiabilidade. Critérios do Google para avaliar o nível de qualidade e credibilidade do seu site." />, entregando o melhor <Tooltip term="SEO On-Page" definition="Otimizações feitas dentro e na estrutura da própria página, como títulos, conteúdo e velocidade, para melhorar as posições da sua empresa nos buscadores." /> para o seu desenvolvimento tech e elaborando uma <Tooltip term="Arquitetura Semântica" definition="Organização lógica e estrutural do conteúdo do seu site para facilitar o entendimento pelos robôs." /> vencedora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <a href="https://wa.me/5531999229927?text=Ol%C3%A1%2C+preciso+escalar+meu+tr%C3%A1fego+org%C3%A2nico!" target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex justify-center items-center group px-8 py-4 gap-2 w-full sm:w-auto">
              Falar com Especialista <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <RouterLink to="/auditoria" className="bg-slate-900 border border-slate-800 text-white font-semibold text-base rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center shadow-sm px-8 py-4 gap-2 w-full sm:w-auto">
              Fazer Auditoria Grátis <Search size={18} className="text-white/70" />
            </RouterLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 relative mt-10 lg:mt-0"
        >
          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(41,96,150,0.12)] rounded-[3rem] relative z-10 w-full overflow-hidden p-6 sm:p-12 ring-1 ring-white/50 group/card">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-100/20 via-transparent to-brand-50/10 -z-10 group-hover/card:opacity-70 transition-opacity duration-500"></div>

            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Acelera SEO em Foco</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-brand-200 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-brand-100 rounded-full"></div>
                <div className="w-2 h-2 bg-brand-50 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-5 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/80 shadow-sm rounded-2xl flex items-center justify-center shrink-0 border border-white">
                  <Activity size={28} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-display tracking-tight">Performance Máxima</h4>
                  <p className="text-sm font-semibold text-slate-500">Otimização técnica extrema.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-5 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/80 shadow-sm rounded-2xl flex items-center justify-center shrink-0 border border-white">
                  <Search size={28} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-display tracking-tight">Inteligência de Busca</h4>
                  <p className="text-sm font-semibold text-slate-500">Decodificamos o algoritmo.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-5 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/80 shadow-sm rounded-2xl flex items-center justify-center shrink-0 border border-white">
                  <ShieldCheck size={28} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-display tracking-tight">SEO Seguro</h4>
                  <p className="text-sm font-semibold text-slate-500">Metodologias 100% White-Hat.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-400/5 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

const TechStackMarquee = () => {
  const terms = [
    "Aumento de Vendas Orgânicas", "Redução de Custo de Aquisição (CAC)", "Liderança no Google", 
    "Tráfego Altamente Qualificado", "Captação Contínua de Leads", "ROI de Longo Prazo", 
    "Autoridade de Marca", "Crescimento Sustentável", "Fim da Dependência de Anúncios",
    "Aumento de Vendas Orgânicas", "Redução de Custo de Aquisição (CAC)", "Liderança no Google", 
    "Tráfego Altamente Qualificado", "Captação Contínua de Leads", "ROI de Longo Prazo", 
    "Autoridade de Marca", "Crescimento Sustentável", "Fim da Dependência de Anúncios"
  ];
  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden relative flex z-20 select-none py-5">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center w-max">
        {terms.map((term, i) => (
          <div key={i} className="flex items-center mx-6">
            <span className="text-brand-300 font-mono text-xs md:text-sm tracking-widest uppercase font-bold opacity-80">{term}</span>
            <span className="w-1.5 h-1.5 bg-slate-700/80 rounded-full ml-12"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section className="bg-white border-y border-slate-200/50 relative overflow-hidden py-12 md:py-20 lg:py-24">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-50 rounded-full blur-[80px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 relative z-10 px-6 gap-8 md:gap-12 lg:gap-16">
        <div className="bg-slate-50/50 rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center md:items-start text-center md:text-left h-full p-6 md:p-12">
          <div className="inline-flex items-center text-brand-600 font-bold uppercase tracking-widest text-[11px] gap-2 mb-8">
            <Users size={16} /> Especialistas em Resultados
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 mb-6 text-center md:text-left">Por que escolher nossa agência SEO?</h2>
          <div className="space-y-5 text-slate-600 leading-relaxed font-light flex-1">
            <p>Somos uma <RouterLink to="/consultoria-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de SEO</RouterLink> dedicada e focada exclusivamente em performance orgânica e <RouterLink to="/agencia-link-building" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">venda de backlinks</RouterLink> estratégicos de alta autoridade. Atuamos todos os dias ajudando empresas a dominarem o Google com metodologias ágeis e técnicas muito precisas.</p>
            <p>Cada projeto é rigorosamente construído a partir de uma <RouterLink to="/auditoria"><strong className="font-bold text-slate-900 hover:text-brand-600 transition-colors">auditoria de SEO</strong></RouterLink> aprofundada, entregando sempre relatórios transparentes e um planejamento personalizado que vai muito além do básico de <strong className="font-semibold text-slate-900">SEO para sites</strong> convencionais.</p>
            <p>Nossa abordagem combina as mais avançadas técnicas de otimização de mercado, focando sempre na conversão real. Afinal, um tráfego volumoso não é nada sem a atração de leads que sejam extremamente qualificados.</p>
          </div>
        </div>
        <div className="bg-slate-50/50 rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center md:items-start text-center md:text-left h-full p-6 md:p-12">
          <div className="inline-flex items-center text-brand-600 font-bold uppercase tracking-widest text-[11px] gap-2 mb-8">
            <Search size={16} /> Entenda o Processo
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 mb-6 text-center md:text-left">O que podemos fazer pela sua empresa?</h2>
          <div className="space-y-5 text-slate-600 leading-relaxed font-light flex-1">
            <p>Uma <RouterLink to="/especialista-em-seo" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">agência de marketing SEO</RouterLink> é responsável por preparar todo o terreno do seu domínio para receber visitas de forma constante e escalonada. Na Acelera SEO, aplicamos as nossas principais <RouterLink to="/servicos" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">soluções estratégicas e técnicas de busca avançada</RouterLink>.</p>
            <p>Através da nossa rigorosa <RouterLink to="/auditoria" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">seo auditoria</RouterLink>, detectamos falhas invisíveis para amadores e construímos uma fundação baseada em credibilidade. Diferente da publicidade temporária, a presença orgânica se torna o principal ativo da sua visibilidade a longo prazo.</p>
            <p>Faça parte do grupo de negócios que investe pesado em aquisições contínuas, seja lidando com consultorias especializadas ou buscando a curadoria única na <RouterLink to="/agencia-link-building" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">venda de backlinks</RouterLink> (link building exclusivo).</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const ObjectivesSection = () => {
  const objs = [
    { title: "Rastreabilidade", subtitle: "(Crawl)", icon: <ShieldCheck size={40} className="text-brand-600 mb-6" /> },
    { title: "Semântica", subtitle: "(Indexação)", icon: <LayoutTemplate size={40} className="text-brand-600 mb-6" /> },
    { title: "Autoridade", subtitle: "(Link Juice)", icon: <BarChart3 size={40} className="text-brand-600 mb-6" /> },
    { title: "Conversão", subtitle: "(Rank #1)", icon: <Target size={40} className="text-brand-600 mb-6" /> }
  ];
  return (
    <section className="bg-slate-50 text-center relative py-12 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto relative z-10 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight mb-8 md:mb-8 lg:mb-16 text-center">Nossos Objetivos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {objs.map(o => (
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              key={o.title} 
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center hover:shadow-[0_40px_80px_-15px_rgba(41,96,150,0.15)] hover:border-brand-200 transition-all duration-300 p-6 sm:p-8 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                {o.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-base lg:text-lg font-display uppercase tracking-tight leading-snug text-center group-hover:text-brand-600 transition-colors">
                {o.title}
                <span className="block text-brand-600 font-medium mt-1 uppercase text-xs opacity-80">{o.subtitle}</span>
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Services = () => {
  const services = [
    {
      title: "Auditoria Estrutural On-Page",
      desc: <>Dissecamos e reconstruímos o seu código. Otimizamos o HTML, Tags de Mídia, Velocidade Global (<Tooltip term="Core Web Vitals" definition="Principais Métricas da Web usadas pelo Google para avaliar velocidade, responsividade e estabilidade visual do site para o usuário." />) ajustando severamente seu sitemap.xml e robots.txt.</>,
      icon: <Code2 className="text-brand-600" size={28} />,
      features: ["Sitemap & Robots", "Core Web Vitals", "Canonical Tags"]
    },
    {
      title: "Crawl Budget & Indexação",
      desc: <>Auditoria profunda de server-logs e arquitetura da informação para impedir o Googlebot de despender limite de rastreamento (<Tooltip term="Crawl Budget" definition="Orçamento de rastreamento. É o número limite de páginas que o robô de busca pode ler no site por dia." />) em URLs irrelevantes.</>,
      icon: <Activity className="text-brand-600" size={28} />,
      features: ["Server Logs", "Orçamento de Rastreamento", "Noindex Otimizado"]
    },
    {
      title: "Conteúdo Semântico (E-E-A-T)",
      desc: <>Escrita formatada para Entidades do Google. Ampliamos a <Tooltip term="Cobertura Tópica" definition="Tornar o site uma autoridade em um aspecto abordando e dominando todas as vertentes e perguntas daquele assunto." /> (Topical Authority) mapeando as intenções de busca primárias do seu setor.</>,
      icon: <Layers className="text-brand-600" size={28} />,
      features: ["Topical Authority", "Validação E-E-A-T", "Estrutura H1-H6"]
    },
    {
      title: "Link Building (Off-Page)",
      desc: <>Construímos uma rede de conexões orgânicas e contextuais. Backlinks aprovados de alta precisão que elevam permanentemente sua <Tooltip term="Autoridade de Domínio" definition="Métrica que diz o quão forte o site é perante aos concorrentes devido aos canais externos que apontam para ele." /> (DR).</>,
      icon: <Globe2 className="text-brand-600" size={28} />,
      features: ["Alta Autoridade (DR)", "Links Dofollow", "Link Juice Direcionado"]
    }
  ];

  return (
    <section className="bg-white relative border-t border-slate-200 py-12 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-8 lg:mb-20">
          <p className="text-brand-600 font-bold tracking-widest text-[11px] uppercase mb-6">Nossa Metodologia</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display mb-6">Soluções Transformadas em <span className="text-brand-600">Resultados</span>.</h2>
          <p className="text-lg text-slate-500 font-light leading-relaxed">Transformamos a presença digital da sua empresa através de uma metodologia de SEO de alta performance. Nosso foco é converter buscas em faturamento colocando você no topo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              key={i}
              className="rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(41,96,150,0.12)] hover:border-brand-300/40 transition-all duration-300 group flex flex-col items-center text-center md:items-start md:text-left p-8 sm:p-10"
            >
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-8 mx-auto md:mx-0 border border-brand-100">
                {s.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight group-hover:text-brand-600 transition-colors mb-4 text-center md:text-left">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base mb-8 text-center md:text-left">{s.desc}</p>
              <div className="flex flex-wrap mt-auto justify-center md:justify-start gap-2 w-full">
                {s.features.map(f => (
                  <span key={f} className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-slate-50 text-slate-500 border border-slate-200/60 rounded-xl group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-200/50 transition-all duration-300">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      q: "O que faz uma agência de SEO especializada?",
      a: "Uma agência de SEO mapeia e otimiza toda a infraestrutura técnica e de conteúdo de um site para que ele ranqueie organicamente no Google e atraia Leads mais qualificados, sem a necessidade de pagar por anúncios a cada clique."
    },
    {
      q: "Como a auditoria de SEO pode ajudar o meu site?",
      a: "A auditoria de SEO analisa os aspectos técnicos essenciais (performance, arquitetura, conteúdo, e saúde de links), identificando erros impeditivos que bloqueiam seu crescimento. Realizamos essa auditoria de maneira completa e inicial oferecida gratuitamente."
    },
    {
      q: "Vocês trabalham com venda de backlinks?",
      a: "Nós atuamos no modelo de prospecção e negociação direta de links (venda backlinks/Digital PR), entregando contextualização relevante em portais de alta autoridade para expandir a credibilidade (DR) do seu domínio, evitando qualquer técnica black-hat que gere penalizações do Google."
    },
    {
      q: "Quanto tempo demora para a agência de marketing SEO trazer resultados?",
      a: "Depende bastante do mercado, da saúde prévia do domínio e dos concorrentes. Geralmente os Quick Wins técnicos aparecem nos meses iniciais, mas os resultados profundos (retorno financeiro de SEO On-Page/Off-Page) podem alavancar exponencialmente entre 4 a 6 meses de projeto."
    }
  ];

  return (
    <ServiceFAQ faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} />
  );
};

const AuditSection = () => {
  const [domain, setDomain] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (u: string) => {
    if (!u) return null;
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return regex.test(u);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDomain(val);
    setIsValid(validateUrl(val));
  };

  return (
    <section className="relative bg-slate-50 border-t border-slate-200/60 overflow-hidden py-12 md:py-16">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-50 rounded-full blur-[80px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/50 rounded-full blur-[60px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-3xl mx-auto relative z-10 px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center p-6 md:p-8">
          
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-600 border border-brand-100 shadow-sm mb-4">
             <Zap size={24} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-display leading-tight mb-3">
            Descubra o que impede seu <span className="text-brand-600">ranqueamento</span>.
          </h2>
          
          <p className="text-base text-slate-500 font-light max-w-lg mx-auto leading-relaxed mb-6">
            O tráfego de amanhã se conquista ajustando a infraestrutura hoje. Faça uma avaliação técnica rápida do seu domínio.
          </p>
          
          <div className="w-full max-w-xl mx-auto relative">
            <form className={`flex flex-col sm:flex-row w-full p-1.5 bg-white border rounded-xl shadow-sm focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-300 gap-2 ${
              isValid === true ? 'border-emerald-200 ring-2 ring-emerald-500/10' : 
              isValid === false ? 'border-rose-200 ring-2 ring-rose-500/10' : 
              'border-slate-200 focus-within:border-brand-300'
            }`}>
              <input 
                type="text" 
                value={domain}
                onChange={handleChange}
                placeholder="Cole seu domínio (ex: empresa.com.br)" 
                className="w-full sm:flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 font-medium rounded-lg text-sm px-4 py-2"
                required
              />
              <RouterLink 
                to={isValid ? `/auditoria?url=${encodeURIComponent(domain)}` : "#"}
                onClick={(e) => { if(!isValid) e.preventDefault(); }}
                className={`w-full sm:w-auto font-bold rounded-lg transition-all shadow-sm text-sm flex items-center justify-center text-center whitespace-nowrap px-6 py-2 ${
                  isValid ? 'bg-slate-900 text-white hover:bg-brand-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Gerar Diagnóstico
              </RouterLink>
            </form>
            {isValid === false && domain.length > 0 && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute -bottom-6 left-2 text-[10px] text-rose-500 font-bold"
              >
                Formato de URL inválido. Ex: empresa.com.br
              </motion.p>
            )}
          </div>
          
          <div className="text-slate-500 text-[11px] font-medium flex items-center bg-slate-50 py-1.5 rounded-full border border-slate-100 mt-10 gap-2 px-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Análise técnica finalizada em segundos.
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <TechStackMarquee />
      <AboutSection />
      <ObjectivesSection />
      <div id="solucoes"></div>
      <Services />
      <FaqSection />
      <AuditSection />
    </>
  );
};

export default Home;

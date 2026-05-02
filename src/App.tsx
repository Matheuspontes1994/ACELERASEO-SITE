/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  Zap, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight,
  Activity,
  Layers,
  Code2,
  Users,
  LayoutTemplate,
  HelpCircle,
  ChevronDown,
  Award
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AuditPage from './pages/Audit';
import BlogPage from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ServicesPage from './pages/Services';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import SeoEcommercePage from './pages/SeoEcommerce';
import ConsultoriaSeoPage from './pages/ConsultoriaSeo';
import LinkBuildingPage from './pages/LinkBuilding';
import VendaBacklinksPage from './pages/VendaBacklinks';
import EspecialistaSeoPage from './pages/EspecialistaSeo';
import SeoLocalPage from './pages/SeoLocal';
import { Tooltip } from './components/Tooltip';

import ClientDashboard from './pages/ClientDashboard';
import DashboardPage from './pages/Dashboard';

// --- SEO Structured Data ---
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SEOAgency",
  "name": "Acelera SEO",
  "description": "Agência de SEO e Marketing SEO focada em SEO para sites, auditoria de SEO técnica e link building.",
  "url": "https://acelera-seo.com.br",
  "logo": "https://acelera-seo.com.br/logo.webp",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR"
  },
  "serviceType": "Search Engine Optimization",
  "areaServed": "Global"
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();
  const isPortal = location.pathname === '/portal-cliente';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${(isScrolled || mobileMenuOpen) ? 'py-3 glass' : 'py-3 md:py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <RouterLink to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Acelera SEO Logo" className="h-11 w-auto object-contain mix-blend-multiply" />
            <span className={`text-2xl font-display font-bold tracking-tight ${isPortal && !isScrolled ? 'text-white' : 'text-slate-800'}`}>Acelera <span className="text-brand-600 font-light">SEO</span></span>
          </RouterLink>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <RouterLink to="/sobre" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">Sobre</RouterLink>
          
          {/* Dropdown Soluções */}
          <div className="relative group py-6">
            <button className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors flex items-center focus:outline-none gap-1">
              Soluções <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-[80%] left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-64 bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden z-50 pt-2">
              <RouterLink to="/seo-ecommerce" className="block text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors font-medium border-b border-slate-50 px-5 py-3">SEO para E-commerce</RouterLink>
              <RouterLink to="/consultoria-seo" className="block text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors font-medium border-b border-slate-50 px-5 py-3">Consultoria SEO</RouterLink>
              <RouterLink to="/especialista-em-seo" className="block text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors font-medium border-b border-slate-50 px-5 py-3">Especialista em SEO</RouterLink>
              <RouterLink to="/agencia-link-building" className="block text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors font-medium border-b border-slate-50 px-5 py-3">Agência Link Building</RouterLink>
              <RouterLink to="/venda-backlinks" className="block text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors font-medium px-5 py-3">Venda de Backlinks</RouterLink>
              <div className="p-2">
                <RouterLink to="/servicos" className="block text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors text-center px-4 py-3">Ver todas as soluções</RouterLink>
              </div>
            </div>
          </div>

          <RouterLink to="/blog" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">Blog</RouterLink>
          <RouterLink to="/contato" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">Contato</RouterLink>
          <RouterLink to="/auditoria" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Auditoria Grátis</RouterLink>
          
          <div className="flex items-center ml-4 pl-6 border-l border-slate-200 gap-3">
            <RouterLink to="/login" className="flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all focus:outline-none" title="Acessar Sistema">
              <Users size={18} />
            </RouterLink>
             <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+de+uma+consultoria+SEO!" target="_blank" rel="noopener noreferrer" className="py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all transform hover:-translate-y-0.5 px-6">
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>
      </div>
    </nav>

    {/* Mobile Menu Fullscreen Overlay */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-3xl md:hidden flex flex-col overflow-hidden"
        >
          {/* Header Mobile Menu */}
          <div className="flex justify-between items-center h-[80px] border-b border-slate-100/50 px-6">
            <RouterLink to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Acelera SEO Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
              <span className="text-2xl font-display font-bold tracking-tight text-slate-900">Acelera<span className="text-brand-600 font-light">SEO</span></span>
            </RouterLink>
            <button className="text-slate-500 hover:bg-slate-100 rounded-full transition-colors bg-slate-50 border border-slate-100 p-2" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col px-6 py-8 gap-6 pb-32">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <RouterLink to="/sobre" className="text-xl font-medium text-slate-800 hover:text-brand-600 transition-colors py-3 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>Sobre a Agência</RouterLink>
              
              <div className="flex flex-col border-b border-slate-100">
                <button 
                  onClick={() => setSolutionsOpen(!solutionsOpen)} 
                  className="flex items-center justify-between py-3 text-xl font-medium text-slate-800 hover:text-brand-600 transition-colors"
                >
                  Nossas Soluções
                  <ChevronDown size={20} className={`transition-transform duration-300 ${solutionsOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
                </button>
                <AnimatePresence>
                  {solutionsOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-3 pl-4 pb-4"
                    >
                      <RouterLink to="/seo-ecommerce" className="text-base text-slate-500 hover:text-brand-600 transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>SEO para E-commerce</RouterLink>
                      <RouterLink to="/consultoria-seo" className="text-base text-slate-500 hover:text-brand-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Consultoria SEO</RouterLink>
                      <RouterLink to="/especialista-em-seo" className="text-base text-slate-500 hover:text-brand-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Especialista em SEO</RouterLink>
                      <RouterLink to="/agencia-link-building" className="text-base text-slate-500 hover:text-brand-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Agência Link Building</RouterLink>
                      <RouterLink to="/venda-backlinks" className="text-base text-slate-500 hover:text-brand-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Venda de Backlinks</RouterLink>
                      <RouterLink to="/servicos" className="text-base font-bold text-brand-600 flex items-center gap-1 mt-1" onClick={() => setMobileMenuOpen(false)}>Explorar todas <ArrowRight size={16} /></RouterLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <RouterLink to="/blog" className="text-xl font-medium text-slate-800 hover:text-brand-600 transition-colors py-3 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>Blog</RouterLink>
              <RouterLink to="/contato" className="text-xl font-medium text-slate-800 hover:text-brand-600 transition-colors py-3 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>Fale Conosco</RouterLink>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col mt-2 gap-4"
            >
              <RouterLink to="/auditoria" className="bg-brand-50 text-brand-700 w-full rounded-2xl font-bold text-center hover:bg-brand-100 transition-colors text-lg py-4" onClick={() => setMobileMenuOpen(false)}>
                Auditoria Grátis
              </RouterLink>
              <RouterLink to="/login" className="text-slate-700 bg-white border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex justify-center items-center text-lg shadow-sm py-4 gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Users size={20} className="text-brand-600" /> Acesso ao Sistema
              </RouterLink>
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+de+uma+consultoria+SEO!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white w-full rounded-2xl font-bold text-center hover:bg-slate-800 transition-colors flex items-center justify-center text-lg shadow-lg shadow-slate-900/20 py-4 gap-2 mt-4">
                Falar no WhatsApp
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-8 md:pt-[120px] lg:pt-40 pb-16 md:pb-20 lg:pb-24">
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1.1] md:leading-[1.05] font-extrabold text-slate-900 font-display tracking-tight text-balance mb-6 mx-auto lg:mx-0 text-center md:text-center">
            A Agência de SEO <span className="text-brand-600">perfeita</span> para o seu Negócio.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl font-light leading-relaxed text-justify md:text-left mb-10 mx-auto lg:mx-0">
            Nós decodificamos o algoritmo. Escale sua empresa com uma infraestrutura técnica feita por uma agência SEO focada em <Tooltip term="E-E-A-T" definition="Experiência, Especialidade, Autoridade e Confiabilidade. Critérios do Google para avaliar o nível de qualidade e credibilidade do seu site." />, entregando o melhor <Tooltip term="SEO On-Page" definition="Otimizações feitas dentro e na estrutura da própria página, como títulos, conteúdo e velocidade, para melhorar as posições da sua empresa nos buscadores." /> para o seu desenvolvimento tech e elaborando uma <Tooltip term="Arquitetura Semântica" definition="Organização lógica e estrutural do conteúdo do seu site para facilitar o entendimento pelos robôs." /> vencedora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+escalar+meu+tr%C3%A1fego+org%C3%A2nico!" target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex justify-center items-center group px-8 py-4 gap-2 w-full sm:w-auto">
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
          <div className="bg-white/90 backdrop-blur-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(41,96,150,0.15)] rounded-3xl sm:rounded-[2.5rem] relative z-10 w-full overflow-hidden p-6 sm:p-10">
            {/* Soft decorative background inside the card - cleaned up */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-50/50 via-transparent to-transparent -z-10"></div>

            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center md:text-left">Acelera SEO em Números</h3>
              <div className="flex gap-1.5 opacity-60">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center group hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all gap-5 p-4">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Users size={24} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">+100</h4>
                  <p className="text-sm sm:text-base font-medium text-slate-500">Clientes Atendidos</p>
                </div>
              </div>
              
              <div className="flex items-center group hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all gap-5 p-4">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Award size={24} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">+10</h4>
                  <p className="text-sm sm:text-base font-medium text-slate-500">Anos de Experiência dos Profissionais</p>
                </div>
              </div>

              <div className="flex items-center group hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all gap-5 p-4">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} className="text-brand-600" />
                </div>
                <div>
                  <h4 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">100%</h4>
                  <p className="text-sm sm:text-base font-medium text-slate-500">Foco em SEO White-Hat</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* External decorative blurs - Reduced intensity to avoid muddiness */}
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
          <div className="space-y-5 text-slate-600 leading-relaxed font-light flex-1 text-justify md:text-left">
            <p>Somos uma <strong>agência de SEO</strong> dedicada e focada exclusivamente em performance orgânica e <strong className="font-semibold">venda de backlinks</strong> estratégicos de alta autoridade. Atuamos todos os dias ajudando empresas a dominarem o Google com metodologias ágeis e técnicas muito precisas.</p>
            <p>Cada projeto é rigorosamente construído a partir de uma <RouterLink to="/auditoria"><strong className="font-semibold text-brand-600 underline underline-offset-2 hover:opacity-80 transition-opacity">auditoria de SEO</strong></RouterLink> aprofundada, entregando sempre relatórios transparentes e um planejamento personalizado que vai muito além do básico de <strong>SEO para sites</strong> convencionais.</p>
            <p>Nossa abordagem combina as mais avançadas técnicas de otimização de mercado, focando sempre na conversão real. Afinal, um tráfego volumoso não é nada sem a atração de leads que sejam extremamente qualificados.</p>
          </div>
        </div>
        <div className="bg-slate-50/50 rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center md:items-start text-center md:text-left h-full p-6 md:p-12">
          <div className="inline-flex items-center text-brand-600 font-bold uppercase tracking-widest text-[11px] gap-2 mb-8">
            <Search size={16} /> Entenda o Processo
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 mb-6 text-center md:text-left">O que podemos fazer pela sua empresa?</h2>
          <div className="space-y-5 text-slate-600 leading-relaxed font-light flex-1 text-justify md:text-left">
            <p>Uma <strong>agência de marketing SEO</strong> é responsável por preparar todo o terreno do seu domínio para receber visitas de forma constante e escalonada. Na Acelera SEO, aplicamos as nossas principais <RouterLink to="/servicos" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">soluções estratégicas e técnicas de busca avançada</RouterLink>.</p>
            <p>Através da nossa rigorosa <strong>seo auditoria</strong>, detectamos falhas invisíveis para amadores e construímos uma fundação baseada em credibilidade. Diferente da publicidade temporária, a presença orgânica se torna o principal ativo da sua visibilidade a longo prazo.</p>
            <p>Faça parte do grupo de negócios que investe pesado em aquisições contínuas, seja lidando com consultorias especializadas ou buscando a curadoria única na <strong>venda de backlinks</strong> (link building exclusivo).</p>
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
        <h2 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight mb-8 md:mb-8 lg:mb-16 text-center md:text-left">Nossos Objetivos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {objs.map(o => (
            <div key={o.title} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8">
              {o.icon}
              <h3 className="font-bold text-slate-800 text-base lg:text-lg font-display uppercase tracking-tight leading-snug text-center md:text-left">
                {o.title}
                <span className="block text-brand-600 font-medium mt-1">{o.subtitle}</span>
              </h3>
            </div>
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
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display mb-6 text-center md:text-left">Soluções Transformadas em <span className="text-brand-600">Resultados</span>.</h2>
          <p className="text-lg text-slate-500 font-light leading-relaxed text-justify md:text-center">Transformamos a presença digital da sua empresa através de uma metodologia de SEO de alta performance. Nosso foco é converter buscas em faturamento colocando você no topo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 hover:border-brand-200/60 transition-all duration-300 group flex flex-col items-center text-center md:items-start md:text-left p-8 sm:p-10"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform duration-300 mb-6 mx-auto md:mx-0">
                {s.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight group-hover:text-brand-600 transition-colors mb-4 text-center md:text-left">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base mb-8 text-justify md:text-left">{s.desc}</p>
              <div className="flex flex-wrap mt-auto justify-center md:justify-start gap-2 w-full">
                {s.features.map(f => (
                  <span key={f} className="text-xs font-semibold tracking-wide px-3.5 py-1.5 bg-slate-100 text-slate-600 border border-slate-200/60 rounded-full group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-100 transition-colors">
                    {f}
                  </span>
                ))}
              </div>
            </div>
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
    <section className="bg-white border-t border-slate-200 py-12 md:py-20 lg:py-24" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-display text-center md:text-left">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-500 font-light text-lg mt-4 text-justify md:text-center">
            Dúvidas rápidas sobre nossa agência SEO e nossa forma de trabalho com SEO para sites.
          </p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800 font-display mb-3 text-center md:text-left">{faq.q}</h3>
              <p className="text-slate-600 font-light leading-relaxed text-justify md:text-left">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AuditSection = () => {
  return (
    <section className="relative bg-slate-50 border-t border-slate-200/60 overflow-hidden py-12 md:py-16">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-50 rounded-full blur-[80px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/50 rounded-full blur-[60px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-3xl mx-auto relative z-10 px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center p-6 md:p-8">
          
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-600 border border-brand-100 shadow-sm mb-4">
             <Zap size={24} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-display leading-tight mb-3 text-center md:text-left">
            Descubra o que impede seu <span className="text-brand-600">ranqueamento</span>.
          </h2>
          
          <p className="text-base text-slate-500 font-light max-w-lg mx-auto leading-relaxed mb-6 text-justify md:text-center">
            O tráfego de amanhã se conquista ajustando a infraestrutura hoje. Faça uma avaliação técnica rápida do seu domínio.
          </p>
          
          <form className="flex flex-col sm:flex-row w-full max-w-xl mx-auto p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-300 transition-all duration-300 gap-2">
            <input 
              type="url" 
              placeholder="Cole seu domínio (ex: https://empresa.com.br)" 
              className="w-full sm:flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 font-medium rounded-lg text-sm px-4 py-2"
              required
            />
            <RouterLink to="/auditoria" className="w-full sm:w-auto bg-slate-900 text-white font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-sm text-sm flex items-center justify-center text-center whitespace-nowrap px-6 py-2">
              Gerar Diagnóstico
            </RouterLink>
          </form>
          
          <div className="text-slate-500 text-[11px] font-medium flex items-center bg-slate-50 py-1.5 rounded-full border border-slate-100 mt-5 gap-2 px-3">
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

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto gap-8 md:gap-12 lg:gap-16">
        
        <div className="lg:col-span-4 max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Acelera SEO Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
            <span className="text-xl font-display font-bold text-slate-800">Acelera <span className="text-brand-600 font-light">SEO</span></span>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 text-justify md:text-left">
            Poder computacional aliado à ciência estratégica para multiplicar sua receita via descoberta orgânica. Desenvolvemos ecossistemas analíticos e frameworks que traduzem a sua autoridade em tráfego previsível.
          </p>
          <div className="flex gap-3">
             <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-200 shadow-sm transition-all"><Globe2 size={18}/></a>
             <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-200 shadow-sm transition-all"><Zap size={18}/></a>
          </div>
        </div>

        <div className="lg:col-span-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-8 mb-12">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/sobre" className="text-sm text-slate-500 hover:text-brand-600">Sobre a Agência</RouterLink></li>
                <li><RouterLink to="/contato" className="text-sm text-slate-500 hover:text-brand-600">Fale Conosco</RouterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Serviços</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/servicos" className="text-sm text-slate-500 hover:text-brand-600">Nossas Soluções</RouterLink></li>
                <li><RouterLink to="/auditoria" className="text-sm text-slate-500 hover:text-brand-600">Auditoria Grátis</RouterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Recursos</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/blog" className="text-sm text-slate-500 hover:text-brand-600">Blog SEO</RouterLink></li>
                <li><RouterLink to="/login" className="text-sm text-slate-500 hover:text-brand-600">Acesso ao Sistema</RouterLink></li>
              </ul>
            </div>
            <div>
               <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
               <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600">Termos de Uso</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600">Privacidade</a></li>
               </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8">
            <h4 className="font-bold text-slate-900 mb-6">Atendimento Regional SEO</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2">
              <li><RouterLink to="/agencia-seo-sao-paulo" className="text-sm text-slate-600 hover:text-brand-600">São Paulo (SP)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-rio-de-janeiro" className="text-sm text-slate-600 hover:text-brand-600">Rio de Janeiro (RJ)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-belo-horizonte" className="text-sm text-slate-600 hover:text-brand-600">Belo Horizonte (MG)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-vitoria" className="text-sm text-slate-600 hover:text-brand-600">Vitória (ES)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-curitiba" className="text-sm text-slate-600 hover:text-brand-600">Curitiba (PR)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-florianopolis" className="text-sm text-slate-600 hover:text-brand-600">Florianópolis (SC)</RouterLink></li>
              <li><RouterLink to="/agencia-seo-porto-alegre" className="text-sm text-slate-600 hover:text-brand-600">Porto Alegre (RS)</RouterLink></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-200 flex flex-col justify-between items-center mt-8 md:mt-8 lg:mt-16 pt-8 gap-6">
        <p className="text-sm font-medium text-slate-400 text-center">© 2026 Acelera SEO Analytics. Todos os direitos protegidos.</p>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <TechStackMarquee />
      <section className="border-b border-slate-200/50 bg-white py-10">
        <div className="max-w-7xl mx-auto overflow-hidden px-6">
          <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Plataformas Utilizadas</div>
          <div className="flex flex-wrap justify-center items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 gap-4 md:gap-6 lg:gap-8">
            <div className="flex items-center gap-1.5 text-sm md:text-base font-medium font-display tracking-tight text-slate-500">
              <span className="font-bold text-slate-700">Google</span> Search Console
            </div>
            <div className="text-sm md:text-base font-bold font-display tracking-tight text-slate-700">
              Ubersuggest
            </div>
            <div className="text-sm md:text-base font-black font-display tracking-tight text-orange-600">
              SEMRUSH
            </div>
            <div className="flex items-center gap-1.5 text-sm md:text-base font-medium font-display tracking-tight text-slate-500">
              <span className="font-bold text-slate-700">Google</span> Analytics
            </div>
            <div className="text-sm md:text-base font-bold font-display tracking-tight text-blue-500">
              ahrefs
            </div>
            <div className="text-sm md:text-base font-bold font-display tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="text-orange-500 text-[10px] md:text-xs">★★★★★</span>
              MAJESTIC
            </div>
            <div className="text-base md:text-lg font-black font-display tracking-tighter text-sky-500">
              MOZ
            </div>
            <div className="text-sm md:text-base font-bold font-display tracking-tight flex items-center gap-1">
              <span className="text-blue-600">Similar</span><span className="text-slate-800">web</span>
            </div>
             <div className="text-sm md:text-base font-bold font-display tracking-tight text-slate-700">
              Surfer<span className="text-brand-500">SEO</span>
            </div>
          </div>
        </div>
      </section>
      <AboutSection />
      <ObjectivesSection />
      <div id="solucoes"></div>
      <Services />
      <FaqSection />
      <AuditSection />
    </>
  );
};

import LoginPage from './pages/Login';
import AuthRoute from './components/AuthRoute';

import { GlobalSeo } from './components/SeoHeader';

import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const hideGlobalLayout = ['/portal-cliente', '/painel', '/dashboard'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-brand-200 selection:text-brand-900">
      <Helmet>
        <html lang="pt-BR" />
        <title>Agência de SEO para Sites | Especialista em Venda de Backlinks e Auditoria SEO</title>
        <meta name="description" content="A Acelera SEO é a agência de marketing SEO perfeita para escalar faturamento através de auditoria de SEO profunda, SEO para sites, conteúdo técnico e venda de backlinks com alta autoridade." />
        <meta property="og:title" content="Acelera SEO | Agência de SEO de Alta Performance" />
        <meta property="og:description" content="Engenharia reversa e otimização tech extrema focada em auditorias SEO para posicionar o site da sua empresa onde os clientes realmente buscam." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://acelera-seo.com.br" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {!hideGlobalLayout && <Navbar />}
      
      <main className={`flex-grow ${hideGlobalLayout ? '' : 'pt-24'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/seo-ecommerce" element={<SeoEcommercePage />} />
          <Route path="/consultoria-seo" element={<ConsultoriaSeoPage />} />
          <Route path="/agencia-link-building" element={<LinkBuildingPage />} />
          <Route path="/venda-backlinks" element={<VendaBacklinksPage />} />
          <Route path="/especialista-em-seo" element={<EspecialistaSeoPage />} />
          
          {/* Regional SEO Pages - Sudeste e Sul */}
          <Route path="/agencia-seo-sao-paulo" element={<SeoLocalPage city="São Paulo" state="SP" slug="agencia-seo-sao-paulo" />} />
          <Route path="/agencia-seo-rio-de-janeiro" element={<SeoLocalPage city="Rio de Janeiro" state="RJ" slug="agencia-seo-rio-de-janeiro" />} />
          <Route path="/agencia-seo-belo-horizonte" element={<SeoLocalPage city="Belo Horizonte" state="MG" slug="agencia-seo-belo-horizonte" />} />
          <Route path="/agencia-seo-vitoria" element={<SeoLocalPage city="Vitória" state="ES" slug="agencia-seo-vitoria" />} />
          <Route path="/agencia-seo-curitiba" element={<SeoLocalPage city="Curitiba" state="PR" slug="agencia-seo-curitiba" />} />
          <Route path="/agencia-seo-florianopolis" element={<SeoLocalPage city="Florianópolis" state="SC" slug="agencia-seo-florianopolis" />} />
          <Route path="/agencia-seo-porto-alegre" element={<SeoLocalPage city="Porto Alegre" state="RS" slug="agencia-seo-porto-alegre" />} />

          <Route path="/contato" element={<ContactPage />} />
          <Route path="/auditoria" element={<AuditPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal-cliente" element={<AuthRoute><ClientDashboard /></AuthRoute>} />
          <Route path="/painel" element={<AuthRoute><DashboardPage /></AuthRoute>} />
        </Routes>
        <GlobalSeo />
      </main>

      {!hideGlobalLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

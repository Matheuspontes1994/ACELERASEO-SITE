import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Users, ChevronDown, ArrowRight } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSettings, getDefaultLogo } from '../contexts/SettingsContext';

export const Navbar = () => {
  const { logoUrl } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

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
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <RouterLink 
      to={to} 
      className={`text-sm font-medium transition-all relative py-1 ${
        isActive(to) 
          ? 'text-brand-600 font-bold' 
          : 'text-slate-500 hover:text-brand-600'
      }`}
    >
      {children}
      {isActive(to) && (
        <motion.span 
          layoutId="navbar-active"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full"
        />
      )}
    </RouterLink>
  );

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        (isScrolled || mobileMenuOpen) ? 'py-3 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'py-3 md:py-6 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <RouterLink to="/" className="flex items-center gap-3 group">
              <img 
                src={logoUrl} 
                alt="Acelera SEO Logo" 
                className="h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
                onError={(e) => (e.target as HTMLImageElement).src = getDefaultLogo()} 
                fetchPriority="high"
              />
              <span className="text-2xl font-display font-bold tracking-tight text-slate-800">
                Acelera <span className="text-brand-600 font-light underline decoration-brand-200 decoration-2 underline-offset-4">SEO</span>
              </span>
            </RouterLink>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/sobre">Sobre</NavLink>
            
            <div className="relative group py-6">
              <button className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors flex items-center focus:outline-none gap-1">
                Soluções <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-64 bg-white shadow-2xl rounded-3xl border border-slate-100 overflow-hidden z-50 p-2">
                <div className="flex flex-col">
                  {[
                    { name: 'SEO para E-commerce', path: '/seo-ecommerce' },
                    { name: 'Consultoria SEO', path: '/consultoria-seo' },
                    { name: 'Especialista em SEO', path: '/especialista-em-seo' },
                    { name: 'Agência Link Building', path: '/agencia-link-building' },
                    { name: 'Venda de Backlinks', path: '/venda-backlinks' }
                  ].map((item) => (
                    <RouterLink 
                      key={item.path}
                      to={item.path} 
                      className="block text-xs text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-all font-medium px-4 py-3"
                    >
                      {item.name}
                    </RouterLink>
                  ))}
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <RouterLink to="/servicos" className="block text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors text-center px-4 py-3">
                      Ver todas as soluções
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contato">Contato</NavLink>
            <RouterLink to="/auditoria" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Auditoria Grátis</RouterLink>
            
            <div className="flex items-center ml-4 pl-6 border-l border-slate-200 gap-3">
              <RouterLink 
                to="/login" 
                className="flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all focus:outline-none" 
                aria-label="Acessar Sistema"
              >
                <Users size={18} />
              </RouterLink>
              <a 
                href="https://wa.me/5511992229927?text=Olá, vi o site e gostaria de uma consultoria!" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all transform hover:-translate-y-0.5 px-6"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <button 
            className="lg:hidden text-slate-800 p-2 hover:bg-slate-50 rounded-xl transition-colors" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-[1000] bg-white flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center h-[80px] border-b border-slate-100 px-6">
              <RouterLink to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <img src={logoUrl} alt="Acelera SEO Logo" className="h-10 w-auto object-contain" />
                <span className="text-2xl font-display font-bold text-slate-900">Acelera<span className="text-brand-600 font-light">SEO</span></span>
              </RouterLink>
              <button 
                className="text-slate-500 hover:bg-slate-100 rounded-xl transition-colors p-2 border border-slate-100" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8 pb-32">
              <nav className="flex flex-col gap-4">
                <RouterLink to="/sobre" className="text-2xl font-display font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Sobre</RouterLink>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setSolutionsOpen(!solutionsOpen)} 
                    className="flex items-center justify-between text-2xl font-display font-bold text-slate-800"
                  >
                    Soluções
                    <ChevronDown size={24} className={`transition-transform duration-300 ${solutionsOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {solutionsOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-4 pl-4 border-l-2 border-brand-100"
                      >
                        {[
                          { name: 'SEO E-commerce', path: '/seo-ecommerce' },
                          { name: 'Consultoria SEO', path: '/consultoria-seo' },
                          { name: 'Agência Link Building', path: '/agencia-link-building' },
                          { name: 'Especialista SEO', path: '/especialista-em-seo' },
                          { name: 'Venda Backlinks', path: '/venda-backlinks' },
                        ].map(s => (
                          <RouterLink key={s.path} to={s.path} className="text-lg text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{s.name}</RouterLink>
                        ))}
                        <RouterLink to="/servicos" className="text-lg font-bold text-brand-600 flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>Todas Soluções <ArrowRight size={18} /></RouterLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <RouterLink to="/blog" className="text-2xl font-display font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Blog</RouterLink>
                <RouterLink to="/contato" className="text-2xl font-display font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Contato</RouterLink>
              </nav>
              
              <div className="flex flex-col gap-4 pt-8 border-t border-slate-100">
                <RouterLink to="/auditoria" className="w-full bg-brand-600 text-white rounded-2xl font-bold py-5 text-center text-lg shadow-lg shadow-brand-500/20" onClick={() => setMobileMenuOpen(false)}>
                  Auditoria Grátis
                </RouterLink>
                <RouterLink to="/login" className="w-full bg-slate-100 text-slate-700 rounded-2xl font-bold py-5 text-center text-lg flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Users size={20} /> Acesso ao Sistema
                </RouterLink>
                <a 
                  href="https://wa.me/5511992229927" 
                  className="w-full bg-slate-900 text-white rounded-2xl font-bold py-5 text-center text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

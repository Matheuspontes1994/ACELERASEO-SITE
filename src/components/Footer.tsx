import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Globe2, Zap, Linkedin, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export const Footer = () => {
  const { logoUrl } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto gap-8 md:gap-12 lg:gap-16">
        
        {/* Branding & Contact Info */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <img src={logoUrl} alt="Acelera SEO Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-display font-bold text-slate-800">Acelera <span className="text-brand-600 font-light">SEO</span></span>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
            Especialistas em SEO técnico e performance orgânica. Decodificamos os algoritmos para transformar sua autoridade em faturamento real e previsível.
          </p>
          
          <div className="space-y-4 mb-8">
            <a href="tel:+5511992229927" className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone size={14} className="text-brand-600" />
              </div>
              (11) 99222-9927
            </a>
            <a href="mailto:contato@aceleraseo.com.br" className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={14} className="text-brand-600" />
              </div>
              contato@aceleraseo.com.br
            </a>
          </div>

          <div className="flex gap-3">
             <a 
               href="https://linkedin.com/company/aceleraseo" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0077b5] hover:border-[#0077b5]/30 shadow-sm transition-all"
               aria-label="LinkedIn"
             >
               <Linkedin size={18} fill="currentColor" />
             </a>
             <a 
               href="https://instagram.com/aceleraseo" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#e4405f] hover:border-[#e4405f]/30 shadow-sm transition-all"
               aria-label="Instagram"
             >
               <Instagram size={18} />
             </a>
             <a 
               href="https://twitter.com/aceleraseo" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1da1f2] hover:border-[#1da1f2]/30 shadow-sm transition-all"
               aria-label="X (Twitter)"
             >
               <Twitter size={18} fill="currentColor" />
             </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="lg:col-span-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-8 mb-12">
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Agência</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/sobre" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Sobre Nós</RouterLink></li>
                <li><RouterLink to="/contato" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Fale Conosco</RouterLink></li>
                <li><RouterLink to="/blog" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Blog SEO</RouterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Soluções</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/servicos" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Todos os Serviços</RouterLink></li>
                <li><RouterLink to="/consultoria-seo" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Consultoria SEO</RouterLink></li>
                <li><RouterLink to="/seo-ecommerce" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">SEO E-commerce</RouterLink></li>
                <li><RouterLink to="/venda-backlinks" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Link Building</RouterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Sistema</h4>
              <ul className="space-y-3">
                <li><RouterLink to="/login" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Portal do Cliente</RouterLink></li>
                <li><RouterLink to="/auditoria" className="text-sm text-brand-600 font-bold hover:text-brand-700 transition-colors">Auditoria Grátis</RouterLink></li>
              </ul>
            </div>
            <div>
               <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Legal</h4>
               <ul className="space-y-3">
                <li><RouterLink to="/termos" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Termos de Uso</RouterLink></li>
                <li><RouterLink to="/privacidade" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">Privacidade</RouterLink></li>
               </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Globe2 size={16} className="text-brand-600" /> Atendimento Regional SEO
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2">
              {[
                { name: 'São Paulo (SP)', route: '/agencia-seo-sao-paulo' },
                { name: 'Rio de Janeiro (RJ)', route: '/agencia-seo-rio-de-janeiro' },
                { name: 'Belo Horizonte (MG)', route: '/agencia-seo-belo-horizonte' },
                { name: 'Vitória (ES)', route: '/agencia-seo-vitoria' },
                { name: 'Curitiba (PR)', route: '/agencia-seo-curitiba' },
                { name: 'Florianópolis (SC)', route: '/agencia-seo-florianopolis' },
                { name: 'Porto Alegre (RS)', route: '/agencia-seo-porto-alegre' }
              ].map((loc) => (
                <li key={loc.route}>
                  <RouterLink to={loc.route} className="text-xs text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-brand-400 transition-colors"></span>
                    {loc.name}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-200 flex flex-col md:flex-row justify-between items-center mt-12 md:mt-16 pt-8 gap-4">
        <p className="text-xs font-medium text-slate-400 text-center md:text-left">
          © {currentYear} Acelera SEO Analytics. CNPJ: 00.000.000/0001-00. Sua agência boutique de performance orgânica.
        </p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Feito com <span className="text-brand-500">foco</span> em resultados Reais
        </p>
      </div>
    </footer>
  );
};

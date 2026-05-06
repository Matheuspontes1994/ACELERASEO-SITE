import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const phoneNumber = "5531999229927"; // Número padronizado
  const message = encodeURIComponent("Olá, vi o site da Acelera SEO e gostaria de uma consultoria estratégica!");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-center gap-3"
          >
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-xl px-4 py-3 hidden sm:block whitespace-nowrap relative mr-1"
              >
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-1 -right-1 bg-slate-100 text-slate-400 rounded-full p-0.5 hover:bg-slate-200 transition-colors"
                >
                  <X size={8} />
                </button>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1.5">Análise Técnica Gratuita</span>
                <span className="text-[11px] font-bold text-slate-800 block leading-[1.5] max-w-[320px] whitespace-normal">
                  Receba uma análise do seu site, concorrentes e <br />
                  descubra oportunidades reais de crescimento.
                </span>
              </motion.div>
            )}
            
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-tr from-brand-700 to-brand-500 text-white rounded-2xl flex items-center justify-center shadow-[0_15px_45px_rgba(37,99,235,0.3)] relative group border border-white/20"
              aria-label="Falar conosco no WhatsApp"
            >
              <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500 border-2 border-white"></span>
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

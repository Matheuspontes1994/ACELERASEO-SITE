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

  const phoneNumber = "5511992229927"; // Número padronizado
  const message = encodeURIComponent("Olá, vi o site da Acelera SEO e gostaria de uma consultoria estratégica!");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isVisible && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 max-w-[240px] mb-2 relative"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 bg-slate-100 text-slate-500 rounded-full p-1 hover:bg-slate-200 transition-colors"
              aria-label="Fechar aviso"
            >
              <X size={12} />
            </button>
            <p className="text-xs font-semibold text-slate-800 mb-2">🚀 Consultoria Grátis</p>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Quer triplicar seu tráfego orgânico? Fale com um especialista agora mesmo.
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Iniciar conversa <ArrowRight size={12} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.a
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] relative group"
            aria-label="Falar conosco no WhatsApp"
          >
            <MessageCircle size={32} fill="currentColor" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

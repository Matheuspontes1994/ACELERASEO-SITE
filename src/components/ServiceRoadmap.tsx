import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ServiceRoadmapProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
}

export const ServiceRoadmap: React.FC<ServiceRoadmapProps> = ({ 
  steps, 
  title = "Nosso Processo de Trabalho", 
  subtitle = "Uma metodologia clara e orientada a resultados para escalar seu tráfego orgânico." 
}) => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <CheckCircle2 size={14} /> Metodologia Acelera
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tight mb-6"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-light leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical line that connects steps */}
          <div className="absolute left-4 md:left-[2.25rem] top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500/50 via-brand-200 to-transparent rounded-full hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-6 md:gap-12 group"
              >
                {/* Step indicator */}
                <div className="relative z-10 shrink-0 hidden md:flex items-center justify-center w-18 h-18 rounded-3xl bg-white border-2 border-brand-100 shadow-sm text-brand-600 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 group-hover:shadow-brand-200/50 transition-all duration-300">
                   {step.icon ? (
                     <div className="scale-125">{step.icon}</div>
                   ) : (
                     <span className="text-2xl font-black font-display">{index + 1}</span>
                   )}
                </div>

                {/* Mobile/Small screens indicator */}
                <div className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white shrink-0 mt-1">
                   <span className="font-bold">{index + 1}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-[2rem] border border-slate-200/60 p-6 md:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:border-brand-200 transition-all duration-300 relative">
                  <div className="absolute top-6 right-8 text-5xl font-black text-slate-50 font-display pointer-events-none group-hover:text-brand-50 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-light text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


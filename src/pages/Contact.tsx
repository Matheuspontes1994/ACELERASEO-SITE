import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Send, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', whatsapp: '', company: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden pt-0 pb-0 relative">
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-50/30 blur-[120px] rounded-full pointer-events-none" />
      
      <Helmet>
        <title>Contato | Especialistas em Auditoria de SEO e Marketing SEO</title>
        <meta name="description" content="Fale com nossos especialistas em auditoria de SEO. Inicie seu projeto de SEO para sites focado na liderança orgânica hoje com a nossa agência seo." />
        <link rel="canonical" href="https://aceleraseo.com.br/contato" />
        <meta property="og:title" content="Contato | Especialistas em Auditoria de SEO e Marketing SEO" />
        <meta property="og:description" content="Fale com nossos especialistas em auditoria de SEO. Inicie seu projeto de SEO para sites focado na liderança orgânica hoje com a nossa agência seo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/contato" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-20 lg:pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 items-start gap-8 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden p-8 md:p-10 group hover:border-brand-200 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-full blur-[40px] opacity-60 mix-blend-multiply group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-8">Informações de Contato</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 shrink-0 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight">Sede Operacional</h4>
                    <p className="text-slate-500 text-sm mt-1">Belo Horizonte, MG</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 shrink-0 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight">E-mail Comercial</h4>
                    <p className="text-slate-500 text-sm mt-1 mb-2">Para propostas e novos negócios</p>
                    <a href="mailto:aceleraseo@gmail.com" className="font-bold text-brand-600 hover:text-brand-700 transition-colors relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-brand-600/30">aceleraseo@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 shrink-0 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight">Telefone / WhatsApp</h4>
                    <p className="text-slate-500 text-sm mt-1 mb-2">Respostas em menos de 10 min comerciais</p>
                    <a href="https://wa.me/5531999229927" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-600 hover:text-brand-700 transition-colors text-lg tracking-tight">+55 31 99922-9927</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl text-white p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)] pointer-events-none" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400">
                  <Clock size={20} />
                </div>
                <h4 className="font-bold text-lg tracking-tight">Horário de Atendimento</h4>
              </div>
              <p className="text-slate-400 font-medium relative z-10">Segunda à Sexta, das 09h às 18h <span className="text-slate-600 italic ml-2">(Horário de Brasília)</span></p>
              <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                <p className="text-slate-500 text-xs leading-relaxed">* Atendemos clientes Enterprise em regime 24/7 nas auditorias emergenciais (queda de tráfego).</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2 relative z-10">Mande sua mensagem</h3>
            <p className="text-slate-500 font-medium mb-10 relative z-10">Inicie seu projeto preenchendo o formulário abaixo.</p>

            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 rounded-2xl border border-emerald-100 text-center p-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 size={32} />
                </div>
                <h4 className="text-emerald-800 font-bold text-xl mb-2">Mensagem Enviada!</h4>
                <p className="text-emerald-600 font-medium mb-1">Obrigado pelo seu interesse.</p>
                <p className="text-emerald-600/70 text-sm mb-6">Nossa equipe comercial analisará seu caso e entrará em contato em até 2 horas úteis.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setStatus('idle')} className="py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors px-6">
                    Enviar outra mensagem
                  </button>
                  <Link to="/" className="text-xs text-emerald-700 hover:underline">Voltar para a Home</Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-1">
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 px-4 py-3"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 px-4 py-3"
                      placeholder="nome@empresa.com.br"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="whatsapp" className="block text-sm font-bold text-slate-700 mb-2">WhatsApp / Telefone</label>
                    <input 
                      type="tel" 
                      id="whatsapp" 
                      required 
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 px-4 py-3"
                      placeholder="(31) 99999-9999"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="company" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Empresa / Site</label>
                    <input 
                      type="text" 
                      id="company" 
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 px-4 py-3"
                      placeholder="Sua empresa ou URL do site"
                    />
                  </div>
                </div>
                <div className="relative z-10">
                  <label htmlFor="message" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Como podemos te ajudar?</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 resize-none px-5 py-4"
                    placeholder="Descreva brevemente os desafios de SEO da sua empresa..."
                  ></textarea>
                </div>

                {status === 'error' && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-rose-500 bg-rose-50 rounded-xl border border-rose-100 px-4 py-3 relative z-10">Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.</motion.p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed px-8 py-5 gap-3 relative z-10"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={20} className="animate-spin" /> Processando...</>
                  ) : (
                    <>
                      <span>Enviar Mensagem</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

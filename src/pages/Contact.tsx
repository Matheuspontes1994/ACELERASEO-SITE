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
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contato | Especialistas em Auditoria de SEO e Marketing SEO" />
        <meta name="twitter:description" content="Fale com nossos especialistas em auditoria de SEO. Inicie seu projeto de SEO para sites focado na liderança orgânica hoje com a nossa agência seo." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold uppercase tracking-widest text-sm bg-brand-50 rounded-full inline-block px-4 py-2 mb-6">Fale Conosco</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.1] mb-6 text-center md:text-center">
            Inicie seu projeto na melhor agência de marketing SEO focada em conversão.
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed text-justify md:text-center">
            Nossa equipe de especialistas está pronta para realizar uma profunda <strong>auditoria de SEO</strong> no seu site e apresentar um plano de ação escalável para o Google através dos nossos <Link to="/servicos" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">serviços focados em <strong>SEO para sites</strong> e <strong>venda de backlinks</strong></Link>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 items-start gap-8 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-10 text-justify md:text-left">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-[40px] opacity-60 mix-blend-multiply"></div>
              <h3 className="text-2xl font-bold text-slate-900 font-display mb-8 text-center md:text-left">Informações de Contato</h3>
              
              <div className="space-y-6 text-justify md:text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Sede Operacional</h4>
                    <p className="text-slate-500 text-sm mt-1">Belo Horizonte, MG</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">E-mail Comercial</h4>
                    <p className="text-slate-500 text-sm mt-1 mb-2">Para propostas e novos negócios</p>
                    <a href="mailto:aceleraseo@gmail.com" className="font-medium text-brand-600 hover:text-brand-800 transition-colors">aceleraseo@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Telefone / WhatsApp</h4>
                    <p className="text-slate-500 text-sm mt-1 mb-2">Respostas em menos de 10 minutos comerciais</p>
                    <a href="https://wa.me/553199229927" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:text-brand-800 transition-colors">+55 31 9922-9927</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl text-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-brand-400" size={24} />
                <h4 className="font-bold text-lg">Horário de Atendimento</h4>
              </div>
              <p className="text-slate-400 text-sm mb-2">Segunda à Sexta, das 09h às 18h (BRT)</p>
              <p className="text-slate-500 text-xs mt-4">* Atendemos clientes Enterprise em regime 24/7 nas auditorias emergenciais (queda de tráfego).</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2 text-center md:text-left">Mande sua mensagem</h3>
            <p className="text-slate-500 font-medium mb-8">Você também pode iniciar um projeto preenchendo o formulário abaixo.</p>

            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 rounded-2xl border border-emerald-100 text-center p-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 size={32} />
                </div>
                <h4 className="text-emerald-800 font-bold text-xl mb-2">Mensagem Enviada!</h4>
                <p className="text-emerald-600 font-medium mb-6">Nossa equipe comercial entrará em contato com você em breve.</p>
                <button onClick={() => setStatus('idle')} className="py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors px-6">
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
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
                  <div>
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
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2">Empresa / Site</label>
                  <input 
                    type="text" 
                    id="company" 
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 px-4 py-3"
                    placeholder="Sua empresa ou URL do site"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Como podemos te ajudar?</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 resize-none px-4 py-3"
                    placeholder="Descreva brevemente os desafios de SEO da sua empresa..."
                  ></textarea>
                </div>

                {status === 'error' && (
                  <p className="text-sm font-medium text-rose-500 bg-rose-50 rounded-xl border border-rose-100 p-3">Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed px-8 py-4 gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={20} className="animate-spin" /> Processando...</>
                  ) : (
                    <>Enviar Mensagem <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

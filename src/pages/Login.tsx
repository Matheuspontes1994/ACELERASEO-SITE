import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Lock, Mail, Loader2, Rocket, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
      const isAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
      
      const from = location.state?.from?.pathname;
      let target = '/portal-cliente';
      
      if (isAdmin) {
         target = from && from !== '/login' && from !== '/' ? from : '/painel';
      } else {
         target = '/portal-cliente';
      }

      navigate(target);
    } catch (err: any) {
      console.error(err);
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          setError('Senha incorreta. Verifique suas credenciais e tente novamente.');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado. Verifique o e-mail ou crie uma conta.');
          break;
        case 'auth/invalid-email':
          setError('O e-mail informado tem um formato inválido.');
          break;
        case 'auth/user-disabled':
          setError('Esta conta foi desativada. Entre em contato com o suporte.');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas malsucedidas. Sua conta foi temporariamente bloqueada.');
          break;
        case 'auth/network-request-failed':
          setError('Erro de conexão. Verifique sua internet.');
          break;
        default:
          setError('Falha no acesso. Verifique seu e-mail e senha.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <Helmet>
        <title>Acesso | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[100px] opacity-70 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[80px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Back button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20 hidden md:block"
      >
        <RouterLink 
          to="/" 
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Voltar para o site</span>
        </RouterLink>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="mx-auto w-16 h-16 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-center mb-6"
          >
            <Rocket className="h-8 w-8 text-brand-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Acesso ao Sistema
          </h2>
          <p className="text-base text-slate-500 font-medium mt-2">
            Olá! Digite suas credenciais para entrar no painel.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-3xl border border-white p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Seu melhor e-mail
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm"
                  placeholder="exemplo@aceleraseo.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Senha de acesso
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    if (!email) {
                      alert("Por favor, digite seu e-mail no campo acima para recuperar sua senha.");
                      return;
                    }
                    if (window.confirm(`Deseja receber um e-mail de recuperação de senha para ${email}?`)) {
                      sendPasswordResetEmail(auth, email)
                        .then(() => alert("E-mail de recuperação enviado! Verifique sua caixa de entrada."))
                        .catch((err) => alert("Erro ao enviar e-mail: " + err.message));
                    }
                  }}
                  className="text-[10px] font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-wider"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center px-4 py-3 gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl text-white bg-slate-900 hover:bg-brand-600 font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Entrar agora</span>
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Ainda não é cliente? <RouterLink to="/contato" className="text-brand-600 font-bold hover:underline">Entre em contato</RouterLink>
            </p>
          </div>
        </div>
        
        {/* Mobile Voltar link */}
        <div className="mt-8 text-center md:hidden">
          <RouterLink 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao site principal
          </RouterLink>
        </div>
      </motion.div>

      {/* Simple Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Acelera SEO - All Rights Reserved
        </p>
      </div>
    </div>
  );
}

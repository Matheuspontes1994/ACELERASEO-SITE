import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Lock, Mail, Loader2, Rocket, ArrowLeft, ChevronRight, User, Globe, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get params from URL
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get('clientId');
  const clientEmailFromUrl = queryParams.get('clientEmail');
  const clientNameFromUrl = queryParams.get('clientName');
  const clientWebsiteFromUrl = queryParams.get('clientWebsite');

  useEffect(() => {
    if (clientEmailFromUrl) setEmail(clientEmailFromUrl);
    if (clientNameFromUrl) setName(clientNameFromUrl);
    if (clientWebsiteFromUrl) setWebsite(clientWebsiteFromUrl);
  }, [clientEmailFromUrl, clientNameFromUrl, clientWebsiteFromUrl]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (clientIdFromUrl) {
        // Update existing client document instead of creating a new one
        await updateDoc(doc(db, 'clients', clientIdFromUrl), {
          uid: user.uid,
          updatedAt: serverTimestamp(),
          // Sync fields in case they were edited in the form
          name,
          clientEmail: email,
          websiteUrl: website
        });
      } else {
        // Fallback for direct registration (create new client record)
        await addDoc(collection(db, 'clients'), {
          name,
          clientEmail: email,
          websiteUrl: website,
          uid: user.uid,
          active: true,
          createdAt: serverTimestamp(),
          agencyUid: 'admin' // Default to admin for self-registrations
        });
      }

      navigate('/portal-cliente');
    } catch (err: any) {
      console.error(err);
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está cadastrado no sistema. Tente fazer login ou recuperar sua senha.');
          break;
        case 'auth/invalid-email':
          setError('O e-mail informado tem um formato inválido.');
          break;
        case 'auth/operation-not-allowed':
          setError('O cadastro por e-mail e senha não está ativado.');
          break;
        case 'auth/weak-password':
          setError('A senha escolhida é muito fraca (mínimo 6 caracteres).');
          break;
        case 'auth/network-request-failed':
          setError('Erro de conexão. Verifique sua internet.');
          break;
        default:
          setError('Falha ao criar conta. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <Helmet>
        <title>Criar Conta | Acelera SEO</title>
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
          to="/login" 
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Voltar para o login</span>
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
            <User className="h-8 w-8 text-brand-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Criar sua Conta
          </h2>
          <p className="text-base text-slate-500 font-medium mt-2">
            Junte-se à Acelera SEO e comece sua jornada.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-3xl border border-white p-8 md:p-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Seu Nome
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!!clientNameFromUrl}
                    className={`block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm ${clientNameFromUrl ? 'bg-slate-100 cursor-not-allowed opacity-75' : 'bg-slate-50/50'}`}
                    placeholder="João Silva"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Website / Empresa
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    id="website"
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    readOnly={!!clientWebsiteFromUrl}
                    className={`block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm ${clientWebsiteFromUrl ? 'bg-slate-100 cursor-not-allowed opacity-75' : 'bg-slate-50/50'}`}
                    placeholder="seusite.com.br"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Seu melhor e-mail
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!clientEmailFromUrl}
                  className={`block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm ${clientEmailFromUrl ? 'bg-slate-100 cursor-not-allowed opacity-75' : 'bg-slate-50/50'}`}
                  placeholder="exemplo@aceleraseo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm"
                    placeholder="******"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Confirmar
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm"
                    placeholder="******"
                  />
                </div>
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
                  <span>Criar minha conta</span>
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Já tem uma conta? <RouterLink to="/login" className="text-brand-600 font-bold hover:underline">Faça login</RouterLink>
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

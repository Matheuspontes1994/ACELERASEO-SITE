import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Loader2, Rocket } from 'lucide-react';

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
         // Se for Admin e estiver tentando acessar uma página protegida específica, respeita o 'from'
         target = from && from !== '/login' && from !== '/' ? from : '/painel';
      } else {
         // Clientes sempre vão para o portal-cliente
         target = '/portal-cliente';
      }

      navigate(target);
    } catch (err: any) {
      console.error(err);
      
      // Mapeamento de erros específicos do Firebase
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Acesso | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative backdrop */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-[80px] opacity-60 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[60px] opacity-60 pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md mx-auto text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mb-6">
          <Rocket className="h-8 w-8 text-brand-600" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Acesso ao Sistema
        </h2>
        <p className="text-center text-base text-slate-500 font-medium max-w-sm mx-auto mt-2">
          Faça login para acessar o painel de controle e seu hub de arquivos.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 mt-8">
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl sm:rounded-[2rem] border border-slate-200/60 py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Endereço de e-mail
              </label>
              <div className="relative rounded-xl shadow-sm mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block w-full pl-11 sm:text-sm border-slate-200 rounded-xl border bg-slate-50/50 outline-none transition-all px-4 py-3"
                  placeholder="você@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Senha
              </label>
              <div className="relative rounded-xl shadow-sm mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block w-full pl-11 sm:text-sm border-slate-200 rounded-xl border bg-slate-50/50 outline-none transition-all px-4 py-3"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div 
                role="alert" 
                aria-live="polite" 
                className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium flex items-center px-4 py-3 gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none px-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no Sistema'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

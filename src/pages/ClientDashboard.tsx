import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle2, 
  CheckCircle,
  ChevronDown,
  Activity,
  LogOut,
  Calendar,
  Code,
  AlertCircle,
  Users,
  Search,
  FileText,
  ArrowRight,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { collection, getDocs, updateDoc, doc, serverTimestamp, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useNavigate, Link } from 'react-router-dom';
import PostChat from '../components/PostChat';
import { HorizontalScroll } from '../components/HorizontalScroll';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [keywordsUniverse, setKeywordsUniverse] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [reviewingPost, setReviewingPost] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const [clientsData, setClientsData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
        setIsAdmin(isUserAdmin);
        
        const path = 'clients';
        try {
          const clientsQuery = isUserAdmin
            ? query(collection(db, path))
            : query(collection(db, path), where('clientEmail', '==', userEmail));
            
          const clientsSnap = await getDocs(clientsQuery);
          const clients = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          setClientsData(clients);

          // Se for admin e não tiver cliente selecionado, pega o primeiro da lista
          if (isUserAdmin && clients.length > 0 && !selectedClient) {
            setSelectedClient(clients[0].name);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
    });
    return () => unsubscribe();
  }, [selectedClient]);

  useEffect(() => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    loadBlogPosts();
    loadBacklinks();
    loadKeywordsUniverse();
  }, [selectedClient]);

  const loadBlogPosts = async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    const isAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'blog_posts';
    
    if (isAdmin) {
      if (selectedClient) {
        q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(100));
      } else {
        q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
      }
    } else {
      q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(100));
    }

    setLoadingPosts(true);
    const snapshot = await getDocs(q);
    const posts: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      if (data.clientName && data.clientName !== 'Agência') {
        posts.push({ id: doc.id, ...data });
      }
    });
    setBlogPosts(posts);
    setLoadingPosts(false);
  };

  const loadBacklinks = async () => {
    setLoadingBacklinks(true);
    const path = 'backlinks';
    try {
      const userEmail = auth.currentUser?.email;
      const isAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
      let q;
      
      if (isAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(100));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
        }
      } else {
        q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(100));
      }

      const querySnapshot = await getDocs(q);
      const links: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        if (data.clientName && data.clientName !== 'Agência') {
          links.push({ id: doc.id, ...data });
        }
      });
      setBacklinks(links);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    setLoadingBacklinks(false);
  };

  const loadKeywordsUniverse = async () => {
    const path = 'keyword_universe';
    try {
      const userEmail = auth.currentUser?.email;
      const isAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
      let q;
      if (isAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(500));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(500));
        }
      } else {
        q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(500));
      }
      const querySnapshot = await getDocs(q);
      const kws: any[] = [];
      querySnapshot.forEach((doc) => {
        kws.push({ id: doc.id, ...(doc.data() as any) });
      });
      setKeywordsUniverse(kws);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const clientNames = Array.from(new Set([
    ...clientsData.map(c => c.name),
    ...blogPosts.map(p => p.clientName), 
    ...backlinks.map(b => b.clientName),
    ...keywordsUniverse.map(k => k.clientName)
  ].filter(Boolean))).sort();

  const filteredBlogPosts = selectedClient ? blogPosts.filter(p => p.clientName === selectedClient) : blogPosts;
  const filteredBacklinks = selectedClient ? backlinks.filter(b => b.clientName === selectedClient) : backlinks;
  const filteredKeywords = selectedClient ? keywordsUniverse.filter(k => k.clientName === selectedClient) : keywordsUniverse;

  const currentClientStatus = selectedClient 
    ? clientsData.find((c: any) => c.name === selectedClient) 
    : clientsData.find((c: any) => c.clientEmail === auth.currentUser?.email) || (clientsData.length > 0 ? clientsData[0] : null);
  
  const effectiveClientName = currentClientStatus?.name || null;

  let targetPosts = 0;
  let targetBacklinks = 0;
  let targetDevHours = 0;
  let targetInitialDevHours = 0;
  let isExpired = false;

  if (currentClientStatus) {
    const now = new Date();
    const billingDay = Number(currentClientStatus.billingDay || 10);
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    isExpired = Number(now.getDate()) >= billingDay && currentClientStatus.lastPaymentMonth !== currentMonthYear;

    targetPosts = Number(currentClientStatus.monthlyPosts || 0);
    targetBacklinks = Number(currentClientStatus.monthlyBacklinks || 0);
    targetDevHours = Number(currentClientStatus.monthlyDevHours || 0);
    targetInitialDevHours = Number(currentClientStatus.initialDevHours || 0);

    if (currentClientStatus.extraMonth === (filterMonth || currentMonthYear)) {
      targetPosts += Number(currentClientStatus.extraPosts || 0);
      targetBacklinks += Number(currentClientStatus.extraBacklinks || 0);
      targetDevHours += Number(currentClientStatus.extraDevHours || 0);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500/30 selection:text-white">
      <Helmet>
        <title>Portal do Cliente | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-100/50 to-transparent pointer-events-none z-0"></div>

      {/* Modern Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center group gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-slate-900 block leading-tight">ACELERA<span className="text-brand-600">SEO</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Client Dashboard</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                >
                  <option value="">Selecionar Cliente</option>
                  {clientNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => navigate('/painel')} 
                  className="flex items-center bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 hidden sm:flex gap-2 px-4 py-2"
                >
                  <TrendingUp size={14} /> Painel Agência
                </button>
              </div>
            )}
            <div className="w-px h-6 bg-slate-200 hidden md:block mx-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-2xl transition-all gap-2 px-4 py-2"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1.5 w-10 bg-brand-600 rounded-full"></div>
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.4em]">Performance Hub</p>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 font-display tracking-tight leading-[0.9] mb-4 text-center md:text-center">
              Olá, <span className="text-brand-600">{currentClientStatus?.name?.split(' ')[0] || auth.currentUser?.email?.split('@')[0] || 'Cliente'}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed text-justify md:text-left">
              Bem-vindo ao seu centro de inteligência SEO. Acompanhe resultados e aprove novas estratégias em tempo real.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center bg-white/50 p-1.5 rounded-[2.5rem] border border-slate-200 shadow-sm backdrop-blur-sm gap-3">
            <div className="flex items-center bg-white rounded-3xl border border-slate-100 shadow-sm gap-4 px-6 py-3">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none mb-1">Projeto Ativo:</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-slate-900 tracking-tight">{currentClientStatus?.name || 'Carregando...'}</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/contato')}
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 gap-2 px-6 py-4"
            >
              Suporte Técnico
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <HorizontalScroll className="mb-10">
          <div 
            className="flex bg-slate-200/30 rounded-2xl border border-slate-200 gap-1 p-1 w-fit"
            role="tablist"
            aria-label="Seções do Portal"
          >
            {['Visão Geral', 'Aprovação de Conteúdos', 'Conteúdos Publicados', 'Backlinks Publicados', 'Estratégia de Palavras'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                id={`tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                className={`relative px-6 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-xl ${activeTab === tab ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </HorizontalScroll>

        <div className="tab-content">
          <div 
            id="panel-visão-geral"
            role="tabpanel"
            aria-labelledby="tab-visão-geral"
            hidden={activeTab !== 'Visão Geral'}
          >
            {activeTab === 'Visão Geral' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6"
              >
                <div className="glass-card p-6 sm:p-8">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Meu Plano e Entregáveis</h2>
                   <p className="text-sm font-medium text-slate-500">Acompanhe seu ciclo, histórico de entregas e saldo de horas.</p>
                 </div>
               </div>

               <div className="grid lg:grid-cols-3 gap-6">
                 {/* Ciclo e Resumo */}
                 <div className="bg-slate-50/50 rounded-3xl border border-slate-100 col-span-2 p-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6 gap-2 text-center md:text-left">
                     <Calendar size={20} className="text-brand-600" />
                     Ciclo Atual
                   </h3>
                   
                   <div className="grid sm:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white rounded-2xl border border-slate-200 p-4">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Início do Ciclo</p>
                       <p className="text-xl font-bold text-slate-900">Dia 10</p>
                     </div>
                     <div className="bg-white rounded-2xl border border-slate-200 p-4">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fim do Ciclo</p>
                       <p className="text-xl font-bold text-slate-900">Dia 09</p>
                     </div>
                     <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
                       <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Status</p>
                       <p className="text-xl font-bold text-indigo-700">Em Andamento</p>
                     </div>
                   </div>

                   <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4 gap-2 text-center md:text-left">
                     <CheckCircle2 size={20} className="text-emerald-500" />
                     Entregáveis do Mês
                   </h3>
                   
                   <div className="grid sm:grid-cols-2 gap-4">
                      {/* Artigos Progress */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Artigos SEO (Blog)</p>
                            <p className="text-xs text-slate-500 mt-1">Já entregamos {filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length} de {targetPosts}</p>
                          </div>
                          <div className="text-lg font-bold text-brand-600">
                            {targetPosts > 0 ? Math.round((filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length / targetPosts) * 100) : 0}%
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div className="bg-brand-500 h-3 rounded-full transition-all duration-500" style={{ width: `${targetPosts > 0 ? Math.min(100, (filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length / targetPosts) * 100) : 0}%` }}></div>
                        </div>
                      </div>

                      {/* Backlinks Progress */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Link Building (Backlinks)</p>
                            <p className="text-xs text-slate-500 mt-1">Já entregamos {filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length} de {targetBacklinks}</p>
                          </div>
                          <div className="text-lg font-bold text-emerald-600">
                            {targetBacklinks > 0 ? Math.round((filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length / targetBacklinks) * 100) : 0}%
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${targetBacklinks > 0 ? Math.min(100, (filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length / targetBacklinks) * 100) : 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Horas de Desenvolvimento */}
                 <div className="bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl p-6">
                   <div className="absolute -top-4 -right-4 opacity-10 rotate-12 p-8">
                     <Code size={140} />
                   </div>
                   <h3 className="text-lg font-bold flex items-center relative z-10 font-display mb-6 gap-2 text-center md:text-left">
                     <div className="p-1.5 bg-brand-500/20 rounded-lg">
                       <Code size={18} className="text-brand-400" />
                     </div>
                     Banco de Horas DEV
                   </h3>
                   <div className="space-y-6 relative z-10 text-justify md:text-left">
                     <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horas de Setup (Fixo)</p>
                       <p className="text-3xl font-display font-bold text-white">{targetInitialDevHours}h</p>
                       <p className="text-[11px] text-slate-400 italic mt-2">Ajustes técnicos e instalações base</p>
                     </div>
                     <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo Mensal (Ciclo)</p>
                       <div className="flex items-baseline gap-1">
                         <p className="text-3xl font-display font-bold text-brand-400">{targetDevHours}h</p>
                         <span className="text-xs text-slate-500 italic">Disponíveis</span>
                       </div>
                       <p className="text-[11px] text-slate-400 italic mt-2">Renovação: Dia {currentClientStatus?.billingDay || 10}</p>
                     </div>
                     <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-brand-500 hover:bg-brand-600 transition rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 text-slate-900 py-4 mt-2"
                     >
                       Solicitar Implementação
                     </motion.button>
                   </div>
                 </div>
               </div>
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-aprovação-de-conteúdos"
            role="tabpanel"
            aria-labelledby="tab-aprovação-de-conteúdos"
            hidden={activeTab !== 'Aprovação de Conteúdos'}
          >
            {activeTab === 'Aprovação de Conteúdos' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Aprovação de Conteúdos</h2>
                   <p className="text-sm font-medium text-slate-500">Avalie os artigos antes da publicação final no seu site.</p>
                 </div>
                 
                 {!reviewingPost && (
                   <div className="flex items-center gap-2">
                     <label className="text-sm font-bold text-slate-600">Mês Ref.</label>
                     <input 
                       type="month" 
                       value={filterMonth}
                       onChange={(e) => setFilterMonth(e.target.value)}
                       className="border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none px-4 py-2"
                     />
                     {filterMonth && (
                       <button onClick={() => setFilterMonth('')} className="text-xs font-bold text-slate-400 hover:text-slate-700">Limpar</button>
                     )}
                   </div>
                 )}
               </div>

               {reviewingPost ? (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-justify md:text-left">
                    <button onClick={() => setReviewingPost(null)} className="text-sm font-bold text-slate-500 flex items-center hover:text-slate-800 transition gap-1">
                      <ChevronDown className="rotate-90" size={16}/> Voltar para lista
                    </button>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl relative p-6 sm:p-8">
                       <h3 className="text-xl font-bold text-slate-800 font-display mb-6 text-center">Informações e Metadados do Artigo</h3>
                       <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                         <div className="bg-white rounded-xl border border-slate-100 p-4"><strong className="text-slate-900 block mb-1">Palavra-chave Foco:</strong> <span className="text-slate-600">{reviewingPost.focusKeywords || '-'}</span></div>
                         <div className="bg-white rounded-xl border border-slate-100 p-4"><strong className="text-slate-900 block mb-1">Âncora:</strong> <span className="text-slate-600">{reviewingPost.anchor || '-'}</span></div>
                         <div className="bg-white rounded-xl border border-slate-100 sm:col-span-2 p-4"><strong className="text-slate-900 block mb-1">Meta-descrição:</strong> <span className="text-slate-600">{reviewingPost.description || '-'}</span></div>
                         <div className="bg-white rounded-xl border border-slate-100 p-4"><strong className="text-slate-900 block mb-1">URL Amigável (Slug):</strong> <span className="text-slate-600">{reviewingPost.slug || '-'}</span></div>
                         <div className="bg-white rounded-xl border border-slate-100 p-4"><strong className="text-slate-900 block mb-1">Título SEO:</strong> <span className="text-slate-600">{reviewingPost.seoTitle || reviewingPost.title || '-'}</span></div>
                         <div className="bg-white rounded-xl border border-slate-100 flex items-center justify-between p-4">
                           <strong className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Extensão</strong> 
                           <div className="flex items-center gap-4">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">Previsto <span className="text-slate-600 normal-case font-bold ml-1">{reviewingPost.targetWords || '-'}</span></span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">Total <span className="text-brand-600 normal-case font-bold ml-1">
                                {reviewingPost.content 
                                  ? `${reviewingPost.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').trim().split(/\s+/).filter(Boolean).length} palavras` 
                                  : reviewingPost.wordCount || '0 palavras'}
                              </span></span>
                           </div>
                         </div>
                         <div className="bg-white rounded-xl border border-slate-100 sm:col-span-2 p-4"><strong className="text-slate-900 block mb-1">Diretriz de Imagens:</strong> <span className="text-slate-600">{reviewingPost.imagesInfo || '-'}</span></div>
                       </div>
                    </div>

                    <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden overflow-x-hidden break-words p-6 sm:p-12">
                      <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 border-b border-slate-100 break-words mb-8 pb-8 text-center md:text-center">{reviewingPost.title}</h1>
                      <div className="markdown-body max-w-full">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{reviewingPost.content}</ReactMarkdown>
                      </div>
                    </div>

                    <PostChat postId={reviewingPost.id} currentUserRole="client" currentUserName={(effectiveClientName || auth.currentUser?.email) as string} />

                    <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6">
                      <label className="block text-sm font-bold text-slate-800 mb-2">Comentários ou Ressalvas (Opcional para aprovação, obrigatório para reprovação)</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Ex: Gostei do artigo, mas acho que faltou mencionar o serviço X da nossa empresa..."
                        className="w-full h-32 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-brand-500 outline-none px-4 py-3"
                      />
                    </div>

                     <div className="flex flex-col sm:flex-row justify-end border-t border-slate-100 gap-4 pt-6">
                       <button onClick={async () => {
                          if (!reviewComment.trim()) {
                            alert('Por favor, informe o motivo da reprovação.');
                            return;
                          }
                          const confirmReprove = window.confirm('Deseja reprovar este conteúdo? A agência será notificada.');
                          if(confirmReprove && reviewingPost?.id) {
                            await updateDoc(doc(db, 'blog_posts', reviewingPost.id), { status: 'Reprovado', clientComment: reviewComment, updatedAt: serverTimestamp() });
                            setReviewingPost(null);
                            setReviewComment('');
                            loadBlogPosts();
                          }
                       }} className="bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition shadow-sm border border-rose-100 text-center px-8 py-4">
                         Reprovar Conteúdo
                       </button>
                       <button onClick={async () => {
                          if (!reviewComment.trim()) {
                            alert('Por favor, informe quais observações ou ressalvas a agência deve seguir.');
                            return;
                          }
                          const confirmApprove = window.confirm('Confirmar aprovação com ressalvas? A agência fará o ajuste antes de publicar.');
                          if(confirmApprove && reviewingPost?.id) {
                            await updateDoc(doc(db, 'blog_posts', reviewingPost.id), { status: 'Aprovado com Ressalvas', clientComment: reviewComment, updatedAt: serverTimestamp() });
                            setReviewingPost(null);
                            setReviewComment('');
                            loadBlogPosts();
                          }
                       }} className="bg-orange-50 text-orange-600 font-bold rounded-2xl hover:bg-orange-100 transition shadow-sm border border-orange-100 text-center px-8 py-4">
                         Aprovar com Ressalvas
                       </button>
                       <button onClick={async () => {
                          const confirmApprove = window.confirm('Confirmar a aprovação deste conteúdo? A agência prosseguirá com a publicação.');
                          if(confirmApprove && reviewingPost?.id) {
                            await updateDoc(doc(db, 'blog_posts', reviewingPost.id), { status: 'Aprovado', clientComment: reviewComment, updatedAt: serverTimestamp() });
                            setReviewingPost(null);
                            setReviewComment('');
                            loadBlogPosts();
                          }
                       }} className="bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition shadow-lg shadow-brand-500/20 text-center px-8 py-4">
                         Aprovar Conteúdo
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {loadingPosts ? (
                       <div className="col-span-full text-center text-slate-400 font-medium italic lowercase animate-pulse py-24">Consultando fluxos de aprovação...</div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).length === 0 ? (
                      <div className="col-span-full text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 py-16">
                        <CheckCircle2 size={56} className="mx-auto text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800 font-display mb-3 text-center">Tudo revisado!</h3>
                        <p className="text-slate-500 text-lg">Nenhum conteúdo aguardando sua aprovação neste momento.</p>
                      </div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).map((post, idx) => (
                     <div key={`approval-post-${post.id || idx}`} className="border border-brand-200 bg-gradient-to-b from-brand-50/50 to-white rounded-3xl flex flex-col hover:shadow-lg transition-all p-6">
                       <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] uppercase tracking-widest font-bold rounded-full bg-amber-100 text-amber-700 px-3 py-1">Revisão Pendente</span>
                         <span className="text-xs font-medium text-slate-400">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('pt-BR') : ''}</span>
                       </div>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight mb-3">{post.title}</h4>
                       <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-8 text-justify md:text-left">{post.description}</p>
                       
                       <button onClick={() => setReviewingPost(post)} className="mt-auto w-full py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-brand-600 transition shadow-md">
                         Ler e Avaliar Artigo
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-conteúdos-publicados"
            role="tabpanel"
            aria-labelledby="tab-conteúdos-publicados"
            hidden={activeTab !== 'Conteúdos Publicados'}
          >
            {activeTab === 'Conteúdos Publicados' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-3xl min-h-[500px] overflow-hidden relative p-6 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Acervo de <span className="text-brand-500">Publicações</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Artigos que já estão tracionando no seu domínio.</p>
                 </div>
               </div>

               <HorizontalScroll className="rounded-[2rem] border border-slate-200 animate-in fade-in duration-700 relative z-10">
                 <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       <th scope="col" className="p-6">Estratégia Meta</th>
                       <th scope="col" className="text-center p-6">Data Pub.</th>
                       <th className="text-center p-6">Status</th>
                       <th className="text-right p-6">Direcionamento</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredBlogPosts.filter(p => p.status === 'Publicado').length === 0 ? (
                       <tr><td colSpan={4} className="text-center text-slate-400 font-medium italic lowercase p-20">Nenhum rastro de publicação encontrado.</td></tr>
                     ) : filteredBlogPosts.filter(p => p.status === 'Publicado').map((post, idx) => (
                       <tr key={`pub-post-${post.id || idx}`} className="group hover:bg-brand-50/20 transition-all duration-300">
                         <td className="p-6">
                           <div className="flex flex-col">
                             <span className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">{post.title}</span>
                             <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest font-mono italic mt-1">KW: {post.focusKeywords || '-'}</span>
                           </div>
                         </td>
                         <td className="text-center p-6">
                            <span className="text-xs font-black text-slate-500 font-mono italic">{post.publishedAt ? new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</span>
                         </td>
                         <td className="text-center p-6">
                            <div className="flex justify-center">
                              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm px-3 py-1">
                                <CheckCircle size={10} strokeWidth={3} /> Ativo & Live
                              </span>
                            </div>
                         </td>
                         <td className="text-right p-6">
                            <a 
                              href={post.publishedUrl || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-all group/link gap-2"
                            >
                              Ver Artigo no Site <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-backlinks-publicados"
            role="tabpanel"
            aria-labelledby="tab-backlinks-publicados"
            hidden={activeTab !== 'Backlinks Publicados'}
          >
            {activeTab === 'Backlinks Publicados' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-3xl min-h-[500px] overflow-hidden relative p-6 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Relatório de <span className="text-brand-500">Authority Building</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Backlinks e citações de PR que fortalecem seu domínio.</p>
                 </div>
               </div>

               <HorizontalScroll className="rounded-[2rem] border border-slate-200 relative z-10">
                 <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       <th scope="col" className="p-6">Veículo / Âncora</th>
                       <th scope="col" className="text-center p-6">Data Entrega</th>
                       <th className="text-center p-6">Status</th>
                       <th className="text-right p-6">Direcionamento</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredBacklinks.filter(b => b.status === 'Publicado').length === 0 ? (
                       <tr><td colSpan={4} className="text-center text-slate-400 font-medium italic lowercase p-20">Nenhum backlink ativo registrado.</td></tr>
                     ) : filteredBacklinks.filter(b => b.status === 'Publicado').map((link, idx) => (
                       <tr key={`pub-backlink-${link.id || idx}`} className="group hover:bg-emerald-50/20 transition-all duration-300">
                         <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{link.title}</span>
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest font-mono italic mt-1">Texto Âncora: {link.focusKeywords || '-'}</span>
                            </div>
                         </td>
                         <td className="text-center p-6">
                            <span className="text-xs font-black text-slate-500 font-mono italic">{link.publishedAt ? new Date(link.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</span>
                         </td>
                         <td className="text-center p-6">
                            <div className="flex justify-center">
                              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm px-3 py-1">
                                <CheckCircle size={10} strokeWidth={3} /> Link Ativo
                              </span>
                            </div>
                         </td>
                         <td className="text-right p-6">
                            <a 
                              href={link.publishedUrl || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all group/link gap-2"
                            >
                              Ver Backlink <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-estratégia-de-palavras"
            role="tabpanel"
            aria-labelledby="tab-estratégia-de-palavras"
            hidden={activeTab !== 'Estratégia de Palavras'}
          >
            {activeTab === 'Estratégia de Palavras' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Estratégia de Palavras</h2>
                   <p className="text-sm font-medium text-slate-500">Visão completa dos planejamentos de pautas e estratégias de SEO.</p>
                 </div>
               </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Palavras-chave Planejadas</h3>
               <HorizontalScroll className="rounded-2xl border border-slate-200 mb-10">
                 <table className="w-[1000px] lg:w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                       <th className="p-4">Cliente</th>
                       <th scope="col" className="p-4">Mês Planejado</th>
                       <th className="p-4">Palavra-chave</th>
                       <th className="p-4">Volume</th>
                       <th className="p-4">KD</th>
                       <th className="text-center p-4">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredKeywords.length === 0 ? (
                       <tr><td colSpan={6} className="text-center text-slate-500 font-medium p-8">Nenhuma palavra planejada.</td></tr>
                     ) : filteredKeywords.sort((a,b) => (b.targetMonth || '').localeCompare(a.targetMonth || '')).map((kw, idx) => (
                       <tr key={`kw-universe-${kw.id || idx}`} className="hover:bg-slate-50 transition border-l-4 border-slate-200">
                         <td className="text-xs font-bold text-slate-900 border-r border-slate-100 p-4">{kw.clientName || '-'}</td>
                         <td className="text-sm font-bold text-slate-500 p-4">{kw.targetMonth || '-'}</td>
                         <td className="text-sm font-bold text-slate-800 p-4"><div className="w-48 truncate">{kw.keyword || '-'}</div></td>
                         <td className="text-sm text-slate-600 p-4">{kw.searchVolume || '-'}</td>
                         <td className="text-sm text-slate-600 p-4">{kw.difficulty || '-'}</td>
                         <td className="text-center p-4">
                           <span className="inline-block text-[10px] uppercase font-bold py-0.5 rounded bg-slate-100 text-slate-700 px-2">{kw.status || 'Disponível'}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>

               <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Backlinks Programados</h3>
               <HorizontalScroll className="rounded-2xl border border-slate-200 mb-10">
                 <table className="w-[1000px] lg:w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-rose-50 border-b border-rose-100 text-xs font-bold text-rose-800 uppercase tracking-wider">
                       <th scope="col" className="p-4">Cliente</th>
                       <th scope="col" className="p-4">Palavra Âncora</th>
                       <th scope="col" className="p-4">URL de Destino</th>
                       <th scope="col" className="p-4">Palavra-chave Foco</th>
                       <th scope="col" className="w-64 p-4">Tema</th>
                       <th scope="col" className="w-72 p-4">Direcionamento</th>
                       <th scope="col" className="text-center p-4">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredBacklinks.length === 0 ? (
                       <tr><td colSpan={7} className="text-center text-slate-500 font-medium p-8">Nenhum backlink planejado.</td></tr>
                     ) : filteredBacklinks.map((link, idx) => (
                       <tr key={`all-backlink-${link.id || idx}`} className="hover:bg-slate-50 transition border-l-4" style={{borderLeftColor: link.status === 'Publicado' ? '#10b981' : link.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}}>
                         <td className="text-xs font-bold text-rose-900 border-r border-slate-100 p-4">{link.clientName || '-'}</td>
                         <td className="text-sm font-bold text-slate-800 p-4"><div className="w-32 truncate">{link.anchor || '-'}</div></td>
                         <td className="text-sm text-blue-600 hover:underline p-4"><a href={link.targetUrl || '#'} target="_blank" rel="noopener noreferrer"><div className="w-32 truncate">{link.targetUrl || '-'}</div></a></td>
                         <td className="text-sm text-slate-600 p-4"><div className="w-32 truncate">{link.focusKeywords || '-'}</div></td>
                         <td className="text-sm text-slate-700 leading-relaxed p-4"><div className="line-clamp-3">{link.theme || '-'}</div></td>
                         <td className="text-xs text-slate-500 leading-relaxed p-4"><div className="line-clamp-4">{link.directioning || '-'}</div></td>
                         <td className="text-center p-4">
                           <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            link.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                            link.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                            link.status === 'Agendado' ? 'bg-indigo-100 text-indigo-700' :
                            link.status === 'Aguardando Aprovação' ? 'bg-amber-100 text-amber-700' :
                            link.status === 'Reprovado' ? 'bg-rose-100 text-rose-700' :
                            'bg-slate-200 text-slate-600'
                           }`}>{link.status || 'Rascunho'}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>

               <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Artigos de Blog</h3>
               <HorizontalScroll className="rounded-2xl border border-slate-200">
                 <table className="w-[1000px] lg:w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-indigo-50 border-b border-indigo-100 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                       <th scope="col" className="p-4">Cliente</th>
                       <th scope="col" className="p-4">Palavra-chave</th>
                       <th scope="col" className="p-4">Linkagem Interna</th>
                       <th scope="col" className="w-60 p-4">Tema</th>
                       <th scope="col" className="p-4">Secundárias</th>
                       <th scope="col" className="w-60 p-4">Direcionamento</th>
                       <th scope="col" className="text-center p-4">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredBlogPosts.length === 0 ? (
                       <tr><td colSpan={7} className="text-center text-slate-500 font-medium p-8">Nenhum post planejado.</td></tr>
                     ) : filteredBlogPosts.map((post, idx) => (
                       <tr key={`all-post-${post.id || idx}`} className="hover:bg-slate-50 transition border-l-4" style={{borderLeftColor: post.status === 'Publicado' ? '#10b981' : post.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}}>
                         <td className="text-xs font-bold text-indigo-900 border-r border-slate-100 p-4">{post.clientName || '-'}</td>
                         <td className="text-sm font-bold text-slate-800 p-4"><div className="w-32 truncate">{post.focusKeywords || '-'}</div></td>
                         <td className="text-sm text-slate-600 p-4"><div className="w-32 truncate">{post.internalLinking || '-'}</div></td>
                         <td className="text-sm text-slate-700 leading-relaxed p-4"><div className="line-clamp-3">{post.theme || '-'}</div></td>
                         <td className="text-xs text-slate-500 italic p-4"><div className="w-32 truncate">{post.secondaryKeywords || '-'}</div></td>
                         <td className="text-xs text-slate-500 leading-relaxed p-4"><div className="line-clamp-4">{post.directioning || '-'}</div></td>
                         <td className="text-center p-4">
                           <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            post.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                            post.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                            post.status === 'Agendado' ? 'bg-indigo-100 text-indigo-700' :
                            post.status === 'Aguardando Aprovação' ? 'bg-amber-100 text-amber-700' :
                            post.status === 'Reprovado' ? 'bg-rose-100 text-rose-700' :
                            'bg-slate-200 text-slate-600'
                           }`}>{post.status || 'Rascunho'}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}

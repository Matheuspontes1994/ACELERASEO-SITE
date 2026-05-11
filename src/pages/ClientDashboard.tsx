import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Skeleton from '../components/ui/Skeleton';
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
  TrendingUp,
  RefreshCcw,
  MessageSquareText,
  Menu,
  X,
  Globe2,
  Link as LinkIcon,
  Clock
} from 'lucide-react';
import { collection, getDocs, updateDoc, addDoc, doc, serverTimestamp, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  while (days > 0) {
    result.setDate(result.getDate() + 1);
    // 0 = Sunday, 6 = Saturday
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      days--;
    }
  }
  return result;
};

const getRemainingBusinessDays = (startDate: Date, deadlineDays: number): number | string => {
  const deadline = addBusinessDays(startDate, deadlineDays);
  const now = new Date();
  
  if (now > deadline) return 0;
  
  let remaining = 0;
  let current = new Date(now);
  while (current < deadline) {
    current.setDate(current.getDate() + 1);
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      remaining++;
    }
  }
  return remaining;
};
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useNavigate, Link } from 'react-router-dom';
import PostChat from '../components/PostChat';
import PostHistory from '../components/PostHistory';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [keywordsUniverse, setKeywordsUniverse] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [reviewingPost, setReviewingPost] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const [clientsData, setClientsData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const userId = user.uid;
        const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
        setIsAdmin(isUserAdmin);
        
        const path = 'clients';
        try {
          let clientsQuery;
          if (isUserAdmin) {
            clientsQuery = query(collection(db, path));
          } else {
            // Try to find by UID first, then email as fallback
            const uidQuery = query(collection(db, path), where('uid', '==', userId));
            const uidSnap = await getDocs(uidQuery);
            
            if (!uidSnap.empty) {
              clientsQuery = uidQuery;
            } else {
              clientsQuery = query(collection(db, path), where('clientEmail', '==', userEmail));
            }
          }
            
          const clientsSnap = await getDocs(clientsQuery);
          const clients = clientsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
          setClientsData(clients);

          if (isUserAdmin && clients.length > 0 && !selectedClient) {
            setSelectedClient(clients[0].name);
          }

          // Pre-selecionar o ciclo atual do cliente
          const activeClient = isUserAdmin ? (selectedClient ? clients.find(c => c.name === selectedClient) : clients[0]) : clients[0];
          if (activeClient?.currentCycleDate && !filterMonth) {
            setFilterMonth(activeClient.currentCycleDate);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setIsAdmin(false);
        setClientsData([]);
      }
    });
    return () => unsubscribe();
  }, []); // Only register auth listener once

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Pre-selecionar o ciclo atual do cliente selecionado
    const activeClient = selectedClient 
      ? clientsData.find(c => c.name === selectedClient) 
      : clientsData.find(c => c.uid === auth.currentUser?.uid || c.clientEmail === auth.currentUser?.email);
    
    if (activeClient?.currentCycleDate && !filterMonth) {
      setFilterMonth(activeClient.currentCycleDate);
    }

    loadBlogPosts();
    loadBacklinks();
    loadKeywordsUniverse();
  }, [selectedClient, clientsData]);

  const loadBlogPosts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'blog_posts';
    
    try {
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(100));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
        }
      } else {
        // For clients, we try to match by email OR uid (if we have a client record with that uid)
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          // Many older posts might only have clientEmail or clientName
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(100));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(100));
        }
      }

      setLoadingPosts(true);
      const snapshot = await getDocs(q);
      const posts: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        let currentStatus = data.status;
        
        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clientsData.find(c => c.name === data.clientName);
          const deadlineDays = clientInfo?.approvalDeadlineDays ? Number(clientInfo.approvalDeadlineDays) : 5;
          const statusDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
          const remaining = getRemainingBusinessDays(statusDate, deadlineDays);
          
          if (remaining === 0) {
            updateDoc(docSnap.ref, { 
              status: 'Aprovado', 
              clientComment: 'Aprovado automaticamente pelo prazo vencido.', 
              updatedAt: serverTimestamp() 
            });

            // Registrar histórico de revisão automática para blog posts
            addDoc(collection(db, 'blog_posts', docSnap.id, 'revisions'), {
              status: 'Aprovado',
              author: 'Sistema (Prazo Expirado)',
              comment: 'Conteúdo aprovado automaticamente devido ao vencimento do prazo de revisão de 5 dias úteis.',
              timestamp: serverTimestamp(),
              type: 'auto_approval',
              message: 'Aprovação Automática por Prazo'
            });

            currentStatus = 'Aprovado';
            data.clientComment = 'Aprovado automaticamente pelo prazo vencido.';
          } else {
            data.remainingApprovalDays = remaining;
          }
        }

        if (data.clientName && data.clientName !== 'Agência') {
          posts.push({ id: docSnap.id, ...data, status: currentStatus });
        }
      });
      setBlogPosts(posts);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadBacklinks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'backlinks';

    try {
      setLoadingBacklinks(true);
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(100));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
        }
      } else {
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(100));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(100));
        }
      }

      const querySnapshot = await getDocs(q);
      const links: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        let currentStatus = data.status;

        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clientsData.find(c => c.name === data.clientName);
          const deadlineDays = clientInfo?.approvalDeadlineDays ? Number(clientInfo.approvalDeadlineDays) : 5;
          const statusDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
          const remaining = getRemainingBusinessDays(statusDate, deadlineDays);
          
          if (remaining === 0) {
            updateDoc(docSnap.ref, { 
              status: 'Aprovado', 
              clientComment: 'Aprovado automaticamente pelo prazo vencido.', 
              updatedAt: serverTimestamp() 
            });

            // Registrar histórico de revisão automática para backlinks
            addDoc(collection(db, 'backlinks', docSnap.id, 'revisions'), {
              status: 'Aprovado',
              author: 'Sistema (Prazo Expirado)',
              comment: 'Backlink aprovado automaticamente devido ao vencimento do prazo de revisão de 5 dias úteis.',
              timestamp: serverTimestamp(),
              type: 'auto_approval',
              message: 'Aprovação Automática por Prazo'
            });

            currentStatus = 'Aprovado';
            data.clientComment = 'Aprovado automaticamente pelo prazo vencido.';
          } else {
            data.remainingApprovalDays = remaining;
          }
        }

        if (data.clientName && data.clientName !== 'Agência') {
          links.push({ id: docSnap.id, ...data, status: currentStatus });
        }
      });
      setBacklinks(links);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setLoadingBacklinks(false);
    }
  };

  const loadKeywordsUniverse = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'keyword_universe';

    try {
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(500));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(500));
        }
      } else {
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(500));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(500));
        }
      }
      const querySnapshot = await getDocs(q);
      const kws: any[] = [];
      querySnapshot.forEach((docSnap) => {
        kws.push({ id: docSnap.id, ...(docSnap.data() as any) });
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

  const filteredBlogPosts = (selectedClient ? blogPosts.filter(p => p.clientName === selectedClient) : blogPosts)
    .filter(p => {
      const isDraft = p.status === 'Rascunho';
      const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.focusKeywords?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
      const matchesMonth = !filterMonth || p.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesStatus && matchesMonth;
    });

  const filteredBacklinks = (selectedClient ? backlinks.filter(b => b.clientName === selectedClient) : backlinks)
    .filter(b => {
      const isDraft = b.status === 'Rascunho';
      const matchesSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.focusKeywords?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = !filterMonth || b.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesMonth;
    });

  const filteredKeywords = (selectedClient ? keywordsUniverse.filter(k => k.clientName === selectedClient) : keywordsUniverse)
    .filter(k => {
      const isDraft = k.status === 'Rascunho';
      const matchesSearch = k.keyword?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = !filterMonth || k.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesMonth;
    });

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
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500/30 selection:text-white flex flex-col md:flex-row">
      <Helmet>
        <title>Portal do Cliente | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-100/50 to-transparent pointer-events-none z-0"></div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] md:hidden"
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <TrendingUp size={18} />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
            Acelera<span className="text-brand-600">SEO</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2.5 text-slate-600 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl transition-all ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar Layout */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-[85vw] sm:w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-500 ease-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header - Static Section */}
        <div className="p-6 md:p-8 shrink-0 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0 ${currentClientStatus?.logoUrl ? "bg-white" : "bg-brand-600"}`}>
                {currentClientStatus?.logoUrl ? (
                  <img 
                    src={currentClientStatus.logoUrl} 
                    alt={currentClientStatus.name} 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <TrendingUp className="text-white" size={20} />
                )}
              </div>
              <div className="min-w-0 pr-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Performance Hub</p>
                <h2 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                  {currentClientStatus?.name || 'Acelera SEO'}
                </h2>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Middle - Scrollable Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 px-3 md:px-4">
          <div className="p-3 md:p-4 pt-2 space-y-6">
            <div>
              <p className="px-4 mb-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Ciclo de Operação</p>
              <div className="relative group/cycle">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/cycle:text-brand-600 transition-colors z-10">
                  <Calendar size={14} />
                </div>
                <input 
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl pl-10 pr-4 py-2.5 md:py-3 text-[11px] font-bold text-slate-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all cursor-pointer shadow-sm hover:bg-white"
                />
              </div>
            </div>

            {isAdmin && (
              <div>
                <p className="px-4 mb-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Visualizar Unidade</p>
                <div className="relative group/client">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/client:text-brand-600 transition-colors z-10">
                    <Users size={14} />
                  </div>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl pl-10 pr-10 py-2.5 md:py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm appearance-none cursor-pointer hover:bg-white transition-all"
                  >
                    <option value="">Selecionar Cliente</option>
                    {clientNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover/client:translate-x-0.5">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 mx-4 my-2 md:my-4" />

          {/* Navigation */}
          <nav className="space-y-1.5 pt-2">
            {[
              { id: 'Visão Geral', label: 'Painel Central', icon: Activity },
              { id: 'Aprovação de Conteúdos', label: 'Sala de Aprovação', icon: Clock, badge: filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação').length },
              { id: 'Conteúdos Publicados', label: 'Acervo Articles', icon: FileText },
              { id: 'Backlinks Publicados', label: 'Growth Off-Page', icon: LinkIcon },
              { id: 'Estratégia de Palavras', label: 'Inteligência SEO', icon: Globe2 },
            ].map(item => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600 shadow-sm'}`}>
                      {item.badge}
                    </span>
                  )}
                  {activeTab === item.id && (
                    <motion.div layoutId="clientActiveDot" className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 space-y-3 md:space-y-4 shrink-0">
          {isAdmin && (
            <button 
              onClick={() => navigate('/painel')} 
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl py-3 md:py-4 hover:bg-brand-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
            >
              <TrendingUp size={14} /> Painel Agência
            </button>
          )}
          
          <div className="bg-white border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">
                {auth.currentUser?.email?.split('@')[0] || 'Cliente'}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sessão Ativa</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-[10px] font-black uppercase tracking-[0.25em] border border-transparent hover:border-rose-100 shadow-sm"
          >
            <LogOut size={16} /> Finalizar Sessão
          </button>
        </div>
      </aside>


      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 relative z-10 min-h-screen">
        <div className="p-4 sm:p-8 md:p-10 lg:p-12 max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1.5 w-10 bg-brand-600 rounded-full"></div>
                <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.4em]">Intelligence Suite</p>
              </div>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 font-display tracking-tight leading-[0.95] mb-4 text-left">
                {activeTab}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed text-left">
                {activeTab === 'Visão Geral' && 'Acompanhe seu ciclo, histórico de entregas e saldo de horas técnico.'}
                {activeTab === 'Aprovação de Conteúdos' && 'Sala de curadoria estratégica. Suas decisões definem o tom da marca.'}
                {activeTab === 'Conteúdos Publicados' && 'Consulte todos os ativos de conteúdo que já estão gerando tráfego.'}
                {activeTab === 'Backlinks Publicados' && 'Monitore a construção de autoridade e links conquistados.'}
                {activeTab === 'Estratégia de Palavras' && 'Mapeamento de oportunidades e termos estratégicos para o seu nicho.'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center bg-white/50 p-1.5 rounded-[2.5rem] border border-slate-200 shadow-sm backdrop-blur-sm gap-3">
              <div className="flex items-center bg-white rounded-3xl border border-slate-100 shadow-sm gap-4 px-6 py-3 min-w-0 flex-1 lg:flex-none">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Activity size={24} />
                </div>
                <div className="min-w-0 pr-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none mb-1">Status Global:</p>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="text-xs font-black text-slate-900 tracking-tight uppercase">
                      Performance Ativa
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/contato')}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 gap-2 px-6 py-4"
              >
                Suporte Ninja
              </button>
            </div>
          </motion.div>

          <div className="tab-content relative">
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
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black font-display text-slate-900 text-left">Meu Plano e Entregáveis</h2>
                      <p className="text-sm font-medium text-slate-500">Acompanhe seu ciclo, histórico de entregas e saldo de horas.</p>
                    </div>
                    {filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação').length > 0 && (
                      <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl border border-rose-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conteúdos Pendentes</span>
                      </div>
                    )}
                  </div>

               <div className="grid lg:grid-cols-3 gap-6">
                 {/* Ciclo e Resumo */}
                 <div className="bg-slate-50/50 rounded-2xl border border-slate-100 col-span-1 lg:col-span-2 p-5 sm:p-6 overflow-hidden">
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center mb-6 gap-2 text-left">
                     <Calendar size={16} className="text-brand-600" />
                     Ciclo Operacional
                   </h3>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                     <div className="bg-white rounded-2xl border border-slate-200 p-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Início</p>
                       <p className="text-lg font-black text-slate-900">Dia {currentClientStatus?.billingDay || 10}</p>
                     </div>
                     <div className="bg-white rounded-2xl border border-slate-200 p-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fechamento</p>
                       <p className="text-lg font-black text-slate-900">Dia {(Number(currentClientStatus?.billingDay || 10) - 1) || 30}</p>
                     </div>
                     <div className="bg-slate-900 rounded-2xl p-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                       <p className="text-lg font-black text-brand-500">Ativo</p>
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

                 {/* Urgent Actions Section */}
                 {blogPosts.filter(p => p.status === 'Aguardando Aprovação').length > 0 && (
                   <div className="mt-8 pt-8 border-t border-slate-200/60">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prioridades de Aprovação</h4>
                     </div>
                     <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
                       {blogPosts
                         .filter(p => p.status === 'Aguardando Aprovação')
                         .sort((a,b) => (a.remainingApprovalDays || 5) - (b.remainingApprovalDays || 5))
                         .slice(0, 2)
                         .map(post => (
                           <div key={`urgent-overview-${post.id}`} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-300 transition-all group shadow-sm text-left">
                             <div className="flex items-center gap-3 overflow-hidden">
                               <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${Number(post.remainingApprovalDays) <= 2 ? 'bg-rose-50 text-rose-500' : 'bg-brand-50 text-brand-600'}`}>
                                 <FileText size={18} />
                               </div>
                           <div className="overflow-hidden">
                                 <p className="text-xs font-black text-slate-900 break-words tracking-tight uppercase leading-tight mb-1" title={post.title}>{post.title}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Expira em {post.remainingApprovalDays}d</p>
                               </div>
                             </div>
                             <button 
                               onClick={() => { setActiveTab('Aprovação de Conteúdos'); setReviewingPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                               className="shrink-0 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all"
                             >
                               Revisar <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                             </button>
                           </div>
                         ))
                       }
                     </div>
                   </div>
                 )}

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
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] p-4 sm:p-6 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Aprovação de Conteúdos</h2>
                   <p className="text-sm font-medium text-slate-500">Avalie os artigos antes da publicação final no seu site.</p>
                 </div>
                 
                 {!reviewingPost && (
                   <div className="flex flex-wrap items-center gap-3">
                     <div className="relative flex-1 min-w-[200px]">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="text"
                         placeholder="Buscar conteúdo..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                       />
                     </div>
                     <div className="flex items-center gap-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Mês Ref.</label>
                       <input 
                         type="month" 
                         value={filterMonth}
                         onChange={(e) => setFilterMonth(e.target.value)}
                         className="border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none px-4 py-2"
                       />
                     </div>
                     {(filterMonth || searchTerm) && (
                       <button onClick={() => { setFilterMonth(''); setSearchTerm(''); }} className="text-xs font-bold text-slate-400 hover:text-slate-700 whitespace-nowrap">Limpar Filtros</button>
                     )}
                   </div>
                 )}
               </div>

               {reviewingPost ? (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-justify md:text-left">
                    <button onClick={() => setReviewingPost(null)} className="text-sm font-bold text-slate-500 flex items-center hover:text-slate-800 transition gap-1">
                      <ChevronDown className="rotate-90" size={16}/> Voltar para lista
                    </button>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] relative p-6 sm:p-10 text-white overflow-hidden shadow-2xl">
                       <h3 className="text-xs font-black text-brand-500 uppercase tracking-[0.3em] mb-8 relative z-10 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                          Escopo Estratégico
                        </h3>
                       <div className="grid sm:grid-cols-2 gap-4 relative z-10 text-left">
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Palavra-chave Foco</span>
                            <p className="text-sm font-bold text-slate-200 tracking-tight">{reviewingPost.focusKeywords || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Âncora de Backup</span>
                            <p className="text-sm font-bold text-slate-200 tracking-tight">{reviewingPost.anchor || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors sm:col-span-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Meta-descrição Estratégica</span>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{reviewingPost.description || '-'}"</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Slug Sugerido</span>
                            <p className="text-sm font-mono text-brand-400">/{reviewingPost.slug || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Word Count Real</span>
                            <div className="flex items-baseline gap-2">
                              <p className="text-lg font-black text-white">
                                {reviewingPost.content 
                                  ? reviewingPost.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').trim().split(/\s+/).filter(Boolean).length 
                                  : reviewingPost.wordCount || '0'}
                              </p>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">palavras</span>
                            </div>
                          </div>
                                                   <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors sm:col-span-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Diretrizes de Imagem</span>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">{reviewingPost.imagesInfo || 'Nenhuma diretriz específica.'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden break-words p-5 sm:p-12">
                      <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 border-b border-slate-100 break-words mb-8 pb-8 text-center">{reviewingPost.title}</h1>
                      <div className="markdown-body max-w-full overflow-hidden">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{reviewingPost.content}</ReactMarkdown>
                      </div>
                    </div>

                    <PostChat postId={reviewingPost.id} currentUserRole="client" currentUserName={(effectiveClientName || auth.currentUser?.email) as string} />
                     <div className="mt-8 mb-8">
                       <PostHistory postId={reviewingPost.id} />
                     </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6">
                      <label className="block text-sm font-bold text-slate-800 mb-2">Comentários ou Ressalvas (Opcional para aprovação, obrigatório para reprovação)</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Ex: Gostei do artigo, mas acho que faltou mencionar o serviço X da nossa empresa..."
                        className="w-full h-32 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-brand-500 outline-none px-4 py-3"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end border-t border-slate-100 gap-4 pt-8">
                        <button onClick={async () => {
                           if (!reviewComment.trim()) {
                             alert('Por favor, descreva quais ajustes você gostaria de ver no conteúdo.');
                             return;
                           }
                           const confirmReprove = window.confirm('Deseja retornar este conteúdo para a produção? Nossa equipe de redação fará os ajustes solicitados.');
                           if(confirmReprove && reviewingPost?.id) {
                             await updateDoc(doc(db, 'blog_posts', reviewingPost.id), { 
                               status: 'Ajustes Necessários', 
                               clientComment: reviewComment, 
                               updatedAt: serverTimestamp() 
                             });
                             
                             // Registrar histórico de revisão
                             await addDoc(collection(db, 'blog_posts', reviewingPost.id, 'revisions'), {
                               status: 'Ajustes Necessários',
                               author: auth.currentUser?.email || 'Cliente',
                               comment: reviewComment,
                               timestamp: serverTimestamp(),
                               type: 'status_change',
                               message: 'Ajustes solicitados pelo cliente.'
                             });

                             setReviewingPost(null);
                             setReviewComment('');
                             loadBlogPosts();
                           }
                        }} className="bg-white text-amber-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-50 transition-all shadow-sm border border-amber-200 text-center px-8 py-5 flex items-center justify-center gap-3 active:scale-95">
                          <RefreshCcw size={16} /> Solicitar Ajustes
                        </button>
                        <button onClick={async () => {
                           const confirmApprove = window.confirm('Tudo certo! Deseja aprovar este conteúdo para publicação?');
                           if(confirmApprove && reviewingPost?.id) {
                             await updateDoc(doc(db, 'blog_posts', reviewingPost.id), { 
                               status: 'Aprovado', 
                               clientComment: reviewComment || '', 
                               updatedAt: serverTimestamp() 
                             });

                             // Registrar histórico de revisão
                             await addDoc(collection(db, 'blog_posts', reviewingPost.id, 'revisions'), {
                               status: 'Aprovado',
                               author: auth.currentUser?.email || 'Cliente',
                               comment: reviewComment || '',
                               timestamp: serverTimestamp(),
                               type: 'status_change',
                               message: 'Conteúdo aprovado pelo cliente.'
                             });

                             setReviewingPost(null);
                             setReviewComment('');
                             loadBlogPosts();
                           }
                        }} className="bg-brand-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition shadow-xl shadow-brand-500/20 text-center px-10 py-5 flex items-center justify-center gap-3 active:scale-95">
                          <CheckCircle size={18} /> Aprovar Agora
                        </button>
                     </div>
                 </div>
               ) : (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {loadingPosts ? (
                      <div className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={`skel-approval-${i}`} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
                            <Skeleton variant="rectangular" className="h-6 w-32" />
                            <Skeleton variant="rectangular" className="h-8 w-full" />
                            <Skeleton variant="rectangular" className="h-20 w-full" />
                            <Skeleton variant="rectangular" className="h-12 w-full" />
                          </div>
                        ))}
                      </div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).length === 0 ? (
                      <div className="col-span-full text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 py-16">
                        <CheckCircle2 size={56} className="mx-auto text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800 font-display mb-3 text-center">Tudo revisado!</h3>
                        <p className="text-slate-500 text-lg">Nenhum conteúdo aguardando sua aprovação neste momento.</p>
                      </div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).map((post, idx) => (
                     <div key={`approval-post-${post.id || idx}`} className="bg-white rounded-2xl flex flex-col hover:shadow-xl hover:border-brand-200 transition-all p-6 group border border-brand-100">
                       <div className="flex justify-between items-start mb-4">
                         <span className="text-[8px] uppercase tracking-[0.2em] font-black rounded-lg bg-brand-500 text-white px-2.5 py-1.5 shadow-sm">ANÁLISE ESTRATÉGICA</span>
                         {post.remainingApprovalDays !== undefined && (
                           <span className={`text-[9px] font-black uppercase tracking-widest ${
                             Number(post.remainingApprovalDays) <= 1 ? 'text-rose-500 animate-pulse' : 'text-amber-500'
                           }`}>
                             {post.remainingApprovalDays}d restantes
                           </span>
                         )}
                         <span className="text-xs font-medium text-slate-400">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('pt-BR') : ''}</span>
                       </div>
                       <h4 className="font-black text-slate-900 text-lg leading-tight mb-3 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{post.title}</h4>
                       <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-8 text-left font-medium">{post.description}</p>
                       
                       <button onClick={() => setReviewingPost(post)} className="mt-auto w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-brand-600 transition shadow-lg shadow-slate-900/10 active:scale-95">
                         Analisar Estratégia
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
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-3xl min-h-[500px] overflow-hidden relative p-4 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Acervo de <span className="text-brand-500">Publicações</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Artigos que já estão tracionando no seu domínio.</p>
                 </div>

                 <div className="flex flex-wrap items-center gap-3">
                   <div className="relative flex-1 min-w-[200px]">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input 
                       type="text"
                       placeholder="Buscar publicados..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                     />
                   </div>
                   <div className="flex items-center gap-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Histórico</label>
                     <input 
                       type="month" 
                       value={filterMonth}
                       onChange={(e) => setFilterMonth(e.target.value)}
                       className="border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none px-4 py-2"
                     />
                   </div>
                   {(filterMonth || searchTerm) && (
                     <button onClick={() => { setFilterMonth(''); setSearchTerm(''); }} className="text-xs font-bold text-slate-400 hover:text-slate-700 whitespace-nowrap">Limpar Filtros</button>
                   )}
                 </div>
               </div>

                               <div className="hidden md:block">
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
                <div className="md:hidden space-y-4">
                  {filteredBlogPosts.filter(p => p.status === 'Publicado').length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 italic text-xs">
                       Nenhum rastro de publicação encontrado.
                    </div>
                  ) : filteredBlogPosts.filter(p => p.status === 'Publicado').map((post, idx) => (
                    <div key={`pub-post-mobile-${post.id || idx}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono italic">
                          {post.publishedAt ? new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[8px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5">
                           Ativo & Live
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{post.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KW: {post.focusKeywords || '-'}</p>
                      </div>
                      <a 
                        href={post.publishedUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl gap-2 active:scale-95 transition-transform"
                      >
                        Ver no Site <ArrowUpRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
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
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-3xl min-h-[500px] overflow-hidden relative p-4 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Relatório de <span className="text-brand-500">Authority Building</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Backlinks e citações de PR que fortalecem seu domínio.</p>
                 </div>
               </div>

                               <div className="hidden md:block">
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
                <div className="md:hidden space-y-4">
                  {filteredBacklinks.filter(b => b.status === 'Publicado').length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 italic text-xs">
                      Nenhum backlink ativo registrado.
                    </div>
                  ) : filteredBacklinks.filter(b => b.status === 'Publicado').map((link, idx) => (
                    <div key={`pub-link-mobile-${link.id || idx}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono italic">
                          {link.publishedAt ? new Date(link.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[8px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5">
                           Link Ativo
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{link.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">Texto Âncora: {link.focusKeywords || '-'}</span>
                        </div>
                      </div>
                      <a 
                        href={link.publishedUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl gap-2 active:scale-95 transition-transform"
                      >
                        Ver Backlink <ArrowUpRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
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
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] p-4 sm:p-6 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Estratégia de Palavras</h2>
                   <p className="text-sm font-medium text-slate-500">Visão completa dos planejamentos de pautas e estratégias de SEO.</p>
                 </div>
               </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Palavras-chave Planejadas</h3>
                <div className="hidden md:block">
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
                </div>
                <div className="md:hidden space-y-4 mb-10">
                  {filteredKeywords.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">Nenhuma palavra planejada.</div>
                  ) : filteredKeywords.sort((a,b) => (b.targetMonth || '').localeCompare(a.targetMonth || '')).map((kw, idx) => (
                    <div key={`kw-mobile-${kw.id || idx}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kw.targetMonth || '-'}</span>
                         <span className="inline-block text-[9px] uppercase font-bold py-0.5 rounded bg-slate-100 text-slate-700 px-2">{kw.status || 'Disponível'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase lowercase leading-tight">{kw.keyword || '-'}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{kw.clientName || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                          <p className="text-xs font-bold text-slate-700">{kw.searchVolume || '-'}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">KD</p>
                          <p className="text-xs font-bold text-slate-700">{kw.difficulty || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

               <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Backlinks Programados</h3>
                <div className="hidden md:block">
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
                              }`}>{link.status || 'Planejado'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </HorizontalScroll>
                </div>
                <div className="md:hidden space-y-4 mb-10">
                  {filteredBacklinks.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">Nenhum backlink planejado.</div>
                  ) : filteredBacklinks.map((link, idx) => (
                    <div key={`planned-link-mobile-${link.id || idx}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" style={{borderLeft: `4px solid ${link.status === 'Publicado' ? '#10b981' : link.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}`}}>
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                         <span className="text-[10px] font-black text-rose-900 border-r border-slate-100 pr-3 mr-3 uppercase tracking-widest">{link.clientName || '-'}</span>
                         <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                           link.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                           link.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                           'bg-slate-200 text-slate-600'
                         }`}>{link.status || 'Planejado'}</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Âncora & Destino</p>
                        <p className="text-sm font-bold text-slate-900 mb-1 leading-tight uppercase font-mono">{link.anchor || '-'}</p>
                        <a href={link.targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline truncate block lowercase">{link.targetUrl || '-'}</a>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estratégia</p>
                        <p className="text-[11px] text-slate-600 line-clamp-3 italic">Tema: {link.theme || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>

               <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 text-center md:text-left">Artigos de Blog</h3>
                <div className="hidden md:block">
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
                              }`}>{post.status || 'Planejado'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </HorizontalScroll>
                </div>
                <div className="md:hidden space-y-4">
                  {filteredBlogPosts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">Nenhum post planejado.</div>
                  ) : filteredBlogPosts.map((post, idx) => (
                    <div key={`planned-post-mobile-${post.id || idx}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" style={{borderLeft: `4px solid ${post.status === 'Publicado' ? '#10b981' : post.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}`}}>
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                           <span className="text-[10px] font-black text-indigo-900 border-r border-slate-100 pr-3 mr-3 uppercase tracking-widest">{post.clientName || '-'}</span>
                           <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                             post.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                             post.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                             'bg-slate-200 text-slate-600'
                           }`}>{post.status || 'Planejado'}</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Palavra-Chave Principal</p>
                          <p className="text-sm font-bold text-slate-900 mb-1 leading-tight uppercase">{post.focusKeywords || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tema Estratégico</p>
                          <p className="text-[11px] text-slate-600 line-clamp-3 italic">{post.theme || '-'}</p>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </div>
</main>
</div>
  );
}

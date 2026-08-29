import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import YoastTrafficLight from '../components/YoastTrafficLight';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Rocket,
  Check,
  LayoutGrid,
  Layers,
  TrendingUp, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  CheckCircle,
  Calendar,
  RefreshCcw,
  Plus,
  Trash2,
  Send,
  Edit2,
  Edit3,
  ExternalLink,
  BarChart3, 
  Link as LinkIcon, 
  Settings,
  ChevronDown,
  Download,
  Users,
  ArrowUpRight,
  Activity,
  Globe2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Shield,
  Loader2,
  Circle,
  AlertCircle,
  Zap,
  LogOut,
  Key,
  DollarSign,
  Wallet,
  FolderOpen,
  Bell,
  ChevronRight,
  Menu,
  MessageSquareText,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, addDoc, updateDoc, setDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, where, startAfter, onSnapshot } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { updateUserActiveStatus } from '../utils/userStatus';
import Toast, { ToastContainer, ToastType } from '../components/Toast';

// Helper types for Toast
interface ToastState {
  id: string;
  message: string;
  type: ToastType;
}
import PostChat from '../components/PostChat';

const defaultTrafficData = [
  { name: 'Jan', clicks: 2100 },
  { name: 'Fev', clicks: 2300 },
  { name: 'Mar', clicks: 2000 },
  { name: 'Abr', clicks: 2780 },
  { name: 'Mai', clicks: 3100 },
  { name: 'Jun', clicks: 3490 },
  { name: 'Jul', clicks: 4200 },
  { name: 'Ago', clicks: 4900 },
  { name: 'Set', clicks: 5800 },
  { name: 'Out', clicks: 6400 },
  { name: 'Nov', clicks: 7800 },
  { name: 'Dez', clicks: 9200 },
];

const defaultKwData = [
  { kw: 'agencia de seo', pos: 3, diff: 2, vol: '8.4k' },
  { kw: 'consultoria seo', pos: 1, diff: 0, vol: '5.2k' },
  { kw: 'como fazer seo', pos: 5, diff: 4, vol: '12k' },
  { kw: 'auditoria de site grátis', pos: 2, diff: 1, vol: '3.1k' },
  { kw: 'link building comprar', pos: 8, diff: -2, vol: '1.9k' },
];

const tasks = [
  { id: 1, title: 'Corrigir 12 links quebrados (Erro 404)', category: 'Técnico', priority: 'Alta', status: 'Pendente' },
  { id: 2, title: 'Publicar artigo "Guia de SEO 2026"', category: 'Conteúdo', priority: 'Média', status: 'Em Andamento' },
  { id: 3, title: 'Otimizar H1 e Title da página de Serviços', category: 'On-Page', priority: 'Alta', status: 'Concluído' },
  { id: 4, title: 'Prospectar backlinks para "Agência SEO"', category: 'Off-Page', priority: 'Baixa', status: 'Pendente' },
];

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

import { ContentAgency } from '../components/ContentAgency';
import { HubClients } from '../components/HubClients';
import { PlanningView } from '../components/PlanningView';
import { FinancialHealthView } from '../components/FinancialHealthView';
import { TechnicalSupportView } from '../components/TechnicalSupportView';
import { CategoriesManagerView } from '../components/CategoriesManagerView';
import { ClientOverview } from '../components/ClientOverview';
import { ApprovalsView } from '../components/ApprovalsView';
const PostFormModal = lazy(() => import('../components/PostFormModal').then(m => ({ default: m.PostFormModal })));
const BacklinkFormModal = lazy(() => import('../components/BacklinkFormModal').then(m => ({ default: m.BacklinkFormModal })));
const KeywordFormModal = lazy(() => import('../components/KeywordFormModal').then(m => ({ default: m.KeywordFormModal })));
const ClientModal = lazy(() => import('../components/ClientModal').then(m => ({ default: m.ClientModal })));
const PaymentModal = lazy(() => import('../components/PaymentModal').then(m => ({ default: m.PaymentModal })));
const SettingsGlobal = lazy(() => import('../components/SettingsGlobal'));
import { FileUploader } from '../components/FileUploader';

import Skeleton, { SkeletonCard, SkeletonMetric } from '../components/ui/Skeleton';

const Breadcrumbs = ({ workspace, activeTab }: { workspace: string, activeTab: string }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
    <Link to="/dashboard" className="hover:text-slate-900 transition-colors">ROOT</Link>
    <ChevronRight size={8} className="opacity-40" />
    <span className="text-slate-400">{workspace === 'agencia' ? 'Agência' : workspace === 'clientes' ? 'Clientes' : workspace}</span>
    <ChevronRight size={8} className="opacity-40" />
    <span className="text-slate-900">{activeTab}</span>
  </div>
);

const BentoCard = ({ title, value, icon: Icon, percentage, total, color = 'brand', subtext }: any) => (
  <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-500 group relative overflow-hidden">
    <div className="absolute -right-12 -top-12 w-24 h-24 bg-slate-50 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-1000" />
    
    <div className="flex items-start justify-between mb-8 relative z-10">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 shadow-sm ${color === 'brand' ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-600'}`}>
        <Icon size={18} />
      </div>
      <div className="text-right">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 leading-none mb-2">{title}</div>
        <div className="flex items-center gap-1.5 justify-end">
           <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</span>
           <span className="text-[10px] font-black text-slate-200 tracking-wider leading-none">/ {total}</span>
        </div>
      </div>
    </div>
    
    <div className="mb-5 relative z-10">
       <div className="flex items-baseline gap-1">
         <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">{percentage}</span>
         <span className="text-xs font-black text-slate-200 leading-none">%</span>
       </div>
       {subtext && <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm"></div>
         {subtext}
       </div>}
    </div>
    
    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden relative z-10 border border-slate-100">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full rounded-full transition-all duration-1000 ${color === 'brand' ? 'bg-brand-600' : 'bg-brand-500'}`}
      />
    </div>
  </div>
);

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Dashboard() {
  const { logoUrl } = useSettings();
  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email || '';

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email !== 'matheuspontes290594@gmail.com' && user.email !== 'aceleraseo@gmail.com') {
       navigate('/portal-cliente', { replace: true });
       return;
    }

    if (user) {
      updateUserActiveStatus('admin', user.displayName || undefined, user.email || undefined);
      const interval = setInterval(() => {
        updateUserActiveStatus('admin', user.displayName || undefined, user.email || undefined);
      }, 180000);

      fetchAdminTickets();

      return () => clearInterval(interval);
    }
  }, [navigate]);

  const [sidebarWorkspace, setSidebarWorkspace] = useState<'clientes' | 'agencia'>('clientes');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [isChangingTab, setIsChangingTab] = useState(false);

  React.useEffect(() => {
    setIsChangingTab(true);
    const timer = setTimeout(() => {
      setIsChangingTab(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const [globalPayments, setGlobalPayments] = useState<any[]>([]);
  const [loadingGlobalPayments, setLoadingGlobalPayments] = useState(false);
  const [filterClient, setFilterClient] = useState('');
  const [subTabCrm, setSubTabCrm] = useState('Clientes Ativos');
  const [siteUrl, setSiteUrl] = useState('');
  const [lastLoadTimes, setLastLoadTimes] = useState<Record<string, number>>({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Support and Online status
  const [adminTickets, setAdminTickets] = useState<any[]>([]);
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<any>(null);
  const [adminTicketMessages, setAdminTicketMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [loadingAdminTickets, setLoadingAdminTickets] = useState(false);
  const [sendingAdminReply, setSendingAdminReply] = useState(false);
  const [pendingTicketsCount, setPendingTicketsCount] = useState(0);

  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [checkingOnline, setCheckingOnline] = useState(false);

  const fetchAdminTickets = async () => {
    setLoadingAdminTickets(true);
    try {
      const q = query(
        collection(db, 'support_tickets')
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      // Sort by updatedAt desc
      list.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0);
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0);
        return timeB - timeA;
      });
      setAdminTickets(list);
      const pending = list.filter((t: any) => t.unreadByAdmin).length;
      setPendingTicketsCount(pending);
    } catch (err) {
      console.error("Erro ao buscar chamados (admin):", err);
    } finally {
      setLoadingAdminTickets(false);
    }
  };

  const checkOnlineUsers = async () => {
    setCheckingOnline(true);
    try {
      // Fetch user statuses updated in the last 24 hours (or general fetch since list is usually small)
      const q = query(
        collection(db, 'user_status'),
        orderBy('lastActive', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      const now = Date.now();
      const list = snap.docs.map(d => {
        const data = d.data();
        const lastActiveMs = data.lastActive?.toMillis ? data.lastActive.toMillis() : (data.lastActive instanceof Date ? data.lastActive.getTime() : 0);
        const isOnline = now - lastActiveMs < 300000; // 5 minutes window
        return {
          id: d.id,
          ...data,
          isOnline
        };
      });
      setOnlineUsers(list);
      addToast('Status carregado com sucesso!', 'success');
    } catch (err) {
      console.error("Erro ao consultar usuários online:", err);
      addToast('Erro ao carregar lista de usuários.', 'error');
    } finally {
      setCheckingOnline(false);
    }
  };

  const handleAdminSelectTicket = async (ticket: any) => {
    setSelectedAdminTicket(ticket);
    if (ticket.unreadByAdmin) {
      try {
        await updateDoc(doc(db, 'support_tickets', ticket.id), {
          unreadByAdmin: false,
          updatedAt: serverTimestamp()
        });
        setAdminTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unreadByAdmin: false } : t));
        setPendingTicketsCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Erro ao marcar como lido pelo admin:", err);
      }
    }
  };

  const handleSendAdminReply = async () => {
    if (!adminReplyText.trim() || !selectedAdminTicket || !auth.currentUser) return;
    setSendingAdminReply(true);
    try {
      const messageData = {
        senderId: auth.currentUser.uid,
        senderName: 'Atendimento Acelera SEO',
        senderRole: 'admin',
        message: adminReplyText,
        createdAt: serverTimestamp()
      };

      const messageRef = doc(collection(db, 'support_tickets', selectedAdminTicket.id, 'messages'));
      await setDoc(messageRef, messageData);

      await updateDoc(doc(db, 'support_tickets', selectedAdminTicket.id), {
        unreadByClient: true,
        unreadByAdmin: false,
        lastMessage: adminReplyText.substring(0, 150),
        status: 'answered',
        updatedAt: serverTimestamp()
      });

      try {
        if (selectedAdminTicket.clientUid) {
          await addDoc(collection(db, 'notifications'), {
            userId: selectedAdminTicket.clientUid,
            clientEmail: selectedAdminTicket.clientEmail || '',
            title: 'Nova Mensagem de Suporte',
            message: `Você recebeu uma resposta da nossa equipe no chamado: "${selectedAdminTicket.subject}".`,
            type: 'info',
            category: 'suporte',
            read: false,
            createdAt: serverTimestamp()
          });
        }
      } catch (notifErr) {
        console.error("Erro ao criar notificação de resposta:", notifErr);
      }

      setAdminReplyText('');
      fetchAdminTickets();
    } catch (err) {
      console.error("Erro ao responder chamado:", err);
      addToast('Erro ao enviar resposta.', 'error');
    } finally {
      setSendingAdminReply(false);
    }
  };

  const fetchAgencyNotifications = async (userId: string) => {
    const path = 'notifications';
    try {
      const q = query(
        collection(db, path),
        where('read', '==', false),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const newNotifications = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setNotifications(newNotifications);
      setUnreadCount(snapshot.size);
    } catch (error) {
      console.error(error);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true, readAt: serverTimestamp() });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const shouldReload = (key: string) => {
    const now = Date.now();
    const lastLoad = lastLoadTimes[key] || 0;
    // Cache for 20 minutes to avoid redundant network calls
    return now - lastLoad > 1200000;
  };

  const markLoaded = (key: string) => {
    setLastLoadTimes(prev => ({ ...prev, [key]: Date.now() }));
  };
  
  const exportToCSV = (data: any[], filename: string, type: 'audit' | 'contact') => {
    let csvContent = "";
    
    if (type === 'audit') {
       csvContent += "Data,Nome,Celular,URL,Status\n";
       data.forEach(item => {
          const date = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente';
          const status = item.status === 'tratado' ? 'Tratado' : 'Pendente';
          const row = `"${date}","${(item.name || '').replace(/"/g, '""')}","${(item.phone || '').replace(/"/g, '""')}","${(item.url || '').replace(/"/g, '""')}","${status}"`;
          csvContent += row + "\n";
       });
    } else {
       csvContent += "Data,Nome,Empresa,Email,Mensagem,Status\n";
       data.forEach(item => {
          const date = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente';
          const safeMessage = typeof item.message === 'string' ? item.message.replace(/"/g, '""').replace(/\n/g, ' ') : '';
          const status = item.status === 'tratado' ? 'Tratado' : 'Pendente';
          const row = `"${date}","${(item.name || '').replace(/"/g, '""')}","${(item.company || '').replace(/"/g, '""')}","${(item.email || '').replace(/"/g, '""')}","${safeMessage}","${status}"`;
          csvContent += row + "\n";
       });
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Removed GSC states
  
  // Production Alert Logic
  const getProductionAlerts = () => {
    const alerts: any[] = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate();

    clients.forEach(client => {
      if (!client.active) return;
      
      const monthlyPosts = Number(client.monthlyPosts || 0) + Number(client.extraPosts || 0);
      const monthlyBacklinks = Number(client.monthlyBacklinks || 0) + Number(client.extraBacklinks || 0);
      
      const currentMonthCycle = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Filter production for current client/month
      const deliveredPosts = blogPosts.filter(p => p.clientName === client.name && p.targetMonth === currentMonthCycle && p.status === 'Publicado').length;
      const progressPosts = blogPosts.filter(p => p.clientName === client.name && p.targetMonth === currentMonthCycle && (p.status === 'Rascunho' || p.status === 'Aguardando Aprovação' || p.status === 'Em Produção')).length;
      const approvedWaitPub = blogPosts.filter(p => p.clientName === client.name && p.targetMonth === currentMonthCycle && p.status === 'Aprovado').length;
      const adjustmentRequested = blogPosts.filter(p => p.clientName === client.name && p.status === 'Ajustes Necessários').length;
      
      const deliveredLinks = backlinks.filter(b => b.clientName === client.name && b.targetMonth === currentMonthCycle && b.status === 'Publicado').length;

      const missingPosts = monthlyPosts - deliveredPosts;
      const missingLinks = monthlyBacklinks - deliveredLinks;

      if (adjustmentRequested > 0) {
        alerts.push({
          type: 'danger',
          client: client.name,
          priority: 0.5,
          message: `${adjustmentRequested} conteúdo(s) com ajustes urgentes solicitados.`,
          action: 'Ver Ajustes'
        });
      }

      // Critical Case: High backlog + near deadline
      if (remainingDays <= 5 && (missingPosts >= 3 || missingLinks >= 3)) {
        alerts.push({
          type: 'danger',
          client: client.name,
          priority: 1,
          message: `ALERTA CRÍTICO: Faltam ${missingPosts} posts e ${missingLinks} links com apenas ${remainingDays} dias restantes.`,
          action: 'Ver Operação'
        });
      } else if (remainingDays <= 7 && missingPosts > 0) {
        alerts.push({
          type: 'danger',
          client: client.name,
          priority: 1,
          message: `Atenção: Faltam ${missingPosts} artigos para fechar o mês.`,
          action: 'Ver Produção'
        });
      }

      if (approvedWaitPub > 0) {
        alerts.push({
          type: 'success',
          client: client.name,
          priority: 2,
          message: `${approvedWaitPub} conteúdo(s) aprovado(s) aguardando publicação.`,
          action: 'Publicar Agora'
        });
      }
    });

    // Sort by priority (1 is highest)
    return alerts.sort((a, b) => a.priority - b.priority);
  };

  // SEO Metadata State
  const [seoPages, setSeoPages] = useState<any[]>([]);
  const [seoSearch, setSeoSearch] = useState('');
  const [loadingSeo, setLoadingSeo] = useState(false);
  const [seoForm, setSeoForm] = useState({ id: '', url: '', title: '', description: '', customNotes: '' });
  const [showSeoForm, setShowSeoForm] = useState(false);

  // Leads & Contatos State
  const [auditLeads, setAuditLeads] = useState<any[]>([]);
  const [contactLeads, setContactLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [whatsappContactTemplate, setWhatsappContactTemplate] = useState('');
  const [whatsappAuditTemplate, setWhatsappAuditTemplate] = useState('');
  
  const [auditFilter, setAuditFilter] = useState('Todos');
  const [contactFilter, setContactFilter] = useState('Todos');
  const [auditDateFilter, setAuditDateFilter] = useState('7d');
  const [contactDateFilter, setContactDateFilter] = useState('7d');
  
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  
  // Categories State
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', slug: '', description: '', seoTitle: '', seoDescription: '', isProtected: false });

  const loadCategories = async () => {
    if (!auth.currentUser) return;
    setLoadingCategories(true);
    try {
      const q = query(collection(db, 'blog_categories'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as any[];
      
      // Ensure "Geral" exists
      const hasGeral = data.find(c => c.name === 'Geral' || c.isProtected);
      if (!hasGeral) {
        const geralData = {
          name: 'Geral',
          slug: 'geral',
          description: 'Categoria padrão para artigos.',
          isProtected: true,
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'blog_categories'), geralData);
        data.push({ ...geralData, id: docRef.id });
      }
      
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'blog_categories';
    try {
      const { id, ...data } = categoryForm;
      const slug = data.slug || data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const payload = {
        ...data,
        slug,
        updatedAt: serverTimestamp(),
        agencyUid: auth.currentUser?.uid
      };

      if (id) {
        const oldCategory = categories.find(c => c.id === id);
        await updateDoc(doc(db, path, id), payload);
        
        // If name changed, update all posts belonging to this category
        if (oldCategory && oldCategory.name !== data.name) {
          const postsQ = query(collection(db, 'blog_posts'), where('category', '==', oldCategory.name), where('agencyUid', '==', auth.currentUser?.uid));
          const postsSnap = await getDocs(postsQ);
          const updatePromises = postsSnap.docs.map(postDoc => 
            updateDoc(postDoc.ref, { category: data.name })
          );
          await Promise.all(updatePromises);
        }
      } else {
        await addDoc(collection(db, path), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      setShowCategoryForm(false);
      loadCategories();
      addToast("Categoria salva com sucesso!", "success");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (cat.isProtected || cat.name === 'Geral') {
      addToast("A categoria Geral é protegida e não pode ser excluída.", "warning");
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir a categoria "${cat.name}"? Todos os artigos vinculados a ela serão movidos para "Geral".`)) {
      return;
    }

    try {
      // 1. Find all posts with this category
      const postsQ = query(collection(db, 'blog_posts'), where('category', '==', cat.name));
      const postsSnap = await getDocs(postsQ);
      
      // 2. Update posts to "Geral"
      const updatePromises = postsSnap.docs.map(postDoc => 
        updateDoc(postDoc.ref, { category: 'Geral' })
      );
      await Promise.all(updatePromises);
      
      // 3. Delete the category
      await deleteDoc(doc(db, 'blog_categories', cat.id));
      
      loadCategories();
      addToast(`Categoria excluída. ${updatePromises.length} artigos foram movidos para "Geral".`, "info");
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir categoria.", "error");
    }
  };

  // Pagination states
  const [auditLastDoc, setAuditLastDoc] = useState<any>(null);
  const [auditHasMore, setAuditHasMore] = useState(true);
  const [auditLoadingMore, setAuditLoadingMore] = useState(false);

  const [contactLastDoc, setContactLastDoc] = useState<any>(null);
  const [contactHasMore, setContactHasMore] = useState(true);
  const [contactLoadingMore, setContactLoadingMore] = useState(false);

  const LEAD_PAGE_SIZE = 20;

  const buildLeadQueryConstraints = (dateFilter: string, lastDoc: any = null) => {
    const constraints: any[] = [];
    if (dateFilter === '7d' || dateFilter === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - (dateFilter === '7d' ? 7 : 30));
      constraints.push(where('createdAt', '>=', d));
    }
    constraints.push(orderBy('createdAt', 'desc'));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(LEAD_PAGE_SIZE));
    return constraints;
  };

  const filteredAuditLeads = auditLeads.filter(lead => {
     if (auditFilter === 'Tratados' && lead.status !== 'tratado') return false;
     if (auditFilter === 'Pendentes' && lead.status === 'tratado') return false;
     return true; // Date is already filtered by DB
  });

  const filteredContactLeads = contactLeads.filter(lead => {
     if (contactFilter === 'Tratados' && lead.status !== 'tratado') return false;
     if (contactFilter === 'Pendentes' && lead.status === 'tratado') return false;
     return true; // Date is already filtered by DB
  });

  const toggleLeadStatus = async (collectionName: string, id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'tratado' ? 'pendente' : 'tratado';
      await updateDoc(doc(db, collectionName, id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      if (collectionName === 'audit_leads') {
        setAuditLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      } else {
        setContactLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, collectionName);
    }
  };

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const pendingPostsCount = blogPosts.filter(p => 
    (p.status === 'Pendente' || p.status === 'Ajustes Necessários') && 
    (!selectedHubClient || p.clientName === selectedHubClient)
  ).length;
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showBacklinkForm, setShowBacklinkForm] = useState(false);
  const [postForm, setPostForm] = useState({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Planejado', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '', clientComment: '' });
  const [backlinkForm, setBacklinkForm] = useState({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Aguardando Produção', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBacklinksList = backlinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          link.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hub Clients Settings
  const [selectedHubClient, setSelectedHubClient] = useState('');
  const [selectedCycle, setSelectedCycle] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  const formatCycleDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const monthIdx = parseInt(month) - 1;
      return monthIdx >= 0 && monthIdx < 12 ? `${months[monthIdx]}/${year}` : dateStr;
    } catch {
      return dateStr;
    }
  };

  const [keywordsUniverse, setKeywordsUniverse] = useState<any[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [keywordForm, setKeywordForm] = useState({ 
    id: '', 
    clientName: '', 
    clientEmail: '', 
    keyword: '', 
    searchVolume: '', 
    difficulty: '', 
    status: 'Disponível', 
    notes: '', 
    targetMonth: '', 
    targetWords: '',
    internalLinking: '',
    theme: '',
    secondaryKeywords: ''
  });

  // Client Management State
  const [clients, setClients] = useState<any[]>([]);
  
  // Toast State
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', active: true, approvalDeadlineDays: '5', lastPaymentMonth: '', websiteUrl: '',
    extraMonth: '', extraPosts: '0', extraBacklinks: '0', extraDevHours: '0',
    taxId: '', contactName: '', phone: '', additionalPhone: '',
    logoUrl: '',
    packageName: '', packageValue: '0', currentCycleDate: new Date().toISOString().slice(0, 7),
    onDemandItems: [] as { id: string, name: string, quantity: number, price: number }[]
  });

  const loadClients = async (force = false) => {
    if (!auth.currentUser || loadingClients) return;
    if (!force && clients.length > 0 && !shouldReload('clients')) return;
    
    setLoadingClients(true);
    const path = 'clients';
    try {
      const q = query(collection(db, path), where('agencyUid', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a: any, b: any) => (a.name||'').localeCompare(b.name||''));
      setClients(data);
      markLoaded('clients');
    } catch (err) {
      console.error("Erro ao carregar clientes", err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'clients';
    try {
      if (clientForm.id) {
        const { id, ...dataToSave } = clientForm;
        await updateDoc(doc(db, path, id), {
          ...dataToSave,
          monthlyPosts: Number(clientForm.monthlyPosts || 0),
          monthlyBacklinks: Number(clientForm.monthlyBacklinks || 0),
          initialDevHours: Number(clientForm.initialDevHours || 0),
          monthlyDevHours: Number(clientForm.monthlyDevHours || 0),
          billingDay: Number(clientForm.billingDay || 10),
          approvalDeadlineDays: Number(clientForm.approvalDeadlineDays || 5),
          extraPosts: Number(clientForm.extraPosts || 0),
          extraBacklinks: Number(clientForm.extraBacklinks || 0),
          extraDevHours: Number(clientForm.extraDevHours || 0),
          packageName: String(clientForm.packageName || ''),
          packageValue: Number(String(clientForm.packageValue).replace(',', '.') || 0),
          updatedAt: serverTimestamp()
        });
        addToast("Cliente atualizado!", "success");
      } else {
        const { id, ...dataToSave } = clientForm;
        await addDoc(collection(db, path), {
          ...dataToSave,
          monthlyPosts: Number(clientForm.monthlyPosts || 0),
          monthlyBacklinks: Number(clientForm.monthlyBacklinks || 0),
          initialDevHours: Number(clientForm.initialDevHours || 0),
          monthlyDevHours: Number(clientForm.monthlyDevHours || 0),
          billingDay: Number(clientForm.billingDay || 10),
          approvalDeadlineDays: Number(clientForm.approvalDeadlineDays || 5),
          extraPosts: Number(clientForm.extraPosts || 0),
          extraBacklinks: Number(clientForm.extraBacklinks || 0),
          extraDevHours: Number(clientForm.extraDevHours || 0),
          packageName: String(clientForm.packageName || ''),
          packageValue: Number(String(clientForm.packageValue).replace(',', '.') || 0),
          createdAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
        addToast("Cliente cadastrado!", "success");
      }
      setShowClientForm(false);
      loadClients(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este parceiro?")) return;
    try {
      await deleteDoc(doc(db, 'clients', id));
      addToast("Parceiro removido com sucesso", "success");
      loadClients();
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir cliente.", "error");
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      addToast("Nenhum item selecionado", "warning");
      return;
    }
    
    if (!window.confirm(`Deseja aprovar ${selectedIds.length} itens selecionados?`)) return;
    
    try {
      addToast(`Aprovando ${selectedIds.length} itens...`, "info");
      const promises = selectedIds.map(async id => {
        // Try blog posts
        const postRef = doc(db, 'blog_posts', id);
        const linkRef = doc(db, 'backlinks', id);
        
        // Find in local state to know where it belongs
        const isPost = blogPosts.some(p => p.id === id);
        if (isPost) {
          await updateDoc(postRef, { 
            status: 'Aprovado', 
            updatedAt: serverTimestamp(),
            clientComment: 'Aprovado em massa plea agência'
          });
        } else {
          await updateDoc(linkRef, { 
            status: 'Aprovado', 
            updatedAt: serverTimestamp()
          });
        }
      });
      
      await Promise.all(promises);
      addToast(`${selectedIds.length} itens aprovados com sucesso!`, "success");
      setSelectedIds([]);
      loadBlogPosts(true);
      loadBacklinks(true);
    } catch (error) {
      console.error(error);
      addToast("Erro ao processar aprovação em massa", "error");
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [clientsList, setClientsList] = useState<string[]>([]);
  React.useEffect(() => {
    const allClients = ['Agência', ...clients.map(c => c.name), ...blogPosts.map(item => item.clientName), ...backlinks.map(item => item.clientName)].filter(Boolean);
    setClientsList(Array.from(new Set(allClients)));
  }, [clients, blogPosts, backlinks]);

  const [isAuditing, setIsAuditing] = useState(false);
  const triggerTechnicalAudit = async () => {
    if (isAuditing || !auth.currentUser) return;
    setIsAuditing(true);
    try {
      const res = await fetch('/api/audit-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyUid: auth.currentUser.uid })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`${data.count} URLs auditadas com sucesso!`, "success");
        loadSeoPages();
      } else {
        addToast("Erro na auditoria: " + data.error, "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Erro ao conectar com servidor de auditoria.", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  const generateInviteLink = (client: any) => {
    const baseUrl = window.location.origin;
    // Link format: /cadastro?clientId=XYZ&clientEmail=abc@example.com
    const inviteLink = `${baseUrl}/cadastro?clientId=${client.id}&clientEmail=${encodeURIComponent(client.clientEmail || '')}&clientName=${encodeURIComponent(client.name || '')}&clientWebsite=${encodeURIComponent(client.websiteUrl || '')}`;
    navigator.clipboard.writeText(inviteLink);
    
    setCopiedClientId(client.id);
    setTimeout(() => setCopiedClientId(null), 2000);
  };

  const [selectedClientForPayments, setSelectedClientForPayments] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    description: 'Mensalidade SEO',
    type: 'Mensalidade'
  });

  const loadGlobalPayments = async () => {
    if (!auth.currentUser) return;
    setLoadingGlobalPayments(true);
    try {
      const q = query(
        collection(db, 'payments'),
        where('agencyUid', '==', auth.currentUser.uid),
        orderBy('paymentDate', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      setGlobalPayments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error("Erro ao carregar pagamentos globais", err);
    } finally {
      setLoadingGlobalPayments(false);
    }
  };

  useEffect(() => {
    const loadWhatsappTemplates = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWhatsappContactTemplate(data.whatsappContactTemplate || '');
          setWhatsappAuditTemplate(data.whatsappAuditTemplate || '');
        }
      } catch (err) {
        console.error("Erro ao carregar templates do whatsapp no dashboard:", err);
      }
    };
    loadWhatsappTemplates();
  }, []);

  const getWhatsappLink = (lead: any, type: 'audit' | 'contact') => {
    // Obter celular bruto
    let rawPhone = type === 'audit' ? lead.phone : lead.whatsapp;
    if (!rawPhone) return '';

    // Limpar caracteres, manter apenas números
    let cleanPhone = rawPhone.replace(/\D/g, '');

    // Se for telefone brasileiro sem código do país (9 ou 10 ou 11 dígitos), insere 55
    if (cleanPhone.length === 11 || cleanPhone.length === 10 || (cleanPhone.length === 9 && cleanPhone.startsWith('9'))) {
      cleanPhone = '55' + cleanPhone;
    }

    // Seleciona o template configurado
    let template = type === 'audit' ? whatsappAuditTemplate : whatsappContactTemplate;

    // Se vazio, aplica backups elegantes
    if (!template) {
      if (type === 'contact') {
        template = 'Olá {nome}! Recebemos seu contato no site da Acelera SEO sobre a empresa {empresa}. Como podemos te ajudar?';
      } else {
        template = 'Olá {nome}! Vi que você realizou uma auditoria de SEO automática no site {site}. Vamos agendar uma apresentação gratuita do relatório técnico?';
      }
    }

    // Substituir as variáveis coringas (Case Insensitive)
    let text = template;
    text = text.replace(/\{nome\}/gi, lead.name || '');
    
    if (type === 'contact') {
      text = text.replace(/\{empresa\}/gi, lead.company || '');
      text = text.replace(/\{telefone\}/gi, lead.whatsapp || '');
      text = text.replace(/\{whatsapp\}/gi, lead.whatsapp || '');
      text = text.replace(/\{mensagem\}/gi, lead.message || '');
    } else {
      text = text.replace(/\{site\}/gi, lead.url || '');
      text = text.replace(/\{telefone\}/gi, lead.phone || '');
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (activeTab === 'Financeiro') {
      loadGlobalPayments();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedClientForPayments) {
      loadPayments(selectedClientForPayments.id);
      setPaymentForm(prev => ({
        ...prev,
        amount: Number(selectedClientForPayments.packageValue || 0)
      }));
    }
  }, [selectedClientForPayments?.id]);

  const handleConfirmPayment = async (payment: any) => {
    const path = 'payments';
    try {
      await updateDoc(doc(db, path, payment.id), {
        status: 'confirmado',
        updatedAt: serverTimestamp(),
        agencyUid: auth.currentUser?.uid
      });
      
      const client = clients.find(c => c.id === payment.clientId);
      if (client) {
        if (payment.paymentMonth >= (client.lastPaymentMonth || '')) {
          await updateDoc(doc(db, 'clients', client.id), {
            lastPaymentMonth: payment.paymentMonth,
            updatedAt: serverTimestamp(),
            agencyUid: auth.currentUser?.uid
          });
        }
      }
      
      addToast("Pagamento confirmado!", "success");
      loadGlobalPayments();
      if (selectedClientForPayments?.id === payment.clientId) {
        loadPayments(payment.clientId);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const loadPayments = async (clientId: string) => {
    setLoadingPayments(true);
    try {
      const q = query(
        collection(db, 'payments'), 
        where('clientId', '==', clientId),
        orderBy('paymentDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPayments(data);
    } catch (err) {
      console.error("Erro ao carregar pagamentos", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPayments || !auth.currentUser) return;

    const path = 'payments';
    try {
      const paymentData = {
        ...paymentForm,
        clientId: selectedClientForPayments.id,
        clientName: selectedClientForPayments.name,
        clientEmail: selectedClientForPayments.clientEmail || '',
        amount: Number(paymentForm.amount),
        agencyUid: auth.currentUser.uid,
        status: 'confirmado',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, path), paymentData);

      // Update client's lastPaymentMonth if this is the newest payment month
      const currentLastPayment = selectedClientForPayments.lastPaymentMonth || '';
      if (paymentForm.paymentMonth >= currentLastPayment) {
        await updateDoc(doc(db, 'clients', selectedClientForPayments.id), {
          lastPaymentMonth: paymentForm.paymentMonth,
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser.uid
        });
      }

      addToast("Pagamento registrado!", "success");
      loadPayments(selectedClientForPayments.id);
      loadClients(); // Refresh client list to update status
      setPaymentForm({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMonth: new Date().toISOString().slice(0, 7),
        description: 'Mensalidade SEO',
        type: 'Mensalidade'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleDeletePayment = async (payment: any) => {
    if (!window.confirm("Excluir este registro de pagamento?")) return;
    try {
      await deleteDoc(doc(db, 'payments', payment.id));
      addToast("Pagamento removido", "success");
      loadPayments(selectedClientForPayments.id);
      // Note: we don't automatically roll back lastPaymentMonth on client for simplicity 
      // unless we want to find the next most recent payment.
    } catch (err) {
      addToast("Erro ao remover pagamento", "error");
    }
  };

  const handleTogglePayment = (client: any) => {
    setSelectedClientForPayments(client);
    setPaymentForm(prev => ({
      ...prev,
      amount: Number(client.packageValue || 0)
    }));
    loadPayments(client.id);
    setShowPaymentModal(true);
  };

  const getPaymentStatus = (client: any) => {
    if (client.status === 'Cancelado' || client.active === false) {
      return { label: 'Cancelado', color: 'text-slate-500 border-slate-200', text: 'text-slate-500', bg: 'bg-slate-50', icon: X };
    }

    const now = new Date();
    const billingDay = Number(client.billingDay || 10);
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.getDate();

    // Check if paid in current cycle
    const isPaidCurrentCycle = client.lastPaymentMonth === currentMonthYear;

    if (isPaidCurrentCycle) {
      return { label: 'Ativo', color: 'text-emerald-700 border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle };
    }

    if (today > billingDay) {
      return { label: 'Em atraso', color: 'text-rose-700 border-rose-200', text: 'text-rose-700', bg: 'bg-rose-50', icon: AlertCircle };
    }

    if (today === billingDay) {
      return { label: 'Vencimento Hoje', color: 'text-amber-700 border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', icon: Activity };
    }

    // Vencimento Próximo: 5 days before billingDay
    let daysToBilling = billingDay - today;
    if (daysToBilling < 0) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, billingDay);
      daysToBilling = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (daysToBilling > 0 && daysToBilling <= 5) {
      return { label: 'Vencimento Próximo', color: 'text-orange-600 border-orange-200', text: 'text-orange-600', bg: 'bg-orange-50', icon: Clock };
    }

    return { label: 'Ativo', color: 'text-emerald-700 border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle };
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      addToast("Este cliente não possui um e-mail cadastrado.", "warning");
      return;
    }

    if (window.confirm(`Deseja enviar um e-mail de redefinição de senha para ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        addToast(`E-mail de redefinição enviado para ${email}!`, "success");
      } catch (error: any) {
        console.error("Erro ao enviar reset de senha:", error);
        addToast("Erro ao enviar e-mail. Verifique a validade do e-mail.", "error");
      }
    }
  };

  // Effect to capture invites (Standardizing this might be better in App.tsx or a dedicated hook, but keeping it here if it's dashboard specific)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('clientId');
    
    if (clientId && auth.currentUser) {
       // Logic to bind UID if needed
    }
  }, [auth.currentUser]);
  React.useEffect(() => {
    if (auth.currentUser) {
      fetchAgencyNotifications(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  // Real-time listener for the selected ticket's messages (admin)
  React.useEffect(() => {
    if (!selectedAdminTicket?.id) {
      setAdminTicketMessages([]);
      return;
    }

    const q = query(
      collection(db, 'support_tickets', selectedAdminTicket.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdminTicketMessages(msgs);
    }, (err) => {
      console.error("Erro no canal de mensagens admin em tempo real:", err);
    });

    return () => unsubscribe();
  }, [selectedAdminTicket?.id]);

  const [reviewingPost, setReviewingPost] = useState<any>(null);

  React.useEffect(() => {
    loadClients();
  }, []);

  React.useEffect(() => {
    if (loadedTabs.has(activeTab)) return;

    let shouldMarkLoaded = false;

    if (activeTab === 'Monitoramento de Rankings') {
      loadSeoPages();
      shouldMarkLoaded = true;
    } else if (activeTab === 'Clientes & CRM') {
      loadClients();
      shouldMarkLoaded = true;
    } else if (activeTab === 'Suporte Técnico Admin') {
      fetchAdminTickets();
      shouldMarkLoaded = true;
    } else if (activeTab === 'Conteúdo Interno (Acelera)' || activeTab === 'Hub de Clientes' || activeTab === 'Planejamento' || activeTab === 'Artigos e Conteúdos' || activeTab === 'Backlinks' || activeTab === 'Aprovações Pendentes' || activeTab === 'Visão Geral') {
      loadBlogPosts();
      loadBacklinks();
      loadKeywordsUniverse();
      shouldMarkLoaded = true;
    }

    if (shouldMarkLoaded) {
      setLoadedTabs(prev => new Set(prev).add(activeTab));
    }
  }, [activeTab, loadedTabs]);

  React.useEffect(() => {
    if (activeTab === 'Clientes & CRM') {
      loadAuditLeads(false);
    }
  }, [auditDateFilter, activeTab]);

  React.useEffect(() => {
    if (activeTab === 'Clientes & CRM') {
      loadContactLeads(false);
    }
  }, [contactDateFilter, activeTab]);

  const loadKeywordsUniverse = async (force = false) => {
    if (!auth.currentUser || loadingKeywords) return;
    if (!force && keywordsUniverse.length > 0 && !shouldReload('keywords')) return;
    
    setLoadingKeywords(true);
    const path = 'keyword_universe';
    try {
      const q = query(collection(db, path), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(150));
      
      const querySnapshot = await getDocs(q);
      const kws: any[] = [];
      querySnapshot.forEach((doc) => {
        kws.push({ ...doc.data(), id: doc.id });
      });
      setKeywordsUniverse(kws);
      markLoaded('keywords');
    } catch (error) {
      console.error("Erro ao carregar planejamento", error);
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleSaveKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'keyword_universe';
    try {
      const { id, ...saveData } = keywordForm;
      const dataToSave = {
        ...saveData,
        keyword: saveData.keyword || '',
        searchVolume: saveData.searchVolume || '',
        difficulty: saveData.difficulty || '',
        notes: saveData.notes || '',
        targetMonth: saveData.targetMonth || '',
        targetWords: saveData.targetWords || '',
        clientName: saveData.clientName || '',
        clientEmail: saveData.clientEmail || '',
        status: saveData.status || 'Disponível',
        updatedAt: serverTimestamp(),
        agencyUid: auth.currentUser?.uid
      };
      if (id) {
        await updateDoc(doc(db, path, id), dataToSave);
      } else {
        await addDoc(collection(db, path), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      setShowKeywordForm(false);
      setKeywordForm({ 
        id: '', 
        clientName: '', 
        clientEmail: '', 
        keyword: '', 
        searchVolume: '', 
        difficulty: '', 
        status: 'Disponível', 
        notes: '', 
        targetMonth: '', 
        targetWords: '',
        internalLinking: '',
        theme: '',
        secondaryKeywords: ''
      });
      loadKeywordsUniverse();
      addToast(id ? "Palavra-chave atualizada" : "Palavra-chave registrada", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    const path = 'keyword_universe';
    try {
      await deleteDoc(doc(db, path, id));
      loadKeywordsUniverse();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const promoteKeywordToPost = async (kw: any) => {
    try {
      setPostForm({
        id: '',
        title: kw.keyword,
        clientName: kw.clientName,
        clientEmail: kw.clientEmail || '',
        targetMonth: kw.targetMonth,
        status: 'Planejado',
        focusKeywords: kw.keyword,
        slug: '',
        description: '',
        content: '',
        coverImage: '',
        category: 'Estratégico',
        anchor: kw.keyword,
        seoTitle: kw.theme || '',
        wordCount: '',
        targetWords: kw.targetWords || '',
        imagesInfo: '',
        publishedAt: '',
        publishedUrl: '',
        internalLinking: kw.internalLinking || '',
        theme: kw.theme || '',
        secondaryKeywords: kw.secondaryKeywords || '',
        directioning: kw.notes || '',
        clientComment: ''
      });

      if (kw.id) {
        await updateDoc(doc(db, 'keyword_universe', kw.id), {
          status: 'Em Produção'
        });
        loadKeywordsUniverse();
      }

      setShowPostForm(true);
    } catch (error) {
      console.error("Erro ao promover planejamento:", error);
    }
  };

  const promoteKeywordToBacklink = async (kw: any) => {
    try {
      setBacklinkForm({
        id: '',
        title: kw.keyword,
        clientName: kw.clientName,
        clientEmail: kw.clientEmail || '',
        targetMonth: kw.targetMonth,
        focusKeywords: kw.keyword,
        anchor: kw.anchor || kw.keyword,
        targetUrl: '',
        theme: kw.theme || '',
        directioning: kw.notes || '',
        content: '',
        status: 'Aguardando Produção',
        publishedAt: '',
        publishedUrl: '',
        wordCount: '',
        targetWords: ''
      });

      if (kw.id) {
        await updateDoc(doc(db, 'keyword_universe', kw.id), {
          status: 'Em Produção'
        });
        loadKeywordsUniverse();
      }

      setShowBacklinkForm(true);
    } catch (error) {
      console.error("Erro ao promover planejamento para backlink:", error);
    }
  };

  const loadBlogPosts = async (force = false) => {
    if (!auth.currentUser || loadingPosts) return;
    if (!force && blogPosts.length > 0 && !shouldReload('posts')) return;
    
    setLoadingPosts(true);
    const path = 'blog_posts';
    try {
      const q = query(collection(db, path), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(50));
      
      const querySnapshot = await getDocs(q);
      const posts: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let currentStatus = data.status;
        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clients.find((c: any) => c.name === data.clientName);
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
            addDoc(collection(db, path, docSnap.id, 'revisions'), {
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
        posts.push({ ...data, id: docSnap.id, status: currentStatus });
      });
      posts.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setBlogPosts(posts);
      markLoaded('posts');
    } catch (error) {
      console.error("Erro ao carregar posts", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const path = 'blog_posts';
    try {
      const { id, ...saveData } = postForm;
      const dataToSave = {
        ...saveData,
        targetWords: saveData.targetWords || '',
        status: 'Rascunho',
        updatedAt: serverTimestamp(),
        agencyUid: auth.currentUser?.uid // Integridade de Identidade
      };
      if (id) {
        await updateDoc(doc(db, path, id), dataToSave);
      } else {
        await addDoc(collection(db, path), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      setShowPostForm(false);
      setPostForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Planejado', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '', clientComment: '' });
      loadBlogPosts();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'blog_posts';
    try {
      if (postForm.id) {
        await updateDoc(doc(db, path, postForm.id), {
          title: postForm.title || '',
          clientName: postForm.clientName || '',
          clientEmail: postForm.clientEmail || '',
          targetMonth: postForm.targetMonth || '',
          slug: postForm.slug || '',
          description: postForm.description || '',
          content: postForm.content || '',
          category: postForm.category || '',
          coverImage: postForm.coverImage || '',
          focusKeywords: postForm.focusKeywords || '',
          anchor: postForm.anchor || '',
          seoTitle: postForm.seoTitle || '',
          wordCount: postForm.wordCount || '',
          targetWords: postForm.targetWords || '',
          imagesInfo: postForm.imagesInfo || '',
          publishedUrl: postForm.publishedUrl || '',
          internalLinking: postForm.internalLinking || '',
          theme: postForm.theme || '',
          secondaryKeywords: postForm.secondaryKeywords || '',
          directioning: postForm.directioning || '',
          status: postForm.status || 'Rascunho',
          clientComment: (postForm.status === 'Aguardando Aprovação' || postForm.status === 'Publicado') ? "" : postForm.clientComment || "",
          publishedAt: postForm.publishedAt || '',
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid
        });
      } else {
        await addDoc(collection(db, path), {
          title: postForm.title || '',
          clientName: postForm.clientName || '',
          clientEmail: postForm.clientEmail || '',
          targetMonth: postForm.targetMonth || '',
          slug: postForm.slug || '',
          description: postForm.description || '',
          content: postForm.content || '',
          category: postForm.category || '',
          coverImage: postForm.coverImage || '',
          focusKeywords: postForm.focusKeywords || '',
          anchor: postForm.anchor || '',
          seoTitle: postForm.seoTitle || '',
          wordCount: postForm.wordCount || '',
          targetWords: postForm.targetWords || '',
          imagesInfo: postForm.imagesInfo || '',
          publishedUrl: postForm.publishedUrl || '',
          internalLinking: postForm.internalLinking || '',
          theme: postForm.theme || '',
          secondaryKeywords: postForm.secondaryKeywords || '',
          directioning: postForm.directioning || '',
          status: postForm.status || 'Rascunho',
          publishedAt: postForm.publishedAt || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
      }
      setShowPostForm(false);
      setPostForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Planejado', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '', clientComment: '' });
      loadBlogPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePostStatus = async (id: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };

      // Limpar comentários ao voltar para produção ou enviar para aprovação
      if (newStatus === 'Em Produção' || newStatus === 'Aguardando Aprovação') {
        updateData.clientComment = "";
      }

      await updateDoc(doc(db, 'blog_posts', id), updateData);

      // Notificar o cliente se estiver aguardando aprovação
      if (newStatus === 'Aguardando Aprovação') {
        const post = blogPosts.find(p => p.id === id);
        if (post) {
          const client = clients.find((c: any) => c.clientEmail === post.clientEmail);
          await addDoc(collection(db, 'notifications'), {
            userId: client?.uid || '', // UID do cliente se disponível
            clientEmail: post.clientEmail,
            title: 'Conteúdo para Aprovação',
            message: `O artigo "${post.title}" está pronto e aguardando sua revisão e aprovação.`,
            type: 'warning',
            category: 'aprovação',
            read: false,
            createdAt: serverTimestamp()
          });
        }
      }

      // Registrar histórico de revisão
      await addDoc(collection(db, 'blog_posts', id, 'revisions'), {
        status: newStatus,
        author: auth.currentUser?.email || 'Agência',
        timestamp: serverTimestamp(),
        type: 'status_change',
        message: `Status alterado para: ${newStatus}`
      });

      loadBlogPosts();
    } catch (error) {
      console.error("Erro ao atualizar status do post:", error);
    }
  };

  const updateBacklinkStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'backlinks', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Notificar o cliente se estiver agendado/publicado
      if (newStatus === 'Publicado') {
        const link = backlinks.find(b => b.id === id);
        if (link) {
          const client = clients.find((c: any) => c.name === link.clientName);
          await addDoc(collection(db, 'notifications'), {
            userId: client?.uid || '',
            clientEmail: client?.clientEmail || '',
            title: 'Backlink Publicado!',
            message: `O link para "${link.anchor}" foi publicado com sucesso. Confira em seu painel.`,
            type: 'success',
            category: 'tráfego',
            read: false,
            createdAt: serverTimestamp()
          });
        }
      }

      loadBacklinks();
    } catch (error) {
      console.error("Erro ao atualizar status do backlink:", error);
    }
  };

  const handleDeletePost = async (id: string, coverImageUrl?: string) => {
    if(!id) return;
    const path = 'blog_posts';
    try {
      if (coverImageUrl && coverImageUrl.includes('firebasestorage')) {
        try {
          const fileRef = ref(storage, coverImageUrl);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.error("Erro ao excluir imagem do storage", storageErr);
        }
      }
      await deleteDoc(doc(db, path, id));
      loadBlogPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const loadBacklinks = async (force = false) => {
    if (!auth.currentUser || loadingBacklinks) return;
    if (!force && backlinks.length > 0 && !shouldReload('backlinks')) return;
    
    setLoadingBacklinks(true);
    const path = 'backlinks';
    try {
      const q = query(collection(db, path), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(50));
      
      const querySnapshot = await getDocs(q);
      const links: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let currentStatus = data.status;
        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clients.find((c: any) => c.name === data.clientName);
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
            addDoc(collection(db, path, docSnap.id, 'revisions'), {
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
        links.push({ ...data, id: docSnap.id, status: currentStatus });
      });
      links.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setBacklinks(links);
      markLoaded('backlinks');
    } catch (error) {
      console.error("Erro ao carregar backlinks", error);
    } finally {
      setLoadingBacklinks(false);
    }
  };

  const handleSaveBacklink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'backlinks';
    try {
      if (backlinkForm.id) {
        await updateDoc(doc(db, path, backlinkForm.id), {
          title: backlinkForm.title || '',
          clientName: backlinkForm.clientName || '',
          clientEmail: backlinkForm.clientEmail || '',
          targetMonth: backlinkForm.targetMonth || '',
          focusKeywords: backlinkForm.focusKeywords || '',
          anchor: backlinkForm.anchor || '',
          targetUrl: backlinkForm.targetUrl || '',
          theme: backlinkForm.theme || '',
          directioning: backlinkForm.directioning || '',
          content: backlinkForm.content || '',
          status: backlinkForm.status || 'Aguardando Produção',
          publishedAt: backlinkForm.publishedAt || '',
          publishedUrl: backlinkForm.publishedUrl || '',
          wordCount: backlinkForm.wordCount || '',
          targetWords: backlinkForm.targetWords || '',
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid
        });
      } else {
        await addDoc(collection(db, path), {
          title: backlinkForm.title || '',
          clientName: backlinkForm.clientName || '',
          clientEmail: backlinkForm.clientEmail || '',
          targetMonth: backlinkForm.targetMonth || '',
          focusKeywords: backlinkForm.focusKeywords || '',
          anchor: backlinkForm.anchor || '',
          targetUrl: backlinkForm.targetUrl || '',
          theme: backlinkForm.theme || '',
          directioning: backlinkForm.directioning || '',
          content: backlinkForm.content || '',
          status: backlinkForm.status || 'Aguardando Produção',
          publishedAt: backlinkForm.publishedAt || '',
          publishedUrl: backlinkForm.publishedUrl || '',
          wordCount: backlinkForm.wordCount || '',
          targetWords: backlinkForm.targetWords || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
      }
      setShowBacklinkForm(false);
      setBacklinkForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Aguardando Produção', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
      loadBacklinks();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBacklink = async (id: string) => {
    const path = 'backlinks';
    try {
      await deleteDoc(doc(db, path, id));
      loadBacklinks();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const loadContactLeads = async (isLoadMore = false) => {
    if (loadingLeads || contactLoadingMore) return;
    if (isLoadMore) setContactLoadingMore(true);
    
    try {
      const constraints = buildLeadQueryConstraints(contactDateFilter, isLoadMore ? contactLastDoc : null);
      const q = query(collection(db, 'contacts'), ...constraints);
      const querySnapshot = await getDocs(q);
      const leads: any[] = [];
      querySnapshot.forEach((doc) => {
        leads.push({ id: doc.id, ...doc.data() });
      });
      
      setContactLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setContactHasMore(querySnapshot.docs.length === LEAD_PAGE_SIZE);
      
      if (isLoadMore) {
         setContactLeads(prev => [...prev, ...leads]);
      } else {
         setContactLeads(leads);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'contacts');
    } finally {
      setContactLoadingMore(false);
    }
  };

  const loadAuditLeads = async (isLoadMore = false) => {
    if (loadingLeads || auditLoadingMore) return;
    if (isLoadMore) setAuditLoadingMore(true);
    else setLoadingLeads(true);
    
    try {
      const constraints = buildLeadQueryConstraints(auditDateFilter, isLoadMore ? auditLastDoc : null);
      const q = query(collection(db, 'audit_leads'), ...constraints);
      const querySnapshot = await getDocs(q);
      const leads: any[] = [];
      querySnapshot.forEach((doc) => {
        leads.push({ id: doc.id, ...doc.data() });
      });
      
      setAuditLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setAuditHasMore(querySnapshot.docs.length === LEAD_PAGE_SIZE);

      if (isLoadMore) {
         setAuditLeads(prev => [...prev, ...leads]);
      } else {
         setAuditLeads(leads);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'audit_leads');
    } finally {
      setLoadingLeads(false);
      setAuditLoadingMore(false);
    }
  };

  const loadSeoPages = async (force = false) => {
    if (!auth.currentUser || loadingSeo) return;
    if (!force && seoPages.length > 0 && !shouldReload('seo')) return;
    
    setLoadingSeo(true);
    const path = 'seo_pages';
    try {
      const q = query(collection(db, path), where('agencyUid', '==', auth.currentUser.uid), limit(400));
      
      const querySnapshot = await getDocs(q);
      const pages: any[] = [];
      querySnapshot.forEach((doc) => {
        pages.push({ ...doc.data(), id: doc.id });
      });
      pages.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setSeoPages(pages);
      markLoaded('seo');
    } catch (error) {
      console.error("Erro ao carregar monitoramento SEO", error);
    } finally {
      setLoadingSeo(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const path = 'seo_pages';
    try {
      if (seoForm.id) {
        await updateDoc(doc(db, path, seoForm.id), {
          url: seoForm.url || '',
          title: seoForm.title || '',
          description: seoForm.description || '',
          customNotes: seoForm.customNotes || '',
          clientName: selectedHubClient || '',
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid
        });
      } else {
        await addDoc(collection(db, path), {
          url: seoForm.url || '',
          title: seoForm.title || '',
          description: seoForm.description || '',
          customNotes: seoForm.customNotes || '',
          clientName: selectedHubClient || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
      }
      setShowSeoForm(false);
      setSeoForm({ id: '', url: '', title: '', description: '', customNotes: '' });
      loadSeoPages();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSeo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'seo_pages', id));
      loadSeoPages();
    } catch (error) {
      console.error("Erro deletando", error);
      addToast("Erro ao excluir monitoramento.", "error");
    }
  };

  const filteredSeoPages = seoPages.filter(p => (p.url.toLowerCase().includes(seoSearch.toLowerCase()) || p.title.toLowerCase().includes(seoSearch.toLowerCase())) && (!selectedHubClient || p.clientName === selectedHubClient));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500/30 selection:text-white flex flex-col md:flex-row">
      <Helmet>
        <title>Painel da Agência | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 z-50 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0">
            <img src={logoUrl} alt="Acelera SEO" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black tracking-tighter text-slate-900 uppercase leading-none mb-0.5">
              Acelera<span className="text-brand-600">SEO</span>
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin Central</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/portal-cliente')}
            className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-brand-600 shadow-sm transition-all active:scale-95"
            title="Ver Portal do Cliente"
          >
            <Users size={18} />
          </button>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Unified Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-300 ease-in-out h-screen md:sticky md:top-0 select-none
        ${showMobileMenu ? 'translate-x-0 w-[85vw]' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'md:w-18' : 'md:w-72'}
      `}>
        {/* Header/Logo */}
        <div className={`py-3.5 flex items-center border-b border-slate-50 shrink-0 transition-all ${isSidebarCollapsed ? 'px-2 justify-center' : 'px-4 justify-between'}`}>
          {!isSidebarCollapsed && (
            <Link to="/" className="flex items-center group gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <img src={logoUrl} alt="Acelera SEO" className="w-full h-full object-contain p-1" />
              </div>
              <div className="min-w-0 transition-opacity duration-200">
                <span className="text-base font-black tracking-tight text-slate-900 block leading-tight truncate">ACELERA<span className="text-brand-600">SEO</span></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block leading-none mt-0.5 truncate">Admin Central</span>
              </div>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={() => {
                const next = !isSidebarCollapsed;
                setIsSidebarCollapsed(next);
                try {
                  localStorage.setItem('admin_sidebar_collapsed', String(next));
                } catch {
                  // ignore
                }
              }}
              title={isSidebarCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
              className={`hidden md:flex p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors items-center justify-center ${isSidebarCollapsed ? 'w-full' : ''}`}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={16} />}
            </button>

            {/* Mobile close button */}
            <button onClick={() => setShowMobileMenu(false)} className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className={`pt-3 pb-2 shrink-0 transition-all ${isSidebarCollapsed ? 'px-2' : 'px-3.5'}`}>
          {isSidebarCollapsed ? (
            <div className="flex flex-col gap-1.5 bg-slate-100/70 border border-slate-200/50 rounded-xl p-1">
              {[
                { id: 'agencia', label: 'Agência', icon: Building2 },
                { id: 'clientes', label: 'Clientes', icon: Users }
              ].map(ws => (
                <button
                  key={ws.id}
                  title={`Workspace: ${ws.label}`}
                  onClick={() => { 
                    setSidebarWorkspace(ws.id as any);
                    setActiveTab(ws.id === 'agencia' ? 'Conteúdo Interno (Acelera)' : 'Hub de Clientes');
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${sidebarWorkspace === ws.id ? 'bg-white text-brand-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <ws.icon size={15} />
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-slate-100/70 border border-slate-200/50 rounded-xl p-1 flex gap-1 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-lg shadow-xs border border-slate-200/40 transition-all duration-300 ease-out z-0 ${sidebarWorkspace === 'clientes' ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0'}`}
              />
              {[
                { id: 'agencia', label: 'Agência', icon: Building2 },
                { id: 'clientes', label: 'Clientes', icon: Users }
              ].map(ws => (
                <button
                  key={ws.id}
                  onClick={() => { 
                    setSidebarWorkspace(ws.id as any);
                    setActiveTab(ws.id === 'agencia' ? 'Conteúdo Interno (Acelera)' : 'Hub de Clientes');
                  }}
                  className={`relative z-10 flex-1 py-2 px-1 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${sidebarWorkspace === ws.id ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}
                >
                  <ws.icon size={14} />
                  <span className="text-[10px] uppercase tracking-wider leading-none">{ws.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Area */}
        <nav className={`flex-1 py-1 space-y-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {/* Contextual Filters for Clients Workspace */}
          {sidebarWorkspace === 'clientes' && !isSidebarCollapsed && (
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="min-w-0">
                  <p className="px-0.5 mb-1 text-[7.5px] font-black uppercase tracking-wider text-slate-400 truncate">Unidade</p>
                  <div className="relative group/client">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/client:text-brand-600 transition-colors pointer-events-none">
                      <Users size={11} />
                    </div>
                    <select
                      value={selectedHubClient}
                      onChange={(e) => {
                        setSelectedHubClient(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200/70 rounded-lg pl-6 pr-4 py-1 text-[9.5px] font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none appearance-none transition-all cursor-pointer shadow-2xs hover:border-slate-300 truncate h-7"
                    >
                      <option value="">Todas as Unidades</option>
                      {clientsList.filter(c => c !== 'Agência').map(client => (
                        <option key={client} value={client}>{client}</option>
                      ))}
                    </select>
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown size={9} />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="px-0.5 mb-1 text-[7.5px] font-black uppercase tracking-wider text-slate-400 truncate">Ciclo</p>
                  <div className="relative group/cycle">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/cycle:text-brand-600 transition-colors pointer-events-none z-10">
                      <Calendar size={11} />
                    </div>
                    <div className="w-full bg-white border border-slate-200/70 rounded-lg pl-6 pr-1.5 py-1 text-[9px] font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex items-center h-7 truncate">
                      <span className="uppercase truncate">{formatCycleDate(selectedCycle)}</span>
                    </div>
                    <input 
                      type="month"
                      value={selectedCycle}
                      onChange={(e) => setSelectedCycle(e.target.value)}
                      className="month-picker-overlay z-20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {selectedHubClient && (
                <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    <span className="text-[9.5px] font-bold text-slate-700 truncate">{selectedHubClient}</span>
                  </div>
                  <button
                    onClick={() => setSelectedHubClient('')}
                    className="text-[8.5px] font-semibold text-slate-400 hover:text-rose-600 transition-colors shrink-0 ml-1"
                    title="Limpar filtro de unidade"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Contextual Filters for Agency Workspace */}
          {sidebarWorkspace === 'agencia' && !isSidebarCollapsed && (
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2 mb-3">
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-1 px-0.5">
                  <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 truncate">Ciclo / Mês de Produção</p>
                  {selectedCycle && (
                    <button 
                      onClick={() => setSelectedCycle('')}
                      className="text-[8px] font-semibold text-slate-400 hover:text-brand-600 transition-colors"
                      title="Exibir todos os meses"
                    >
                      Todos
                    </button>
                  )}
                </div>
                <div className="relative group/cycle">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/cycle:text-brand-600 transition-colors pointer-events-none z-10">
                    <Calendar size={11} />
                  </div>
                  <div className="w-full bg-white border border-slate-200/70 rounded-lg pl-6 pr-1.5 py-1 text-[9px] font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex items-center h-7 truncate">
                    <span className="uppercase truncate">{selectedCycle ? formatCycleDate(selectedCycle) : 'Todos os Ciclos'}</span>
                  </div>
                  <input 
                    type="month"
                    value={selectedCycle}
                    onChange={(e) => setSelectedCycle(e.target.value)}
                    className="month-picker-overlay z-20 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="space-y-3">
            {sidebarWorkspace === 'clientes' && (
              <div>
                {/* Seção 1: Painéis de Controle */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Painéis de Controle</p>
                  )}
                  <div className="space-y-0.5">
                    {[
                      { label: 'Visão Geral (BI)', icon: Activity, id: 'Visão Geral' },
                      { label: 'Hub de Unidades', icon: LayoutGrid, id: 'Hub de Clientes' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'justify-between px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === item.id ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                          <item.icon size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === item.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'}`} />
                          {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed && activeTab === item.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
                        )}
                        {isSidebarCollapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                            {item.label}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção 2: Esteira de Performance */}
                <div className="mt-3">
                  {!isSidebarCollapsed && (
                    <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Esteira de Performance</p>
                  )}
                  <div className={`space-y-0.5 ${isSidebarCollapsed ? 'mt-2 pt-2 border-t border-slate-100' : ''}`}>
                    {[
                      { label: 'Planejamento', icon: Calendar, id: 'Planejamento' },
                      { label: 'Célula Conteúdo', icon: FileText, id: 'Artigos e Conteúdos' },
                      { label: 'Gestão Off-Page', icon: LinkIcon, id: 'Backlinks' },
                      { label: 'Aprovações', icon: Clock, id: 'Aprovações Pendentes', badge: pendingPostsCount },
                      { label: 'Monitoramento', icon: Globe2, id: 'Monitoramento de Rankings' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'justify-between px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === item.id ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                          <item.icon size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === item.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'}`} />
                          {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed ? (
                          <div className="flex items-center gap-1.5">
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${activeTab === item.id ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'}`}>
                                {item.badge}
                              </span>
                            )}
                            {activeTab === item.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
                            )}
                          </div>
                        ) : (
                          item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
                          )
                        )}
                        {isSidebarCollapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                            {item.label} {item.badge ? `(${item.badge})` : ''}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção 3: Gestão Operacional da Unidade */}
                {selectedHubClient && (
                  <div className={`mt-3 ${isSidebarCollapsed ? 'pt-2 border-t border-slate-100' : ''}`}>
                    {!isSidebarCollapsed && (
                      <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Gestão Operacional</p>
                    )}
                    <button
                      onClick={() => { 
                        const client = clients.find(c => c.name === selectedHubClient);
                        if (client) {
                          setClientForm({
                            ...client,
                            packageValue: String(client.packageValue || '0'),
                            currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7),
                            onDemandItems: client.onDemandItems || []
                          });
                          setActiveTab('Configurações Unidade');
                          if (window.innerWidth < 768) setShowMobileMenu(false);
                        }
                      }}
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'gap-2.5 px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === 'Configurações Unidade' ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                    >
                      <Settings size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === 'Configurações Unidade' ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'}`} />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Ajustes Unidade</span>}
                      {isSidebarCollapsed && (
                        <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                          Ajustes Unidade
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {sidebarWorkspace === 'agencia' && (
              <div className="space-y-3">
                {/* Seção 1: Operação & Conteúdo */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Operação & Conteúdo</p>
                  )}
                  <div className="space-y-0.5">
                    {[
                      { label: 'Crescimento & Conteúdo', icon: TrendingUp, id: 'Conteúdo Interno (Acelera)' },
                      { label: 'Clientes', icon: Users, id: 'Clientes & CRM' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'justify-between px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === item.id ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                          <item.icon size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === item.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'}`} />
                          {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed && activeTab === item.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
                        )}
                        {isSidebarCollapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                            {item.label}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção 2: Administração & Finanças */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Administração & Finanças</p>
                  )}
                  <div className={`space-y-0.5 ${isSidebarCollapsed ? 'mt-2 pt-2 border-t border-slate-100' : ''}`}>
                    {[
                      { label: 'Saúde Financeira', icon: DollarSign, id: 'Financeiro' },
                      { label: 'Suporte Técnico', icon: MessageSquareText, id: 'Suporte Técnico Admin', badge: pendingTicketsCount },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'justify-between px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === item.id ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                          <item.icon size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === item.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'}`} />
                          {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed ? (
                          <div className="flex items-center gap-1.5">
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${activeTab === item.id ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'}`}>
                                {item.badge}
                              </span>
                            )}
                            {activeTab === item.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
                            )}
                          </div>
                        ) : (
                          item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
                          )
                        )}
                        {isSidebarCollapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                            {item.label} {item.badge ? `(${item.badge})` : ''}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção 3: Sistema & Ajustes */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-3 mb-1 text-[8.5px] font-bold uppercase tracking-wider text-slate-400/70">Sistema & Ajustes</p>
                  )}
                  <div className={`space-y-0.5 ${isSidebarCollapsed ? 'mt-2 pt-2 border-t border-slate-100' : ''}`}>
                    {[
                      { label: 'Taxonomia', icon: Layers, id: 'Categorias' },
                      { label: 'Ajustes Master', icon: Shield, id: 'Configurações' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 relative group/collapsed' : 'gap-2.5 px-3 py-2'} rounded-xl transition-all duration-200 text-[12.5px] font-semibold group ${activeTab === item.id ? 'bg-brand-50/90 text-brand-700 font-bold border-l-3 border-brand-600 pl-[9px]' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/40'}`}
                      >
                        <item.icon size={16} strokeWidth={2} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${activeTab === item.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} ${isSidebarCollapsed ? '' : 'shrink-0'}`} />
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        {isSidebarCollapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 z-50 hidden group-hover/collapsed:flex items-center bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                            {item.label}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer - Compact Unified Card */}
        <div className={`bg-slate-50/80 border-t border-slate-100 shrink-0 transition-all ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div 
                title={`${auth.currentUser?.email || 'Admin'} (Online)`}
                className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 relative cursor-default"
              >
                <Building2 size={15} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <button 
                title="Finalizar Sessão"
                onClick={async () => {
                  await signOut(auth);
                  navigate('/');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/70 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <Building2 size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                    {auth.currentUser?.email?.split('@')[0] || 'Admin'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Online</span>
                  </div>
                </div>
              </div>

              <button 
                title="Finalizar Sessão"
                onClick={async () => {
                  await signOut(auth);
                  navigate('/');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative z-10 flex flex-col md:bg-[#F8FAFC]/50 overflow-y-auto no-scrollbar">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 transition-all duration-500 w-full">
          <header className="hidden md:flex items-center justify-between mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs bg-brand-600">
                  {sidebarWorkspace === 'agencia' ? <Building2 size={18} /> :
                   activeTab === 'Visão Geral' ? <Activity size={18} /> :
                   <Users size={18} />}
                </div>
                <div className="h-px w-6 bg-slate-200"></div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{activeTab}</h1>
              </div>
              <Breadcrumbs workspace={sidebarWorkspace} activeTab={activeTab} />
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Status</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] font-bold text-slate-900">Sync Active</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all border ${
                      showNotifications ? 'bg-brand-600 text-white border-brand-500' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                      >
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Notificações da Agência</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={async () => {
                                const unread = notifications.filter(n => !n.read);
                                for(const n of unread) await markNotificationAsRead(n.id);
                              }}
                              className="text-[9px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-700 underline underline-offset-4"
                            >
                              Visto
                            </button>
                          )}
                        </div>

                        <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                              <Bell size={24} className="mx-auto mb-3 text-slate-200" />
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Sem novas notificações</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-50">
                              {notifications.map((notif) => (
                                <div 
                                  key={notif.id}
                                  onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notif.read ? 'bg-brand-50/20' : 'opacity-60'}`}
                                >
                                  {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full" />}
                                  <div className="flex gap-3">
                                     <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                                       notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                       notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                       'bg-brand-100 text-brand-600'
                                     }`}>
                                       {notif.category === 'pagamento' ? <DollarSign size={14} /> : <Zap size={14} />}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{notif.title}</h4>
                                          <span className="text-[7px] font-bold text-slate-400 whitespace-nowrap ml-2">
                                            {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
                                          </span>
                                        </div>
                                        <p className="text-[10px] leading-tight text-slate-500 line-clamp-2">{notif.message}</p>
                                     </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => navigate('/portal-cliente')} 
                  className="bg-white border border-slate-100 text-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <LayoutGrid size={13} /> Portal do Cliente
                </button>
              </div>
            </div>
          </header>

        {isChangingTab ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[500px] flex flex-col items-center justify-center py-24 text-center w-full bg-transparent"
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100/80 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-8 text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase animate-pulse font-sans">Carregando painel...</p>
            <p className="mt-2 text-[10px] text-slate-300 font-mono">Processando dados e layouts da agência</p>
          </motion.div>
        ) : activeTab === 'Categorias' ? (
          <CategoriesManagerView
            categories={categories}
            loadingCategories={loadingCategories}
            loadCategories={loadCategories}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            showCategoryForm={showCategoryForm}
            setShowCategoryForm={setShowCategoryForm}
            handleSaveCategory={handleSaveCategory}
            handleDeleteCategory={handleDeleteCategory}
            isSaving={isSaving}
          />
        ) : activeTab === 'Visão Geral' ? (
          <ClientOverview
            selectedHubClient={selectedHubClient}
            selectedCycle={selectedCycle}
            clients={clients}
            blogPosts={blogPosts}
            backlinks={backlinks}
            sidebarWorkspace={sidebarWorkspace}
            setActiveTab={setActiveTab}
            setShowPostForm={setShowPostForm}
            setPostForm={setPostForm}
            setShowBacklinkForm={setShowBacklinkForm}
            setBacklinkForm={setBacklinkForm}
          />
        ) : activeTab === 'Clientes & CRM' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16">
            
            {/* Suspense wrapper for ClientModal */}
            <Suspense fallback={null}>
              <ClientModal
                showClientForm={showClientForm}
                setShowClientForm={setShowClientForm}
                clientForm={clientForm}
                setClientForm={setClientForm}
                handleSaveClient={handleSaveClient}
                isSaving={isSaving}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            </Suspense>

            {/* Gestão Direta de Parceiros Ativos */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
              
              {/* Header da Seção */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Parceiros Ativos</h2>
                    <button 
                      onClick={() => loadClients(true)} 
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-800"
                      title="Sincronizar parceiros"
                    >
                      <RefreshCcw size={16} className={`${loadingClients ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">Gestão estratégica, dados cadastrais e pacote de entregáveis contratados.</p>
                </div>
                
                <button 
                  onClick={() => {
                    setClientForm({ 
                      id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', 
                      monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', 
                      active: true, approvalDeadlineDays: '5', websiteUrl: '', logoUrl: '', 
                      lastPaymentMonth: '', extraMonth: '', extraPosts: '0', extraBacklinks: '0', 
                      extraDevHours: '0', taxId: '', contactName: '', phone: '', additionalPhone: '', 
                      packageName: '', packageValue: '0', currentCycleDate: new Date().toISOString().slice(0, 7), 
                      onDemandItems: [] 
                    });
                    setShowClientForm(true);
                  }} 
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-5 py-3 shadow-sm transition-all active:scale-95"
                >
                  <Plus size={16} /> Cadastrar Novo Parceiro
                </button>
              </div>

              {/* Tabela Desktop */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/70 text-xs font-bold text-slate-500 border-b border-slate-200/80">
                      <th className="px-6 py-4">Parceiro & Domínio</th>
                      <th className="px-6 py-4 text-center">Portal do Cliente</th>
                      <th className="px-6 py-4">Plano & Faturamento</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingClients ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={`skel-client-${i}`}>
                          <td className="px-6 py-4">
                            <Skeleton variant="rectangular" className="h-6 w-48 mb-2" />
                            <Skeleton variant="text" className="w-32" />
                          </td>
                          <td className="px-6 py-4 text-center"><Skeleton variant="rectangular" className="h-6 w-24 mx-auto" /></td>
                          <td className="px-6 py-4"><Skeleton variant="rectangular" className="h-10 w-40" /></td>
                          <td className="px-6 py-4 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                        </tr>
                      ))
                    ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-16 text-slate-400 font-medium text-xs">
                          Nenhum parceiro cadastrado no momento.
                        </td>
                      </tr>
                    ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                      <tr key={client.id} className="hover:bg-slate-50/60 transition-colors group">
                        
                        {/* Coluna 1: Nome & Domínio */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border transition-all ${
                              client.logoUrl ? "bg-white border-slate-200" : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}>
                              {client.logoUrl ? (
                                <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                              ) : (
                                <Building2 size={20} />
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block group-hover:text-brand-600 transition-colors">
                                {client.name}
                              </span>
                              {client.websiteUrl ? (
                                <a 
                                  href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-slate-400 hover:text-brand-600 font-mono inline-flex items-center gap-1 mt-0.5 transition-colors"
                                >
                                  {client.websiteUrl.replace(/^https?:\/\//, '')}
                                  <ExternalLink size={11} />
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Sem domínio cadastrado</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Coluna 2: Status do Portal */}
                        <td className="px-6 py-4 text-center">
                          {client.uid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Portal Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              Aguardando Acesso
                            </span>
                          )}
                        </td>

                        {/* Coluna 3: Pacote & Pagamento */}
                        <td className="px-6 py-4">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-900 block truncate max-w-[180px]">
                                {client.packageName || 'Plano Personalizado'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  Venc. Dia {client.billingDay || 10}
                                </span>
                                {(() => {
                                  const status = getPaymentStatus(client);
                                  const Icon = status.icon;
                                  return (
                                    <button 
                                      onClick={() => handleTogglePayment(client)} 
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${status.color} ${status.bg} hover:opacity-80`}
                                      title="Clique para gerenciar mensalidades"
                                    >
                                      <Icon size={11} /> {status.label}
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="text-right border-l border-slate-200 pl-4">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mensalidade</span>
                              <span className="text-sm font-bold text-slate-900">
                                R$ {(Number(client.packageValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Coluna 4: Ações */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setClientForm({ 
                                  ...client, 
                                  currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), 
                                  onDemandItems: client.onDemandItems || [], 
                                  packageValue: String(client.packageValue || '0') 
                                });
                                setShowClientForm(true);
                              }}
                              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-200"
                              title="Editar Parceiro"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Excluir Parceiro"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="md:hidden space-y-4">
                {loadingClients ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={`skel-cl-mob-${i}`} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton variant="circular" className="w-12 h-12" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton variant="rectangular" className="h-5 w-3/4 rounded" />
                          <Skeleton variant="text" className="w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-slate-200">
                    Nenhum parceiro cadastrado no momento.
                  </div>
                ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                  <div key={client.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border shrink-0 ${
                          client.logoUrl ? "bg-white border-slate-200" : "bg-slate-100 border-slate-200 text-slate-400"
                        }`}>
                          {client.logoUrl ? (
                            <img src={client.logoUrl} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Building2 size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{client.packageName || 'Plano Customizado'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { 
                          setClientForm({ 
                            ...client, 
                            currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), 
                            onDemandItems: client.onDemandItems || [], 
                            packageValue: String(client.packageValue || '0') 
                          }); 
                          setShowClientForm(true); 
                        }} 
                        className="p-2 text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-xl transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Mensalidade</span>
                        <span className="text-xs font-bold text-slate-900">
                          R$ {(Number(client.packageValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Vencimento</span>
                        <span className="text-xs font-bold text-slate-900">Dia {client.billingDay || 10}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        client.uid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {client.uid ? 'Portal Ativo' : 'Aguardando Cadastro'}
                      </span>
                      {(() => {
                        const status = getPaymentStatus(client);
                        return (
                          <button 
                            onClick={() => handleTogglePayment(client)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </motion.div>
        ) : activeTab === 'Conteúdo Interno (Acelera)' ? (
          <ContentAgency 
             blogPosts={blogPosts} 
             backlinks={backlinks} 
             setPostForm={setPostForm} 
             setShowPostForm={setShowPostForm}
             setBacklinkForm={setBacklinkForm}
             setShowBacklinkForm={setShowBacklinkForm}
             handleDeletePost={handleDeletePost}
             handleDeleteBacklink={handleDeleteBacklink}
             loadBlogPosts={loadBlogPosts}
             loadBacklinks={loadBacklinks}
             showPostForm={showPostForm}
             postForm={postForm}
             handleSavePost={handleSavePost}
             handleSaveDraft={handleSaveDraft}
             showBacklinkForm={showBacklinkForm}
             backlinkForm={backlinkForm}
             handleSaveBacklink={handleSaveBacklink}
             clientsList={clientsList}
             selectedCycle={selectedCycle}
             setSelectedCycle={setSelectedCycle}
             formatCycleDate={formatCycleDate}
          />
        ) : activeTab === 'Hub de Clientes' ? (
          <HubClients
             clientsList={clientsList}
             clients={clients}
             selectedHubClient={selectedHubClient}
             setSelectedHubClient={setSelectedHubClient}
             keywordsUniverse={keywordsUniverse}
             showKeywordForm={showKeywordForm}
             setShowKeywordForm={setShowKeywordForm}
             keywordForm={keywordForm}
             setKeywordForm={setKeywordForm}
             handleSaveKeyword={handleSaveKeyword}
             handleDeleteKeyword={handleDeleteKeyword}
             promoteKeywordToPost={promoteKeywordToPost}
             promoteKeywordToBacklink={promoteKeywordToBacklink}
             blogPosts={blogPosts}
             backlinks={backlinks}
             setPostForm={setPostForm}
             setShowPostForm={setShowPostForm}
             setBacklinkForm={setBacklinkForm}
             setShowBacklinkForm={setShowBacklinkForm}
             handleDeletePost={handleDeletePost}
             handleDeleteBacklink={handleDeleteBacklink}
             loadBlogPosts={loadBlogPosts}
             loadBacklinks={loadBacklinks}
             showPostForm={showPostForm}
             postForm={postForm}
             handleSavePost={handleSavePost}
             handleSaveDraft={handleSaveDraft}
             showBacklinkForm={showBacklinkForm}
             backlinkForm={backlinkForm}
             handleSaveBacklink={handleSaveBacklink}
          />
        ) : activeTab === 'Aprovações Pendentes' ? (
          <ApprovalsView
            blogPosts={blogPosts}
            backlinks={backlinks}
            loadingPosts={loadingPosts}
            loadingBacklinks={loadingBacklinks}
            loadBlogPosts={loadBlogPosts}
            loadBacklinks={loadBacklinks}
            updatePostStatus={updatePostStatus}
            updateBacklinkStatus={updateBacklinkStatus}
            setPostForm={setPostForm}
            setShowPostForm={setShowPostForm}
            setBacklinkForm={setBacklinkForm}
            setShowBacklinkForm={setShowBacklinkForm}
            selectedHubClient={selectedHubClient}
            setSelectedHubClient={setSelectedHubClient}
            clientsList={clientsList}
            handleBulkApprove={handleBulkApprove}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            toggleSelection={toggleSelection}
          />
        ) : activeTab === 'Monitoramento de Rankings' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 lg:p-12 overflow-hidden">
               <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-12">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                      <div className="w-1.5 h-8 bg-brand-600 rounded-full" />
                      Performance <span className="text-brand-500">Orgânica</span>
                      <button 
                        onClick={() => loadSeoPages(true)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900 group ml-2"
                      >
                        <RefreshCcw size={16} className={`${loadingSeo ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                      </button>
                    </h2>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">Rastreamento de Keywords & Vitalidade Técnica</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                      <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Keywords..." 
                        value={seoSearch}
                        onChange={e => setSeoSearch(e.target.value)}
                        className="pl-12 pr-6 bg-slate-50 border border-slate-100/50 rounded-xl text-[10px] font-bold uppercase tracking-widest w-full md:w-60 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all py-3.5 shadow-sm"
                      />
                    </div>
                    <button 
                       onClick={triggerTechnicalAudit} 
                       disabled={isAuditing}
                       className="bg-white border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-slate-900 hover:border-slate-900 transition-all flex items-center px-6 py-3.5 gap-2.5 shadow-sm active:scale-95"
                     >
                       {isAuditing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="text-slate-300" />}
                       {isAuditing ? 'Auditoria' : 'Audit Técnica'}
                    </button>
                    <button onClick={() => setShowSeoForm(true)} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all px-8 py-3.5 shadow-md">
                      Novo Alvo
                    </button>
                 </div>
               </div>

               {showSeoForm && (
                 <motion.form 
                    initial={{ opacity: 0, scale: 0.98, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    onSubmit={handleSaveSeo} className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-8 mb-16 relative">
                    <button type="button" onClick={() => setShowSeoForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors">
                      <Zap size={20} />
                    </button>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{seoForm.id ? 'Refinar Monitoramento' : 'Abertura de Novo Alvo Estratégico'}</h3>
                      <p className="text-slate-400 text-xs mt-1 font-medium">Configure os parâmetros de rastreio para este ativo digital.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Palavra-chave Primary</label>
                        <input required type="text" value={seoForm.title} onChange={e => setSeoForm({...seoForm, title: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" placeholder="Ex: curso de marketing digital" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL Pilar de Destino</label>
                        <input required type="text" value={seoForm.url} onChange={e => setSeoForm({...seoForm, url: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" placeholder="https://seu-dominio.com/pagina-alvo" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notas de Monitoramento</label>
                      <input type="text" value={seoForm.customNotes} onChange={e => setSeoForm({...seoForm, customNotes: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" placeholder="Ex: Monitorar oscilações no Top 3 do Google" />
                    </div>
                    <div className="flex justify-end gap-4 border-t border-slate-200/50 pt-8">
                      <button type="button" onClick={() => {setShowSeoForm(false); setSeoForm({ id: '', url: '', title: '', description: '', customNotes: '' });}} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-6 py-4 hover:text-rose-500 transition-colors">Descartar</button>
                      <button type="submit" className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-12 py-4 hover:bg-brand-600 transition-all shadow-md">Ativar Tracking</button>
                    </div>
                 </motion.form>
               )}

                <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                  {loadingSeo ? (
                    <div className="p-8 space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={`skel-seo-${i}`} className="flex items-center justify-between py-6 border-b border-slate-50 last:border-none">
                          <div className="space-y-2">
                            <Skeleton variant="rectangular" className="h-6 w-64" />
                            <Skeleton variant="text" className="w-48" />
                          </div>
                          <Skeleton variant="rectangular" className="h-8 w-32" />
                          <Skeleton variant="rectangular" className="h-8 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : (
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                         <td className="px-8 py-5">Palavra-chave / Ativo Digital</td>
                         <td className="px-8 py-5 text-center">Status & Vitalidade</td>
                         <td className="px-8 py-5 text-right">Controle</td>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {filteredSeoPages.map(page => (
                         <tr key={page.id} className="group hover:bg-slate-50/30 transition-all">
                           <td className="px-8 py-6">
                             <span className="text-lg font-black text-slate-900 block leading-tight tracking-tight mb-1 group-hover:text-brand-600 transition-colors uppercase">{page.title}</span>
                             <div className="flex items-center gap-2">
                               <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-brand-500 transition-colors"></div>
                               <span className="text-[10px] font-medium text-slate-400 block font-mono truncate max-w-sm">{page.url}</span>
                               <a href={page.url} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-slate-900 transition-colors"><ExternalLink size={12} /></a>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4 justify-center">
                                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest group-hover:bg-brand-50 group-hover:text-brand-600 border border-slate-100 transition-all gap-2">
                                  <TrendingUp size={12} /> {page.customNotes || 'Análise Local'}
                                </div>
                                {page.lastAuditStatus && (
                                  <div className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border tracking-widest flex items-center gap-1.5 ${page.health === 'healthy' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' : 'bg-rose-50 text-rose-500 border-rose-100/50'}`}>
                                    <div className={`w-1 h-1 rounded-full ${page.health === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    HTTP {page.lastAuditStatus}
                                  </div>
                                )}
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                               <button 
                                 onClick={() => { setSeoForm(page); setShowSeoForm(true); }}
                                 className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all"
                               >
                                 <Edit3 size={14} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteSeo(page.id)}
                                 className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-200 hover:text-rose-500 shadow-sm transition-all"
                                >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {filteredSeoPages.length === 0 && (
                         <tr><td colSpan={3} className="text-center py-24 text-slate-300 uppercase text-[10px] font-bold tracking-[0.15em]">Fluxo vazio</td></tr>
                       )}
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'Financeiro' ? (
          <FinancialHealthView
            clients={clients}
            globalPayments={globalPayments}
            loadingGlobalPayments={loadingGlobalPayments}
            loadGlobalPayments={loadGlobalPayments}
            setSelectedClientForPayments={setSelectedClientForPayments}
            setShowPaymentModal={setShowPaymentModal}
            handleConfirmPayment={handleConfirmPayment}
            handleDeletePayment={handleDeletePayment}
            addToast={addToast}
          />
        ) : activeTab === 'Configurações' ? (
          <SettingsGlobal />
        ) : activeTab === 'Artigos e Conteúdos' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
               <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-12">
                 <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Central de Conteúdo</h2>
                      <button 
                        onClick={() => loadBlogPosts(true)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900 group"
                      >
                        <RefreshCcw size={16} className={`${loadingPosts ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] mt-2">Gestão de Produção & Pipeline Editorial</p>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                      <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="pl-12 pr-6 bg-slate-50 border border-slate-100/50 rounded-xl text-[10px] font-bold uppercase tracking-widest w-full md:w-60 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all py-3.5 shadow-sm"
                       />
                     </div>
                     <button onClick={() => {
                      setPostForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: selectedCycle, slug: '', description: '', content: '', coverImage: '', category: 'Geral', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Planejado', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '', clientComment: '' });
                      setShowPostForm(true);
                    }} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all px-8 py-3.5 shadow-md">
                      Novo Planejamento
                    </button>
                 </div>
               </div>

               <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-6 py-5">Conteúdo / Cliente</td>
                        <td className="px-6 py-5">Status</td>
                        <td className="px-6 py-5">Métricas / SEO</td>
                        <td className="px-6 py-5 text-right">Ação</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingPosts ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-post-${i}`}>
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                <Skeleton variant="circular" className="w-1.5 h-1.5" />
                                <div className="space-y-2">
                                  <Skeleton variant="rectangular" className="h-6 w-72" />
                                  <Skeleton variant="rectangular" className="h-4 w-20" />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6"><Skeleton variant="rectangular" className="h-6 w-24" /></td>
                            <td className="px-6 py-6"><Skeleton variant="rectangular" className="h-8 w-32" /></td>
                            <td className="px-6 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : blogPosts.filter(p => !selectedHubClient || p.clientName === selectedHubClient).length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-20 text-slate-300 uppercase text-[10px] font-bold tracking-[0.15em]">Nenhum artigo localizado</td></tr>
                      ) : blogPosts.filter(p => !selectedHubClient || p.clientName === selectedHubClient).map((post: any) => (
                        <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-6 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
                              <div className="flex flex-col">
                                <span className="text-lg font-black text-slate-900 block leading-tight tracking-tight mb-1 group-hover:text-brand-600 transition-colors uppercase max-w-[500px] truncate">{post.title}</span>
                                {post.status === 'Planejado' && (
                                  <button 
                                    onClick={() => { setPostForm({ clientComment: '', ...post }); setShowPostForm(true); }}
                                    className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-100 transition-colors w-fit"
                                  >
                                    <Zap size={10} className="fill-brand-600" />
                                    Desenvolver Conteúdo
                                  </button>
                                )}
                                <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md uppercase tracking-[0.1em] w-fit">{post.clientName || 'Geral'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${
                              post.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                              post.status === 'Aguardando Aprovação' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                              post.status === 'Ajustes Necessários' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              post.status === 'Aprovado' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                              {post.status}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex flex-col gap-1">
                               <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{post.category || 'Geral'}</span>
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{post.wordCount || 0} / {post.targetWords || 0} pal.</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                     post.seoScore === 'good' ? 'bg-emerald-500' : 
                                     post.seoScore === 'ok' ? 'bg-amber-500' : 
                                     post.seoScore === 'bad' ? 'bg-rose-500' : 
                                     'bg-slate-200'
                                  }`} title={`SEO: ${post.seoScore || 'N/A'}`}></div>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                 {['Em Produção', 'Rascunho', 'Ajustes Necessários', 'Planejado'].includes(post.status) && (
                                   <button 
                                     onClick={() => {
                                       const confirm = window.confirm('Deseja enviar este conteúdo para a aprovação do cliente? ele será notificado em seu portal.');
                                       if(confirm) updatePostStatus(post.id, 'Aguardando Aprovação');
                                     }}
                                     title="Enviar p/ Aprovação do Cliente"
                                     className="p-2.5 bg-brand-50 border border-brand-100 rounded-lg text-brand-600 hover:bg-brand-600 hover:text-white shadow-sm transition-all"
                                   >
                                     <Send size={14} />
                                   </button>
                                 )}
                                 {post.publishedUrl && (
                                   <a href={post.publishedUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all"><ExternalLink size={14} /></a>
                                 )}
                                 <button onClick={() => { setPostForm({ clientComment: '', ...post }); setShowPostForm(true); }} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all"><Edit3 size={14} /></button>
                                 <button onClick={() => handleDeletePost(post.id, post.coverImage)} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-200 hover:text-rose-500 shadow-sm transition-all"><Trash2 size={14} /></button>
                              </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'Backlinks' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
               <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-12">
                 <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Monitoramento de Links</h2>
                      <button 
                        onClick={() => loadBacklinks(true)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900 group"
                      >
                        <RefreshCcw size={16} className={`${loadingBacklinks ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] mt-2">Autoridade de Domínio & Growth Off-Page</p>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-4">
                    <button onClick={() => {
                      setBacklinkForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: selectedCycle, focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Aguardando Produção', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
                      setShowBacklinkForm(true);
                    }} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all px-8 py-3.5 shadow-md">
                      Novo Backlink
                    </button>
                 </div>
               </div>

               <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                       <td className="px-8 py-5">Âncora / Keyword</td>
                       <td className="px-8 py-5">Cliente</td>
                       <td className="px-8 py-5">Status & Destino</td>
                       <td className="px-8 py-5 text-right">Ação</td>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {loadingBacklinks ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-backlink-${i}`}>
                             <td className="px-8 py-6">
                               <Skeleton variant="rectangular" className="h-6 w-64 mb-2" />
                               <Skeleton variant="text" className="w-48" />
                             </td>
                             <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-6 w-24" /></td>
                             <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-10 w-40" /></td>
                             <td className="px-8 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                          </tr>
                        ))
                     ) : backlinks.filter(b => !selectedHubClient || b.clientName === selectedHubClient).length === 0 ? (
                       <tr><td colSpan={4} className="text-center py-24 text-slate-300 uppercase tracking-[0.15em] font-bold text-[10px]">Nenhuma estratégia off-page ativa</td></tr>
                     ) : backlinks.filter(b => !selectedHubClient || b.clientName === selectedHubClient).map((link: any) => (
                       <tr key={link.id} className="group hover:bg-slate-50/30 transition-all border-b border-slate-50 last:border-none">
                         <td className="px-8 py-6">
                           <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight mb-1 group-hover:text-brand-600 transition-colors uppercase max-w-[480px] truncate">{link.anchor || link.focusKeywords || 'Link Estratégico'}</span>
                           <span className="text-[10px] font-medium text-slate-400 block tracking-tight italic line-clamp-1 max-w-[400px]">"{link.theme || 'Temática não definida'}"</span>
                         </td>
                         <td className="px-8 py-6">
                           <span className="text-[9px] font-bold bg-brand-50 text-brand-700 border border-brand-100/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">{link.clientName}</span>
                         </td>
                         <td className="px-8 py-6">
                           <div className="flex flex-col gap-2">
                             <div className={`w-fit px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border tracking-widest flex items-center gap-1.5 ${
                               link.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-slate-50 text-slate-400 border-slate-100'
                             }`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${link.status === 'Publicado' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                               {link.status}
                             </div>
                             <span className="text-[9px] font-medium text-slate-300 block truncate max-w-[200px] font-mono group-hover:text-slate-500 transition-colors lowercase">{link.targetUrl}</span>
                           </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                             {link.publishedUrl && (
                               <a href={link.publishedUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all">
                                 <ExternalLink size={14} />
                               </a>
                             )}
                             <button onClick={() => { setBacklinkForm(link); setShowBacklinkForm(true); }} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all">
                               <Edit3 size={14} />
                             </button>
                             <button onClick={() => handleDeleteBacklink(link.id)} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-200 hover:text-rose-500 shadow-sm transition-all">
                               <Trash2 size={14} />
                             </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'Planejamento' ? (
          <PlanningView
            keywordsUniverse={keywordsUniverse}
            loadingKeywords={loadingKeywords}
            loadKeywordsUniverse={loadKeywordsUniverse}
            selectedCycle={selectedCycle}
            setSelectedCycle={setSelectedCycle}
            selectedHubClient={selectedHubClient}
            setSelectedHubClient={setSelectedHubClient}
            clientsList={clientsList}
            setKeywordForm={setKeywordForm}
            setShowKeywordForm={setShowKeywordForm}
            handleDeleteKeyword={handleDeleteKeyword}
            promoteKeywordToPost={promoteKeywordToPost}
            promoteKeywordToBacklink={promoteKeywordToBacklink}
            setActiveTab={setActiveTab}
          />
        ) : activeTab === 'Configurações Unidade' && selectedHubClient ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden text-left">
               <div className="mb-12 border-b border-slate-100 pb-8">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ajustes da Unidade</h2>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-2">Personalização operacional para {selectedHubClient}</p>
               </div>

               <form onSubmit={handleSaveClient} className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Data do Ciclo Atual</label>
                        <input type="month" value={clientForm.currentCycleDate} onChange={e => setClientForm({...clientForm, currentCycleDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Nome do Pacote</label>
                        <input type="text" value={clientForm.packageName} onChange={e => setClientForm({...clientForm, packageName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Valor do Pacote (R$)</label>
                        <input type="number" value={clientForm.packageValue} onChange={e => setClientForm({...clientForm, packageValue: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Dia de Faturamento</label>
                        <input type="number" value={clientForm.billingDay} onChange={e => setClientForm({...clientForm, billingDay: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Itens Avulsos & Adicionais</h4>
                      <button type="button" onClick={() => {
                        const newItem = { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, price: 0 };
                        setClientForm({...clientForm, onDemandItems: [...clientForm.onDemandItems, newItem]});
                      }} className="text-[10px] font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700 flex items-center gap-2">
                        <Plus size={14} /> Adicionar Item
                      </button>
                    </div>
                    <div className="space-y-4">
                      {clientForm.onDemandItems.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-end bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                          <div className="flex-1 space-y-2">
                             <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Serviço / Produto</label>
                             <input type="text" value={item.name} onChange={e => {
                               const newItems = [...clientForm.onDemandItems];
                               newItems[index].name = e.target.value;
                               setClientForm({...clientForm, onDemandItems: newItems});
                             }} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none" placeholder="Ex: Backlinks Extras" />
                          </div>
                          <div className="w-24 space-y-2">
                             <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Qtd</label>
                             <input type="number" value={item.quantity} onChange={e => {
                               const newItems = [...clientForm.onDemandItems];
                               newItems[index].quantity = Number(e.target.value);
                               setClientForm({...clientForm, onDemandItems: newItems});
                             }} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium text-center outline-none" />
                          </div>
                          <div className="w-36 space-y-2">
                             <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Preço Un.</label>
                             <input type="number" value={item.price} onChange={e => {
                               const newItems = [...clientForm.onDemandItems];
                               newItems[index].price = Number(e.target.value);
                               setClientForm({...clientForm, onDemandItems: newItems});
                             }} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium text-center outline-none" />
                          </div>
                          <button type="button" onClick={() => {
                            const newItems = clientForm.onDemandItems.filter((_, i) => i !== index);
                            setClientForm({...clientForm, onDemandItems: newItems});
                          }} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      {clientForm.onDemandItems.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                           <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Nenhum item avulso para este ciclo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <div className="max-w-md">
                        <label className="text-[10px] font-bold text-emerald-500 font-bold uppercase tracking-[0.1em] ml-1 mb-3 block">Logo Personalizada (PNG/WEBP)</label>
                        <FileUploader 
                          currentUrl={clientForm.logoUrl} 
                          onUploadSuccess={(url) => setClientForm({...clientForm, logoUrl: url})}
                          folder="client_logos"
                          accept="image/webp,image/png,image/jpeg,image/svg+xml"
                        />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8 border-t border-slate-100">
                    <button type="submit" className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl px-12 py-5 hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/10">
                      Salvar Ajustes da Unidade
                    </button>
                  </div>
               </form>
            </div>
          </motion.div>
        ) : activeTab === 'Suporte Técnico Admin' ? (
          <TechnicalSupportView
            adminTickets={adminTickets}
            selectedAdminTicket={selectedAdminTicket}
            setSelectedAdminTicket={setSelectedAdminTicket}
            adminTicketMessages={adminTicketMessages}
            loadingAdminTickets={loadingAdminTickets}
            fetchAdminTickets={fetchAdminTickets}
            onlineUsers={onlineUsers}
            checkingOnline={checkingOnline}
            checkOnlineUsers={checkOnlineUsers}
            clients={clients}
            addToast={addToast}
          />
        ) : activeTab === 'Configurações' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Suspense fallback={null}>
               <SettingsGlobal />
             </Suspense>
          </motion.div>
        ) : null}
      </div>
    </main>

    <Suspense fallback={null}>
      <PostFormModal 
        showPostForm={showPostForm} 
        setShowPostForm={setShowPostForm} 
        postForm={postForm} 
        setPostForm={setPostForm} 
        handleSavePost={handleSavePost}
        handleSaveDraft={handleSaveDraft}
        clientsList={clientsList}
        categories={categories}
        isSaving={isSaving}
        addToast={addToast}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <BacklinkFormModal 
        showBacklinkForm={showBacklinkForm}
        setShowBacklinkForm={setShowBacklinkForm}
        backlinkForm={backlinkForm}
        setBacklinkForm={setBacklinkForm}
        handleSaveBacklink={handleSaveBacklink}
        clientsList={clientsList}
        isSaving={isSaving}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <KeywordFormModal
        showKeywordForm={showKeywordForm}
        setShowKeywordForm={setShowKeywordForm}
        keywordForm={keywordForm}
        setKeywordForm={setKeywordForm}
        handleSaveKeyword={handleSaveKeyword}
        clientsList={clientsList}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <PaymentModal 
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        selectedClientForPayments={selectedClientForPayments}
        setSelectedClientForPayments={setSelectedClientForPayments}
        payments={payments}
        loadingPayments={loadingPayments}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        handleAddPayment={handleAddPayment}
        handleDeletePayment={handleDeletePayment}
        clients={clients}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </Suspense>

    <ToastContainer toasts={toasts} removeToast={removeToast} />
  </div>
);
}

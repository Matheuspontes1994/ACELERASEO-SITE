import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, setDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, where, startAfter, onSnapshot } from 'firebase/firestore';
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
import { PostFormModal } from '../components/PostFormModal';
import { BacklinkFormModal } from '../components/BacklinkFormModal';
import { KeywordFormModal } from '../components/KeywordFormModal';
import { PaymentModal } from '../components/PaymentModal';
import SettingsGlobal from '../components/SettingsGlobal';
import { FileUploader } from '../components/FileUploader';

import Skeleton, { SkeletonCard, SkeletonMetric } from '../components/ui/Skeleton';

const Breadcrumbs = ({ workspace, activeTab }: { workspace: string, activeTab: string }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
    <Link to="/dashboard" className="hover:text-slate-900 transition-colors">ROOT</Link>
    <ChevronRight size={8} className="opacity-40" />
    <span className="text-slate-400">{workspace}</span>
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
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Visão Geral');
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
        fixed inset-y-0 left-0 w-[85vw] md:w-80 bg-white border-r border-slate-100 flex flex-col z-[70] transition-transform duration-500 ease-out h-screen md:sticky md:top-0
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header/Logo */}
        <div className="p-8 pb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center group gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img src={logoUrl} alt="Acelera SEO" className="w-full h-full object-contain p-1.5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-900 block leading-tight">ACELERA<span className="text-brand-600">SEO</span></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] block leading-none mt-0.5">Admin Central</span>
            </div>
          </Link>
          <button onClick={() => setShowMobileMenu(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="px-6 mb-8 shrink-0">
          <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-1.5 flex gap-1.5 relative">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-2xl shadow-sm border border-slate-100/50 transition-all duration-500 ease-out z-0 ${sidebarWorkspace === 'clientes' ? 'translate-x-[calc(100%+0.375rem)]' : 'translate-x-0'}`}
            />
            {[
              { id: 'agencia', label: 'Estratégia', icon: Zap },
              { id: 'clientes', label: 'Clientes', icon: Users }
            ].map(ws => (
              <button
                key={ws.id}
                onClick={() => { 
                  setSidebarWorkspace(ws.id as any);
                  setActiveTab(ws.id === 'agencia' ? 'Conteúdo Interno (Acelera)' : 'Hub de Clientes');
                }}
                className={`relative z-10 flex-1 py-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 ${sidebarWorkspace === ws.id ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ws.icon size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] leading-none">{ws.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-visible no-scrollbar pb-10">
          {/* Contextual Filters for Clients Workspace */}
          {sidebarWorkspace === 'clientes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 px-2">
              <div className="min-w-0">
                <p className="px-1.5 mb-1 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400/50 truncate">Unidade Performance</p>
                <div className="relative group/client">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/client:text-brand-600 transition-colors">
                    <Users size={12} />
                  </div>
                  <select
                    value={selectedHubClient}
                    onChange={(e) => {
                      setSelectedHubClient(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-5 py-2 text-[9px] font-bold text-slate-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none appearance-none transition-all cursor-pointer shadow-sm hover:bg-white truncate"
                  >
                    <option value="">Geral</option>
                    {clientsList.filter(c => c !== 'Agência').map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover/client:translate-x-0.5">
                    <ChevronDown size={10} />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <p className="px-1.5 mb-1 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400/50 truncate">Ciclo Operacional</p>
                <div className="relative group/cycle">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/cycle:text-brand-600 transition-colors pointer-events-none z-10">
                    <Calendar size={12} />
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-2 py-2 text-[9px] font-bold text-slate-900 shadow-sm hover:bg-white transition-all flex items-center h-[34px] min-h-[34px] truncate">
                    <span className="uppercase text-[8px] sm:text-[9px]">{formatCycleDate(selectedCycle)}</span>
                  </div>
                  <input 
                    type="month"
                    value={selectedCycle}
                    onChange={(e) => setSelectedCycle(e.target.value)}
                    className="month-picker-overlay z-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="space-y-8">
            {sidebarWorkspace === 'clientes' && (
              <div>
                <p className="px-5 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40">Painéis de Controle</p>
                <div className="space-y-1">
                  {[
                    { label: 'Visão Geral', icon: Activity, id: 'Visão Geral' },
                    { label: 'Hub de Unidades', icon: LayoutGrid, id: 'Hub de Clientes' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                      className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      {activeTab === item.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>

                <p className="px-5 mt-6 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40">Fluxo de Performance</p>
                <div className="space-y-1">
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
                      className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600 shadow-sm'}`}>
                            {item.badge}
                          </span>
                        )}
                        {activeTab === item.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedHubClient && (
                  <div className="mt-6">
                    <p className="px-5 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40">Gestão Operacional</p>
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
                      className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === 'Configurações Unidade' ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
                    >
                      <Settings size={20} strokeWidth={2.5} className={activeTab === 'Configurações Unidade' ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                      <span className="whitespace-nowrap">Ajustes Unidade</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {sidebarWorkspace === 'agencia' && (
              <div className="space-y-8">
                <div>
                  <p className="px-5 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40">Estratégico</p>
                  <div className="space-y-1">
                    {[
                      { label: 'Agency Growth', icon: Zap, id: 'Conteúdo Interno (Acelera)' },
                      { label: 'Clientes & CRM', icon: Users, id: 'Clientes & CRM' },
                      { label: 'Saúde Financeira', icon: DollarSign, id: 'Financeiro' },
                      { label: 'Suporte Técnico', icon: MessageSquareText, id: 'Suporte Técnico Admin', badge: pendingTicketsCount },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                          <span className="whitespace-nowrap">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600 shadow-sm'}`}>
                              {item.badge}
                            </span>
                          )}
                          {activeTab === item.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="px-5 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40">Configurações</p>
                  <div className="space-y-1">
                    {[
                      { label: 'Taxonomia', icon: Layers, id: 'Categorias' },
                      { label: 'Ajustes Master', icon: Shield, id: 'Configurações' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setShowMobileMenu(false); }}
                        className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
                      >
                        <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-4 shrink-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">
                {auth.currentUser?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sessão Agência</p>
            </div>
          </div>

          <button 
            onClick={async () => {
              await signOut(auth);
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-[10px] font-black uppercase tracking-[0.25em] border border-transparent hover:border-rose-100 shadow-sm"
          >
            <LogOut size={16} /> Finalizar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative z-10 flex flex-col md:bg-[#F8FAFC]/50 overflow-y-auto no-scrollbar">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 transition-all duration-500 w-full">
          <header className="hidden md:flex items-center justify-between mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                  sidebarWorkspace === 'agencia' ? 'bg-brand-500' :
                  'bg-blue-600'
                }`}>
                  {sidebarWorkspace === 'agencia' ? <Zap size={18} /> :
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

        {activeTab === 'Categorias' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 lg:p-16">
               <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-16">
                 <div>
                   <h2 className="text-3xl font-bold text-slate-900 tracking-tighter flex items-center gap-3">
                     Categorias do Blog
                     <button 
                       onClick={() => loadCategories()} 
                       className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900"
                     >
                       <RefreshCcw size={16} className={loadingCategories ? 'animate-spin' : ''} />
                     </button>
                   </h2>
                   <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-2">Organização Temática & Taxonomia de SEO</p>
                 </div>
                 <button onClick={() => {
                   setCategoryForm({ id: '', name: '', slug: '', description: '', seoTitle: '', seoDescription: '', isProtected: false });
                   setShowCategoryForm(true);
                 }} className="bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition-all px-10 py-4 shadow-xl shadow-brand-500/20">
                   Nova Categoria
                 </button>
               </div>

               {showCategoryForm && (
                 <motion.form 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSaveCategory} className="bg-slate-50/50 p-10 rounded-[28px] border border-slate-100 space-y-8 mb-16 relative">
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                      <Zap size={20} />
                    </button>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{categoryForm.id ? 'Refinar Categoria' : 'Novo Alvo Temático'}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da Categoria</label>
                          <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-slate-200 transition-all" placeholder="Ex: SEO Técnico" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slug URL</label>
                          <input type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-slate-200 transition-all" placeholder="seo-tecnico" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SEO Title</label>
                          <input type="text" value={categoryForm.seoTitle} onChange={e => setCategoryForm({...categoryForm, seoTitle: e.target.value})} className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-slate-200 transition-all" placeholder="Otimização para buscadores" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição Contextual</label>
                          <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-slate-200 transition-all min-h-[110px]" placeholder="Resumo para o portal..." />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setShowCategoryForm(false)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-8 py-4 hover:text-slate-900 transition-colors">Cancelar</button>
                      <button type="submit" disabled={isSaving} className="bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl px-12 py-4 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/10 disabled:opacity-50">
                        {isSaving ? 'Gravando...' : 'Confirmar Categoria'}
                      </button>
                    </div>
                 </motion.form>
               )}

               <div className="hidden md:block overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                     <thead>
                       <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                         <td className="px-10 py-6">Nome / Contexto</td>
                         <td className="px-10 py-6">Slug Estrutural</td>
                         <td className="px-10 py-6">SEO Health</td>
                         <td className="px-10 py-6 text-right">Ação</td>
                       </tr>
                     </thead>
                    <tbody className="divide-y-4 divide-white">
                      {loadingCategories ? (
                         Array.from({ length: 5 }).map((_, i) => (
                           <tr key={`skel-cat-${i}`}>
                             <td className="px-10 py-10">
                               <div className="flex items-center gap-6">
                                 <Skeleton variant="circular" className="w-4 h-4" />
                                 <div className="space-y-2">
                                   <Skeleton variant="rectangular" className="h-6 w-48" />
                                   <Skeleton variant="text" className="w-64" />
                                 </div>
                               </div>
                             </td>
                             <td className="px-10 py-10"><Skeleton variant="rectangular" className="h-8 w-32" /></td>
                             <td className="px-10 py-10"><Skeleton variant="rectangular" className="h-4 w-16 mx-auto" /></td>
                             <td className="px-10 py-10 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                           </tr>
                         ))
                       ) : categories.map((cat) => (
                        <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-10">
                            <div className="flex items-center gap-6">
                              <div className={`w-4 h-4 rounded-full ${cat.isProtected ? 'bg-brand-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'bg-slate-100'} transition-all duration-700 group-hover:scale-125`}></div>
                              <div>
                                <span className="text-xl font-black text-slate-900 block leading-tight tracking-tighter group-hover:text-brand-600 transition-colors uppercase">{cat.name}</span>
                                <span className="text-[12px] font-bold text-slate-300 block truncate max-w-[400px] tracking-tight mt-1 uppercase opacity-60 group-hover:opacity-100">{cat.description || 'Nenhum contexto estratégico definido'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-10">
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-[0.1em] bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white group-hover:text-slate-900 transition-all">/blog/{cat.slug}</span>
                          </td>
                          <td className="px-10 py-10 text-center">
                            <div className="flex justify-center gap-4">
                              <div className={`w-3 h-3 rounded-full border-2 border-white shadow-xl ${cat.seoTitle ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-100'}`} title="Title SEO"></div>
                              <div className={`w-3 h-3 rounded-full border-2 border-white shadow-xl ${cat.seoDescription ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-100'}`} title="Meta Description"></div>
                            </div>
                          </td>
                          <td className="px-10 py-10 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                              <button 
                                onClick={() => {
                                  setCategoryForm(cat);
                                  setShowCategoryForm(true);
                                }}
                                className="p-4 text-slate-300 hover:text-slate-900 bg-white border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-100 hover:shadow-2xl active:scale-95"
                              >
                                <Edit3 size={18} />
                              </button>
                              {!cat.isProtected && (
                                <button 
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-4 text-slate-300 hover:text-rose-500 bg-white border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-100 hover:shadow-2xl active:scale-95"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-24 text-slate-300 uppercase text-[10px] font-bold tracking-[0.2em]">Sem categorias ativas</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                   {loadingCategories ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={`skel-cat-mob-${i}`} className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                          <Skeleton variant="rectangular" className="h-6 w-3/4 rounded-lg" />
                          <Skeleton variant="text" className="w-full" />
                          <div className="flex justify-between items-center pt-4">
                            <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
                            <Skeleton variant="circular" className="h-8 w-8" />
                          </div>
                        </div>
                      ))
                   ) : categories.length === 0 ? (
                      <div className="p-12 text-center text-slate-300 uppercase text-[10px] font-black tracking-widest bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">Sem categorias</div>
                   ) : categories.map((cat) => (
                      <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className={`w-3 h-3 rounded-full ${cat.isProtected ? 'bg-brand-500' : 'bg-slate-100'}`}></div>
                             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{cat.name}</h4>
                          </div>
                          <div className="flex gap-2">
                             <div className={`w-2 h-2 rounded-full ${cat.seoTitle ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                             <div className={`w-2 h-2 rounded-full ${cat.seoDescription ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{cat.description || 'Sem descrição'}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                           <span className="text-[10px] font-bold text-brand-600 font-mono tracking-tighter bg-brand-50 px-3 py-1 rounded-lg">/{cat.slug}</span>
                           <div className="flex gap-2">
                              <button onClick={() => { setCategoryForm(cat); setShowCategoryForm(true); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl active:scale-95 transition-all"><Edit3 size={16} /></button>
                              {!cat.isProtected && <button onClick={() => handleDeleteCategory(cat)} className="p-3 bg-rose-50 text-rose-400 rounded-xl active:scale-95 transition-all"><Trash2 size={16} /></button>}
                           </div>
                        </div>
                      </div>
                   ))}
                </div>
            </div>
          </motion.div>
        ) : activeTab === 'Visão Geral' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
            
            {/* Intelligent Operational Summary - Refined Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {(() => {
                  const filteredClients = clients.filter(c => {
                    if (selectedHubClient) return c.name === selectedHubClient;
                    if (sidebarWorkspace === 'agencia') return c.name === 'Agência';
                    if (sidebarWorkspace === 'clientes') return c.name !== 'Agência';
                    return true;
                  });
                  
                  const filteredPosts = blogPosts.filter(p => {
                    if (selectedHubClient) return p.clientName === selectedHubClient;
                    if (sidebarWorkspace === 'agencia') return p.clientName === 'Agência';
                    if (sidebarWorkspace === 'clientes') return p.clientName !== 'Agência';
                    return true;
                  });

                  const filteredBacklinks = backlinks.filter(b => {
                    if (selectedHubClient) return b.clientName === selectedHubClient;
                    if (sidebarWorkspace === 'agencia') return b.clientName === 'Agência';
                    if (sidebarWorkspace === 'clientes') return b.clientName !== 'Agência';
                    return true;
                  });

                  const totalMetaPosts = filteredClients.reduce((acc, c) => acc + (Number(c.monthlyPosts || 0) + Number(c.extraPosts || 0)), 0);
                  const totalDeliveredPosts = filteredPosts.filter(p => p.targetMonth === selectedCycle && p.status === 'Publicado').length;
                  const totalPendingPosts = filteredPosts.filter(p => p.targetMonth === selectedCycle && p.status !== 'Publicado').length;
                  const postPercent = totalMetaPosts > 0 ? Math.round((totalDeliveredPosts / totalMetaPosts) * 100) : 0;

                  const totalMetaLinks = filteredClients.reduce((acc, c) => acc + (Number(c.monthlyBacklinks || 0) + Number(c.extraBacklinks || 0)), 0);
                  const totalDeliveredLinks = filteredBacklinks.filter(b => b.targetMonth === selectedCycle && b.status === 'Publicado').length;
                  const totalPendingLinks = filteredBacklinks.filter(b => b.targetMonth === selectedCycle && b.status !== 'Publicado').length;
                  const linkPercent = totalMetaLinks > 0 ? Math.round((totalDeliveredLinks / totalMetaLinks) * 100) : 0;

                  const pendências = filteredPosts.filter(p => p.status === 'Aguardando Aprovação').length;

                  return (
                    <>
                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <BentoCard 
                          title="Produção de Conteúdo" 
                          value={totalDeliveredPosts} 
                          total={totalMetaPosts} 
                          percentage={postPercent} 
                          icon={FileText} 
                          subtext={`Ciclo: ${selectedCycle}`}
                        />
                        <BentoCard 
                          title="Ativos de Backlinks" 
                          value={totalDeliveredLinks} 
                          total={totalMetaLinks} 
                          percentage={linkPercent} 
                          icon={LinkIcon} 
                          subtext={`Ciclo: ${selectedCycle}`}
                        />
                      </div>

                      <div className="bg-white rounded-[40px] p-10 border border-slate-100 flex flex-col justify-between group shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 relative overflow-hidden">
                          <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
                          <div className="relative z-10">
                              <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300 mb-2">Backlog de Produção</h4>
                              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Postagens Pendentes</h3>
                          </div>
                          <div className="mt-8 flex items-baseline gap-3 relative z-10">
                              <span className="text-6xl font-bold text-slate-900 tracking-tight leading-none">{totalPendingPosts}</span>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-300 leading-none mb-1">Total no</span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-brand-600 leading-none">PIPELINE</span>
                              </div>
                          </div>
                          <button 
                            onClick={() => setActiveTab('Artigos e Conteúdos')}
                            className="mt-8 w-full py-4 bg-slate-900 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-600 transition-all shadow-md relative z-10"
                          >
                             GERENCIAR CÉLULA
                          </button>
                      </div>

                      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 flex flex-col hover:shadow-md hover:translate-y-[-2px] transition-all duration-500 relative overflow-hidden group">
                          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300 mb-8 flex items-center gap-2 relative z-10">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm animate-pulse" /> Monitoramento de Entrega
                          </h4>
                          <div className="flex-1 space-y-3 overflow-y-auto max-h-[180px] no-scrollbar relative z-10">
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Geral do Ciclo</span>
                                  <span className="text-[10px] font-bold text-brand-600 uppercase">{selectedCycle}</span>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                                      <span className="text-slate-400">Conteúdo</span>
                                      <span className="text-slate-900">{totalDeliveredPosts}/{totalMetaPosts}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-brand-500 transition-all duration-1000" style={{ width: `${postPercent}%` }}></div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                                      <span className="text-slate-400">Backlinks</span>
                                      <span className="text-slate-900">{totalDeliveredLinks}/{totalMetaLinks}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${linkPercent}%` }}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                    </>
                  );
              })()}
            </div>

            {/* Operational Metrics - Replaces Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm p-10 flex flex-col relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-10 relative z-10">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">Status de <span className="text-brand-600">Produção</span></h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">Visão Consolidada do Atendimento</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Nível de Entrega</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conteúdo do Mês</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { status: 'Postados', count: blogPosts.filter(p => (!selectedHubClient || p.clientName === selectedHubClient) && p.targetMonth === selectedCycle && p.status === 'Publicado').length, color: 'bg-emerald-500' },
                          { status: 'Aprovação', count: blogPosts.filter(p => (!selectedHubClient || p.clientName === selectedHubClient) && p.targetMonth === selectedCycle && p.status === 'Aguardando Aprovação').length, color: 'bg-amber-500' },
                          { status: 'Em Produção', count: blogPosts.filter(p => (!selectedHubClient || p.clientName === selectedHubClient) && p.targetMonth === selectedCycle && (p.status === 'Rascunho' || p.status === 'RascunhoInterno')).length, color: 'bg-brand-500' },
                          { status: 'Cancelados', count: blogPosts.filter(p => (!selectedHubClient || p.clientName === selectedHubClient) && p.targetMonth === selectedCycle && p.status === 'Cancelado').length, color: 'bg-slate-300' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${item.color}`} />
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{item.status}</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-violet-600 shadow-sm">
                          <LinkIcon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Meta Off-Page</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Backlinks do Ciclo</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { status: 'Ativos', count: backlinks.filter(b => (!selectedHubClient || b.clientName === selectedHubClient) && b.targetMonth === selectedCycle && b.status === 'Publicado').length, color: 'bg-emerald-500' },
                          { status: 'Em Negociação', count: backlinks.filter(b => (!selectedHubClient || b.clientName === selectedHubClient) && b.targetMonth === selectedCycle && b.status === 'Pendente').length, color: 'bg-amber-500' },
                          { status: 'Rascunho', count: backlinks.filter(b => (!selectedHubClient || b.clientName === selectedHubClient) && b.targetMonth === selectedCycle && b.status === 'Rascunho').length, color: 'bg-brand-500' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${item.color}`} />
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{item.status}</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col gap-6 md:gap-8">
                  <div className="bg-white rounded-[24px] p-8 border border-slate-100 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                     <div className="absolute -top-8 -right-8 p-4 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
                        <Users size={180} />
                     </div>
                     <div className="relative z-10">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Próximos Passos</p>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Planejamento Estratégico</h3>
                     </div>
                     <div className="mt-8 relative z-10">
                        <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100">
                           <p className="text-[11px] font-medium text-brand-900 leading-relaxed italic">
                             "Todas as pautas de {selectedCycle} estão em dia. Foque na revisão final dos artigos 'Aguardando Aprovação' para garantir a entrega do ciclo."
                           </p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-8 bg-slate-900 rounded-[24px] flex items-center justify-between transition-all cursor-pointer group shadow-lg hover:bg-brand-600 active:scale-[0.98]">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:rotate-[360deg] transition-transform duration-700">
                           <RefreshCcw size={16} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white tracking-tight">Exportar Relatório</p>
                           <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest opacity-60">Status do Ciclo Atual</p>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
               </div>
            </div>

            {/* Quick Flow Actions - Minimalist Bottom Section */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
               <div className="max-w-md">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-3">Command Center</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Gerencie toda a jornada do conteúdo, da palavra-chave à autoridade, em um único núcleo operacional.</p>
               </div>
               
               <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Novo Planejamento', icon: Calendar, action: () => { setShowPostForm(true); setPostForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: selectedCycle, slug: '', description: '', content: '', coverImage: '', category: 'Geral', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Planejado', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '', clientComment: '' }); } },
                     { label: 'Novo Backlink', icon: LinkIcon, action: () => { setShowBacklinkForm(true); setBacklinkForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: selectedCycle, focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Aguardando Produção', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' }); } },
                     { label: 'Rankings', icon: Globe2, action: () => { setActiveTab('Monitoramento de Rankings'); } },
                     { label: 'Pipeline', icon: Calendar, action: () => { setActiveTab('Planejamento'); } },
                  ].map((btn, i) => (
                     <button 
                        key={i}
                        onClick={btn.action}
                        className="px-6 py-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2.5 shadow-sm hover:shadow-md"
                     >
                        <btn.icon size={13} className="opacity-40" />
                        {btn.label}
                     </button>
                  ))}
               </div>
            </div>

          </motion.div>
        ) : activeTab === 'Clientes & CRM' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16">
            <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-xl border border-slate-100 gap-1 mb-8 w-fit shadow-sm">
              {['Clientes Ativos', 'Leads Auditoria', 'Mensagens Contato'].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setSubTabCrm(sub)}
                  className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all duration-300 ${subTabCrm === sub ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {subTabCrm === 'Clientes Ativos' && (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-12">
                   <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Parceiros Ativos</h2>
                      <button 
                        onClick={() => loadClients(true)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900 group"
                        title="Sincronizar base"
                      >
                        <RefreshCcw size={16} className={`${loadingClients ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-2">Gestão Estratégica & Operacional</p>
                  </div>
                  <button onClick={() => {
                    setClientForm({ id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', active: true, approvalDeadlineDays: '5', websiteUrl: '', logoUrl: '', lastPaymentMonth: '', extraMonth: '', extraPosts: '0', extraBacklinks: '0', extraDevHours: '0', taxId: '', contactName: '', phone: '', additionalPhone: '', packageName: '', packageValue: '0', currentCycleDate: new Date().toISOString().slice(0, 7), onDemandItems: [] });
                    setShowClientForm(true);
                  }} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl hover:bg-brand-600 transition-all shadow-md px-8 py-4 flex items-center gap-2">
                    Cadastrar Novo Parceiro
                  </button>
                </div>

                {showClientForm && (
                  <motion.form 
                    initial={{ opacity: 0, scale: 0.98, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    onSubmit={handleSaveClient} className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-8 mb-16 relative">
                    <button type="button" onClick={() => setShowClientForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors">
                      <Zap size={20} />
                    </button>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{clientForm.id ? 'Editar Parceria' : 'Abertura de Nova Parceria'}</h3>
                      <p className="text-slate-400 text-xs mt-1 font-medium">Configure os parâmetros operacionais e financeiros do cliente.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Razão Social / Nome Fantasia</label>
                        <input type="text" required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="Ex: Corporativos S/A" />
                      </div>
                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">CNPJ / CPF</label>
                        <input type="text" value={clientForm.taxId} onChange={e => setClientForm({...clientForm, taxId: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="00.000.000/0001-00" />
                      </div>
                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Website (URL)</label>
                        <input type="text" value={clientForm.websiteUrl} onChange={e => setClientForm({...clientForm, websiteUrl: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="https://www.empresa.com" />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-[10px] font-bold text-emerald-500 font-bold uppercase tracking-[0.1em] ml-1">Logo Personalizada (PNG/WEBP)</label>
                        <FileUploader 
                          currentUrl={clientForm.logoUrl} 
                          onUploadSuccess={(url) => setClientForm({...clientForm, logoUrl: url})}
                          folder="client_logos"
                          accept="image/webp,image/png,image/jpeg,image/svg+xml"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Nome do Contato</label>
                        <input type="text" value={clientForm.contactName} onChange={e => setClientForm({...clientForm, contactName: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="Ex: João Silva" />
                      </div>
                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">E-mail de Notificação</label>
                        <input type="email" required value={clientForm.clientEmail} onChange={e => setClientForm({...clientForm, clientEmail: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="financeiro@empresa.com" />
                      </div>
                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Telefone Principal</label>
                        <input type="text" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="col-span-1 md:col-span-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Contato Adicional</label>
                        <input type="text" value={clientForm.additionalPhone} onChange={e => setClientForm({...clientForm, additionalPhone: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="(00) 00000-0000" />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/50">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Operação & Pacote</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Data do Ciclo Atual</label>
                           <input type="month" value={clientForm.currentCycleDate} onChange={e => setClientForm({...clientForm, currentCycleDate: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Nome do Pacote</label>
                           <input type="text" value={clientForm.packageName} onChange={e => setClientForm({...clientForm, packageName: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="Ex: SEO Pro" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Valor do Pacote (R$)</label>
                           <input type="number" value={clientForm.packageValue} onChange={e => setClientForm({...clientForm, packageValue: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="0.00" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Dia de Faturamento</label>
                           <input type="number" value={clientForm.billingDay} onChange={e => setClientForm({...clientForm, billingDay: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/50">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Adicionais Avulsos (Ciclo Atual)</h4>
                        <button type="button" onClick={() => {
                          const newItem = { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, price: 0 };
                          setClientForm({...clientForm, onDemandItems: [...clientForm.onDemandItems, newItem]});
                        }} className="text-[9px] font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700 flex items-center gap-2">
                          <Plus size={12} /> Adicionar Item
                        </button>
                      </div>
                      <div className="space-y-4">
                        {clientForm.onDemandItems.map((item, index) => (
                          <div key={item.id} className="flex gap-4 items-end bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                            <div className="flex-1 space-y-2">
                              <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Serviço</label>
                              <input type="text" value={item.name} onChange={e => {
                                const newItems = [...clientForm.onDemandItems];
                                newItems[index].name = e.target.value;
                                setClientForm({...clientForm, onDemandItems: newItems});
                              }} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-4 text-xs font-medium outline-none" placeholder="Ex: Backlink Adicional" />
                            </div>
                            <div className="w-20 space-y-2">
                              <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quant.</label>
                              <input type="number" value={item.quantity} onChange={e => {
                                const newItems = [...clientForm.onDemandItems];
                                newItems[index].quantity = Number(e.target.value);
                                setClientForm({...clientForm, onDemandItems: newItems});
                              }} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-4 text-xs font-medium outline-none" />
                            </div>
                            <div className="w-32 space-y-2">
                              <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                              <input type="number" value={item.price} onChange={e => {
                                const newItems = [...clientForm.onDemandItems];
                                newItems[index].price = Number(e.target.value);
                                setClientForm({...clientForm, onDemandItems: newItems});
                              }} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-4 text-xs font-medium outline-none" />
                            </div>
                            <button type="button" onClick={() => {
                              const newItems = clientForm.onDemandItems.filter((_, i) => i !== index);
                              setClientForm({...clientForm, onDemandItems: newItems});
                            }} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {clientForm.onDemandItems.length === 0 && (
                          <p className="text-[10px] text-slate-300 italic font-medium">Nenhum adicional avulso registrado para este ciclo.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/50">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Operação de Conteúdo & Dev</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Posts Mensais</label>
                          <input type="number" value={clientForm.monthlyPosts} onChange={e => setClientForm({...clientForm, monthlyPosts: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Backlinks Mensais</label>
                          <input type="number" value={clientForm.monthlyBacklinks} onChange={e => setClientForm({...clientForm, monthlyBacklinks: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Horas Dev (Setup)</label>
                          <input type="number" value={clientForm.initialDevHours} onChange={e => setClientForm({...clientForm, initialDevHours: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Horas Dev (Mensal)</label>
                          <input type="number" value={clientForm.monthlyDevHours} onChange={e => setClientForm({...clientForm, monthlyDevHours: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/50">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Políticas & Prazos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Início do Contrato</label>
                           <input type="date" value={clientForm.contractStart} onChange={e => setClientForm({...clientForm, contractStart: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Dias p/ Aprovação</label>
                           <input type="number" value={clientForm.approvalDeadlineDays} onChange={e => setClientForm({...clientForm, approvalDeadlineDays: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-slate-200/50 pt-8">
                      <button type="button" onClick={() => setShowClientForm(false)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 px-6 py-4 hover:text-rose-500 transition-colors">Descartar</button>
                      <button type="submit" className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl px-10 py-4 hover:bg-brand-600 transition-all shadow-md">
                        {clientForm.id ? 'Salvar Configurações' : 'Ativar Ciclo de Operação'}
                      </button>
                    </div>
                  </motion.form>
                )}

                <div className="hidden md:block overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-8 py-5">Parceiro / Ativo Digital</td>
                        <td className="px-8 py-5 text-center">Acesso ao Portal</td>
                        <td className="px-8 py-5">Gestão Operacional</td>
                        <td className="px-8 py-5 text-right">Controle</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingClients ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-client-${i}`}>
                            <td className="px-8 py-6">
                              <Skeleton variant="rectangular" className="h-6 w-48 mb-2" />
                              <Skeleton variant="text" className="w-32" />
                            </td>
                            <td className="px-8 py-6 text-center"><Skeleton variant="rectangular" className="h-6 w-24 mx-auto" /></td>
                            <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-10 w-40" /></td>
                            <td className="px-8 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-20 text-slate-300 uppercase text-[10px] font-bold tracking-[0.15em]">Fluxo de clientes vazio</td></tr>
                      ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                        <tr key={client.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 transition-all shadow-sm ${client.logoUrl ? "bg-white border border-slate-100" : "bg-slate-100 ring-4 ring-slate-50"}`}>
                                {client.logoUrl ? (
                                  <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                                ) : (
                                  <TrendingUp className="text-slate-300" size={24} />
                                )}
                              </div>
                              <div>
                                <span className="text-base font-black text-slate-900 block leading-tight tracking-tight group-hover:text-brand-600 transition-colors uppercase">{client.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 block font-mono mt-1 group-hover:text-slate-500 transition-colors opacity-60 uppercase tracking-tighter">{client.websiteUrl || 'Sem domínio associado'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            {client.uid ? (
                              <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-transform duration-300 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Portal Ativo</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 opacity-60">
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Aguardando</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-4 flex items-center justify-between gap-6 group-hover:bg-white group-hover:shadow-sm transition-all">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] border border-slate-200 rounded px-1.5 py-0.5 bg-white">Dia {client.billingDay}</span>
                                  {(() => {
                                    const status = getPaymentStatus(client);
                                    const Icon = status.icon;
                                    return (
                                      <button 
                                         onClick={() => handleTogglePayment(client)} 
                                         className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase transition-all border ${status.color} ${status.bg} shadow-sm hover:scale-105`}
                                         title="Gerenciar Pagamentos"
                                      >
                                         <Icon size={8} /> {status.label}
                                      </button>
                                    );
                                  })()}
                                </div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate max-w-[200px]">{client.packageName || 'Plano Customizado'}</p>
                              </div>
                              <div className="text-right border-l border-slate-100 pl-6 ml-auto">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Investimento</p>
                                <p className="text-sm font-black text-brand-600 tracking-tighter">R$ {(Number(client.packageValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => {
                                    setClientForm({ ...client, currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), onDemandItems: client.onDemandItems || [], packageValue: String(client.packageValue || '0') });
                                    setShowClientForm(true);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-600 hover:border-brand-200 shadow-sm transition-all active:scale-95"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all active:scale-95"
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
                <div className="md:hidden space-y-4">
                  {loadingClients ? (
                     Array.from({ length: 3 }).map((_, i) => (
                       <div key={`skel-cl-mob-${i}`} className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-4">
                         <div className="flex items-center gap-4">
                           <Skeleton variant="circular" className="w-14 h-14" />
                           <div className="flex-1 space-y-2">
                             <Skeleton variant="rectangular" className="h-6 w-3/4 rounded-lg" />
                             <Skeleton variant="text" className="w-1/2" />
                           </div>
                         </div>
                       </div>
                     ))
                  ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                    <div className="p-16 text-center text-slate-300 uppercase text-[10px] font-black tracking-[0.2em] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100">Sem clientes ativos em sua base</div>
                  ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                    <div key={client.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group active:scale-[0.98] transition-all">
                       <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border-2 shadow-sm ${client.logoUrl ? "bg-white border-slate-50" : "bg-slate-50 border-transparent text-slate-200"}`}>
                              {client.logoUrl ? <img src={client.logoUrl} className="w-full h-full object-contain p-1" /> : <TrendingUp size={24} />}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{client.name}</h4>
                               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{client.packageName || 'Plano Custom'}</p>
                            </div>
                          </div>
                          <button onClick={() => { setClientForm({ ...client, currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), onDemandItems: client.onDemandItems || [], packageValue: String(client.packageValue || '0') }); setShowClientForm(true); }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all">
                            <Edit3 size={18} />
                          </button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1 w-full">Investimento</p>
                             <span className="text-sm font-black text-slate-900">R$ {(client.packageValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1 w-full">Faturamento</p>
                             <span className="text-sm font-black text-slate-900">Dia {client.billingDay}</span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${client.uid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                              <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">Status Portal</p>
                              <span className="text-[10px] font-black uppercase tracking-tight">{client.uid ? 'Ativado' : 'Inativo'}</span>
                          </div>
                          <button 
                            onClick={() => handleTogglePayment(client)}
                            className={(() => {
                              const status = getPaymentStatus(client);
                              return `p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${status.bg} border-current/10 ${status.color}`;
                            })()}
                          >
                              <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">Status Pagamento</p>
                              {(() => {
                                const status = getPaymentStatus(client);
                                return <span className="text-[10px] font-black uppercase tracking-tight">{status.label}</span>
                              })()}
                          </button>
                       </div>
                       
                       <div className="pt-2">
                         <button onClick={() => navigate('/portal-cliente')} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 active:scale-95">
                           Acessar Portal <CheckCircle2 size={16} />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTabCrm === 'Leads Auditoria' && (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Qualificados</h2>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-2">Captação via Widget de Auditoria</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <select value={auditDateFilter} onChange={e => setAuditDateFilter(e.target.value)} className="bg-slate-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 focus:ring-2 focus:ring-slate-100 outline-none px-5 py-3.5">
                      <option value="Todos">Período Total</option>
                      <option value="7d">7 Dias</option>
                      <option value="30d">30 Dias</option>
                    </select>
                    <button onClick={() => exportToCSV(filteredAuditLeads, 'leas-auditoria.csv', 'audit')} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 hover:bg-brand-600 transition-all flex items-center gap-2.5 shadow-md">
                       <Download size={14} /> Exportar
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-8 py-5">Sincronismo</td>
                        <td className="px-8 py-5">Prospect / Contato</td>
                        <td className="px-8 py-5">Ativo Digital</td>
                        <td className="px-8 py-5 text-right">Status Comercial</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingLeads ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-audit-${i}`}>
                            <td className="px-8 py-6"><Skeleton variant="text" className="w-16" /></td>
                            <td className="px-8 py-6">
                              <Skeleton variant="rectangular" className="h-6 w-48 mb-2" />
                              <Skeleton variant="text" className="w-32" />
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-2">
                                <Skeleton variant="rectangular" className="h-4 w-32" />
                                <Skeleton variant="rectangular" className="h-6 w-24" />
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-24 ml-auto" /></td>
                          </tr>
                        ))
                      ) : filteredAuditLeads.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-24 text-slate-300 uppercase tracking-[0.15em] font-bold text-[10px]">Nenhum lead retido</td></tr>
                      ) : filteredAuditLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-6 text-slate-400 font-bold text-[9px] uppercase tracking-[0.1em] font-mono">
                            {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight group-hover:text-brand-600 transition-all uppercase">{lead.name}</span>
                            <span className="text-[10px] font-medium text-slate-400 block tracking-tight italic flex items-center gap-1.5 mt-1"><div className="w-1 h-1 rounded-full bg-slate-200"></div>{lead.phone || 'Sem contato extra'}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-bold text-slate-400 block truncate max-w-[200px] mb-2 font-mono group-hover:text-slate-900 transition-colors lowercase">{lead.url || 'Sem domínio'}</span>
                            <a href={lead.url} target="_blank" rel="noopener noreferrer" className="inline-flex text-[9px] font-bold uppercase text-brand-600 hover:text-white hover:bg-brand-500 px-3 py-1.5 rounded-lg border border-brand-100/50 tracking-wider items-center gap-1.5 transition-all shadow-sm">Analisar Ativo <ExternalLink size={10} /></a>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => toggleLeadStatus('audit_leads', lead.id, lead.status)} className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm ${lead.status === 'tratado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-amber-50 text-amber-600 border border-amber-100/50 hover:bg-amber-100'}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'tratado' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                               {lead.status === 'tratado' ? 'Convertido' : 'Em Aberto'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTabCrm === 'Mensagens Contato' && (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inbox Operacional</h2>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-2">Interações Diretas via Website</p>
                  </div>
                  <button onClick={() => exportToCSV(filteredContactLeads, 'mensagens.csv', 'contact')} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-8 py-4 hover:bg-brand-600 transition-all flex items-center gap-2.5 shadow-md">
                     <Download size={14} /> Backup
                  </button>
                </div>

                <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-8 py-5">Remetente</td>
                        <td className="px-8 py-5 text-center">Contexto</td>
                        <td className="px-8 py-5 text-right">Controle</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingLeads ? (
                         Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-contact-${i}`}>
                            <td className="px-8 py-8 align-top">
                              <Skeleton variant="rectangular" className="h-6 w-48 mb-2" />
                              <Skeleton variant="text" className="w-32 mb-3" />
                              <Skeleton variant="rectangular" className="h-4 w-20" />
                            </td>
                            <td className="px-8 py-8">
                              <Skeleton variant="rectangular" className="h-20 w-full rounded-[24px]" />
                            </td>
                            <td className="px-8 py-8 text-right align-top">
                              <Skeleton variant="rectangular" className="h-8 w-24 ml-auto" />
                            </td>
                          </tr>
                        ))
                      ) : filteredContactLeads.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-24 text-slate-300 uppercase tracking-[0.15em] font-bold text-[10px]">Inbox higienizado</td></tr>
                      ) : filteredContactLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-8 align-top">
                            <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight mb-1 group-hover:text-brand-600 transition-colors uppercase">{lead.name}</span>
                            <span className="text-[10px] font-medium text-slate-400 block tracking-tight mb-3 lowercase">{lead.email}</span>
                            <span className="inline-flex text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em] font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}</span>
                          </td>
                          <td className="px-8 py-8">
                            <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100 max-w-xl group-hover:bg-white transition-all shadow-sm">
                              <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{lead.message}"</p>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right align-top">
                            <button onClick={() => toggleLeadStatus('contacts', lead.id, lead.status)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm ${lead.status === 'tratado' ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600 border border-brand-100 hover:shadow-md'}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'tratado' ? 'bg-slate-300' : 'bg-brand-500 animate-pulse'}`}></div>
                               {lead.status === 'tratado' ? 'Arquivado' : 'Não Lido'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-12 overflow-hidden">
              
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-12 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="relative flex-1 w-full group">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Buscar por título ou cliente..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 md:w-48 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-500/10 transition-all shadow-sm cursor-pointer appearance-none text-center"
                  >
                    <option value="Todos">Todos Status</option>
                    <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                    <option value="Ajustes Necessários">Ajustes Necessários</option>
                    <option value="Aprovado">Aprovado</option>
                  </select>
                  
                  <button 
                    onClick={() => { setSearchQuery(''); setStatusFilter('Todos'); }}
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 transition-all shadow-sm active:scale-95"
                    title="Limpar Filtros"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-8 p-4 bg-brand-600 rounded-2xl flex items-center justify-between shadow-xl shadow-brand-500/20 sticky top-0 z-50"
                  >
                    <div className="flex items-center gap-4 px-4 text-white">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                        {selectedIds.length}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Ativos Selecionados</span>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={handleBulkApprove}
                        className="px-6 py-2.5 bg-white text-brand-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-inner"
                      >
                        <CheckCircle2 size={14} /> Aprovar Seleção
                      </button>
                      <button 
                        onClick={() => setSelectedIds([])}
                        className="px-6 py-2.5 bg-brand-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-800 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4 text-center lg:text-left justify-center lg:justify-start">
                    Auditório de Conteúdo
                    <div className="bg-brand-50 text-brand-600 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-100/50">
                      {(blogPosts.filter(p => ['Aguardando Aprovação', 'Ajustes Necessários', 'Aprovado'].includes(p.status)).length + backlinks.filter(b => ['Aguardando Aprovação', 'Aprovado'].includes(b.status)).length)} Ativos
                    </div>
                  </h2>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-2 text-center lg:text-left">Revisão Crítica & Validação de Qualidade</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => { loadBlogPosts(true); loadBacklinks(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                    <RefreshCcw size={18} className={(loadingPosts || loadingBacklinks) ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Blog Posts for Approval */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5 ml-2 mb-6">
                    <FileText size={13} className="text-brand-500" /> Artigos Blog
                  </h3>
                  <div className="space-y-3">
                    {blogPosts.filter(p => 
                      ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas', 'Ajustes Necessários'].includes(p.status) && 
                      p.clientName && 
                      p.clientName !== 'Agência' && 
                      (!selectedHubClient || p.clientName === selectedHubClient) &&
                      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 ? (
                      <div className="py-16 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sem ativos correspondentes</p>
                      </div>
                    ) : (
                      blogPosts.filter(p => 
                        ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas', 'Ajustes Necessários'].includes(p.status) && 
                        p.clientName && 
                        p.clientName !== 'Agência' && 
                        (!selectedHubClient || p.clientName === selectedHubClient) &&
                        (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).map(post => (
                        <div key={post.id} className={`bg-white border rounded-[20px] p-6 hover:shadow-lg transition-all group overflow-hidden relative ${post.status === 'Ajustes Necessários' ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'} ${selectedIds.includes(post.id) ? 'ring-2 ring-brand-500 border-brand-500 shadow-brand-500/5' : ''}`}>
                          {/* Selection Checkbox */}
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleSelection(post.id); }}
                            className={`absolute right-4 top-4 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedIds.includes(post.id) ? 'bg-brand-500 border-brand-500 text-white scale-110 shadow-lg' : 'border-slate-100 bg-white/50 text-transparent hover:border-brand-500'}`}
                          >
                            <Check size={14} strokeWidth={4} />
                          </div>
                          <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-bold bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-lg uppercase tracking-[0.1em]">{post.clientName}</span>
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                                <Calendar size={11} /> {post.targetMonth}
                              </span>
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                              post.status === 'Ajustes Necessários' ? 'text-rose-600 bg-rose-50' : 
                              post.status === 'Aprovado' ? 'text-emerald-600 bg-emerald-50' : 
                              'text-amber-600 bg-amber-50'
                            }`}>{post.status}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-brand-600 transition-colors relative z-10">{post.title}</h4>
                          {post.clientComment && (
                            <p className="text-[10px] text-rose-500 font-medium italic mb-4 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                              Feedback do Cliente: "{post.clientComment}"
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                            <button 
                              onClick={() => { setPostForm({ clientComment: '', ...post }); setShowPostForm(true); }}
                              className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                              <Search size={13} /> {post.status === 'Ajustes Necessários' ? 'Ver Ajustes' : 'Revisar'}
                            </button>
                            <div className="flex gap-2">
                              {post.status === 'Aprovado' && (
                                <button onClick={() => updatePostStatus(post.id, 'Publicado')} className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all shadow-md">
                                  <Check size={14} /> Publicar
                                </button>
                              )}
                              {post.status === 'Ajustes Necessários' && (
                                <button onClick={() => updatePostStatus(post.id, 'Em Produção')} className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand-600 transition-all shadow-md">
                                  <RefreshCcw size={14} /> Refazer
                                </button>
                              )}
                              {post.status === 'Aguardando Aprovação' && (
                                <div className="flex flex-col items-end">
                                  <span className="text-[9px] font-bold text-slate-300 uppercase italic">Aguardando Cliente...</span>
                                  {post.remainingApprovalDays !== undefined && (
                                    <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
                                      Number(post.remainingApprovalDays) <= 1 ? 'text-rose-500 animate-pulse' : 'text-amber-500'
                                    }`}>
                                      {post.remainingApprovalDays} {Number(post.remainingApprovalDays) === 1 ? 'dia útil' : 'dias úteis'} restantes
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Backlinks for Approval */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5 ml-2 mb-6">
                    <LinkIcon size={13} className="text-violet-500" /> Links Estratégicos
                  </h3>
                  <div className="space-y-3">
                    {backlinks.filter(b => 
                      ['Aguardando Aprovação', 'Aprovado'].includes(b.status) && 
                      b.clientName && 
                      b.clientName !== 'Agência' && 
                      (!selectedHubClient || b.clientName === selectedHubClient) &&
                      (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 ? (
                      <div className="py-16 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nenhum backlink encontrado</p>
                      </div>
                    ) : (
                      backlinks.filter(b => 
                        ['Aguardando Aprovação', 'Aprovado'].includes(b.status) && 
                        b.clientName && 
                        b.clientName !== 'Agência' && 
                        (!selectedHubClient || b.clientName === selectedHubClient) &&
                        (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).map(link => (
                        <div key={link.id} className={`bg-white border border-slate-100 rounded-[20px] p-6 hover:shadow-lg transition-all group overflow-hidden relative ${selectedIds.includes(link.id) ? 'ring-2 ring-brand-500 border-brand-500 shadow-brand-500/5' : ''}`}>
                          {/* Selection Checkbox */}
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleSelection(link.id); }}
                            className={`absolute right-4 top-4 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedIds.includes(link.id) ? 'bg-brand-500 border-brand-500 text-white scale-110 shadow-lg' : 'border-slate-100 bg-white/50 text-transparent hover:border-brand-500'}`}
                          >
                            <Check size={14} strokeWidth={4} />
                          </div>
                          <div className="flex items-center gap-3 mb-4 relative z-10">
                            <span className="text-[9px] font-bold bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-lg uppercase tracking-[0.1em]">{link.clientName}</span>
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                              <Calendar size={11} /> {link.targetMonth}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight mb-6 group-hover:text-violet-600 transition-colors relative z-10">{link.title}</h4>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                            <button 
                              onClick={() => { setBacklinkForm(link); setShowBacklinkForm(true); }}
                              className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                              <Search size={13} /> Detalhes
                            </button>
                            <div className="flex gap-2">
                              <button onClick={() => updateBacklinkStatus(link.id, 'Publicado')} className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                <Check size={16} />
                              </button>
                              <button onClick={() => updateBacklinkStatus(link.id, 'AjustesNecessários')} className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>         ) : activeTab === 'Monitoramento de Rankings' ? (
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
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-brand-600 rounded-full"></div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">Saúde Financeira</h2>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Painel Consolidado de Recebíveis</p>
                </div>

                <div className="flex items-center gap-4">
                  {globalPayments.some(p => p.status === 'pendente') && (
                    <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center relative">
                        <AlertCircle size={20} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Confirmações Pendentes</p>
                        <p className="text-xs font-black text-amber-900 tracking-tight">
                          {globalPayments.filter(p => p.status === 'pendente').length} Aguardando
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Recebido (Mês)</p>
                      <p className="text-xs font-black text-slate-900 tracking-tight">
                        R$ {globalPayments
                          .filter(p => p.status !== 'pendente' && p.paymentMonth === new Date().toISOString().slice(0, 7))
                          .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                          .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (clients.length > 0) {
                        setSelectedClientForPayments(clients[0]);
                        setShowPaymentModal(true);
                      }
                    }}
                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                    title="Novo Pagamento"
                  >
                    <Plus size={20} />
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fluxo de Caixa (Lançamentos Recentes)</h3>
                    <button onClick={loadGlobalPayments} className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><RefreshCcw size={14} className={loadingGlobalPayments ? 'animate-spin' : ''} /></button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Mês Ref.</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                          <th className="px-8 py-4 text-center"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingGlobalPayments ? (
                          <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" /></td></tr>
                        ) : globalPayments.length === 0 ? (
                          <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum registro encontrado</td></tr>
                        ) : globalPayments.map(payment => (
                          <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="text-xs font-black text-slate-900 tracking-tight">{payment.clientName}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[9px] text-slate-400 font-medium">{payment.description}</p>
                                {clients.find(c => c.id === payment.clientId)?.packageValue && (
                                  <>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <span className="text-[8px] font-black text-brand-500 uppercase tracking-widest">Ref. R$ {Number(clients.find(c => c.id === payment.clientId).packageValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(payment.paymentDate + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                            <td className="px-8 py-6">
                              <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{payment.paymentMonth}</span>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                                 payment.status === 'pendente' ? 'bg-amber-100 text-amber-600 border border-amber-200 animate-pulse' :
                                 payment.type === 'Mensalidade' ? 'bg-emerald-100 text-emerald-600' : 
                                 payment.type === 'Setup' ? 'bg-indigo-100 text-indigo-600' :
                                 'bg-amber-100 text-amber-600'
                               }`}>
                                 {payment.status === 'pendente' ? 'Aguardando Aprovação' : (payment.type || 'Lançamento')}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className="text-xs font-black text-slate-900 tracking-tighter">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <div className="flex items-center justify-center gap-2">
                                 {payment.status === 'pendente' ? (
                                   <button 
                                     onClick={() => handleConfirmPayment(payment)}
                                     className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm"
                                     title="Confirmar Recebimento"
                                   >
                                     <Check size={14} />
                                   </button>
                                 ) : (
                                   <div className="p-2 text-emerald-400 opacity-20">
                                     <CheckCircle2 size={14} />
                                   </div>
                                 )}
                                 <button 
                                   onClick={() => handleDeletePayment(payment)}
                                   className="p-2 text-slate-200 hover:text-rose-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                 >
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

               <div className="space-y-8">
                  <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                     <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={120} />
                     </div>
                     <h4 className="text-[9px] font-black text-brand-400 uppercase tracking-widest mb-8">Performance Comercial</h4>
                     <div className="space-y-6 relative z-10">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MRR Atual (Mensalidade)</p>
                          <p className="text-xl font-black tracking-tight">
                            R$ {clients
                              .filter(c => (c.status === 'Ativo' || c.active !== false) && c.name !== 'Agência')
                              .reduce((acc, curr) => acc + (Number(curr.packageValue) || 0), 0)
                              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Churn Rate (Cancelados)</p>
                          <p className="text-lg font-black text-rose-400">
                            {clients.filter(c => c.status === 'Cancelado').length} <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Unidades</span>
                          </p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                     <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-6">Próximos Vencimentos</h4>
                     <div className="space-y-4">
                        {clients
                          .filter(c => c.name !== 'Agência' && c.active !== false && c.status !== 'Cancelado')
                          .filter(c => {
                             const status = getPaymentStatus(c);
                             return status.label === 'Vencimento Próximo' || status.label === 'Vencimento Hoje' || status.label === 'Em atraso';
                          })
                          .slice(0, 5)
                          .map(client => {
                            const status = getPaymentStatus(client);
                            return (
                              <div key={client.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                                 <div>
                                   <p className="text-[10px] font-black text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{client.name}</p>
                                   <p className={`text-[8px] font-black uppercase ${status.text}`}>{status.label}</p>
                                 </div>
                                 <button 
                                   onClick={() => handleTogglePayment(client)}
                                   className="p-2 bg-white text-slate-400 hover:text-brand-600 rounded-xl transition-all shadow-sm"
                                 >
                                   <ArrowRight size={14} />
                                 </button>
                              </div>
                            );
                          })}
                        {clients.filter(c => c.name !== 'Agência' && c.active !== false && c.status !== 'Cancelado' && ['Vencimento Próximo', 'Vencimento Hoje', 'Em atraso'].includes(getPaymentStatus(c).label)).length === 0 && (
                          <div className="py-6 text-center">
                            <CheckCircle size={24} className="mx-auto text-emerald-100 mb-2" />
                            <p className="text-[9px] font-black text-slate-300 uppercase">Tudo em dia</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             </div>
          </motion.div>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 lg:p-10 overflow-hidden">
               <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-12">
                 <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Planejamento de Pautas</h2>
                      <button 
                        onClick={() => loadKeywordsUniverse(true)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-200 hover:text-slate-900 group"
                      >
                        <RefreshCcw size={16} className={`${loadingKeywords ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] mt-2">Definição estratégica de temas para o ciclo {selectedCycle}</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setKeywordForm({ 
                          id: '', 
                          keyword: '', 
                          searchVolume: '', 
                          difficulty: '', 
                          clientName: selectedHubClient, 
                          clientEmail: '', 
                          status: 'Planejado', 
                          notes: '', 
                          targetMonth: selectedCycle, 
                          targetWords: '',
                          internalLinking: '',
                          theme: '',
                          secondaryKeywords: ''
                        });
                        setShowKeywordForm(true);
                      }}
                      className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all px-8 py-3.5 shadow-md"
                    >
                      Reservar Tema
                    </button>
                 </div>
               </div>

               <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-8 py-5">Tema Planejado / Keyword</td>
                        <td className="px-8 py-5 text-center">Performance Est.</td>
                        <td className="px-8 py-5">Unidade</td>
                        <td className="px-8 py-5 text-right">Ação</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingKeywords ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skel-kw-${i}`}>
                            <td className="px-8 py-6">
                              <Skeleton variant="rectangular" className="h-6 w-64 mb-2" />
                              <Skeleton variant="text" className="w-24" />
                            </td>
                            <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-10 w-32 mx-auto" /></td>
                            <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-6 w-24" /></td>
                            <td className="px-8 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : keywordsUniverse.filter(k => (!selectedHubClient || k.clientName === selectedHubClient) && k.targetMonth === selectedCycle).length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-24 text-slate-300 uppercase text-[10px] font-bold tracking-[0.15em]">Nenhum tema planejado para este ciclo</td></tr>
                      ) : keywordsUniverse.filter(k => (!selectedHubClient || k.clientName === selectedHubClient) && k.targetMonth === selectedCycle).map((kw: any) => (
                        <tr key={kw.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                          <td className="px-8 py-6">
                            <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight mb-1 group-hover:text-brand-600 transition-colors uppercase max-w-[480px] truncate">{kw.keyword}</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Tema Principal</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-4">
                              <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Vol.</p>
                                <p className="text-xs font-bold text-slate-900 font-mono">{kw.searchVolume || '0'}</p>
                              </div>
                              <div className="w-px h-6 bg-slate-100"></div>
                              <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">KD</p>
                                <p className={`text-xs font-bold font-mono ${
                                  parseInt(kw.difficulty) > 70 ? 'text-rose-500' :
                                  parseInt(kw.difficulty) > 40 ? 'text-amber-500' :
                                  'text-emerald-500'
                                }`}>{kw.difficulty || '0'}%</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="inline-flex text-[9px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md uppercase tracking-[0.1em]">{kw.clientName || 'Geral'}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                               <button onClick={() => { setActiveTab('Artigos e Conteúdos'); setTimeout(() => promoteKeywordToPost(kw), 100); }} title="Iniciar Produção" className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-200 hover:text-emerald-500 shadow-sm transition-all"><Rocket size={14} /></button>
                               <button onClick={() => { setKeywordForm(kw); setShowKeywordForm(true); }} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-slate-900 shadow-sm transition-all"><Edit3 size={14} /></button>
                               <button onClick={() => handleDeleteKeyword(kw.id)} className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-200 hover:text-rose-500 shadow-sm transition-all"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20 text-left">
            {/* Header / Submenu */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Suporte Técnico & Atendimento</h2>
                <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-widest font-bold">Controle de chamados em tempo real e usuários ativos no site</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={checkOnlineUsers}
                  disabled={checkingOnline}
                  className="flex items-center gap-2 px-5 py-3.5 bg-brand-50 hover:bg-brand-100 disabled:bg-slate-50 text-brand-600 disabled:text-slate-400 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer select-none"
                >
                  <Users size={14} />
                  {checkingOnline ? 'Consultando...' : 'Consultar Usuários Online'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tickets & Online users */}
              <div className="xl:col-span-4 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Chamados de Suporte ({adminTickets.length})</p>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {loadingAdminTickets ? (
                      <div className="p-12 text-center text-slate-400 text-xs">Carregando chamados...</div>
                    ) : adminTickets.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Nenhum chamado aberto.</div>
                    ) : (
                      adminTickets.map((t: any) => {
                        const isSelected = selectedAdminTicket?.id === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => handleAdminSelectTicket(t)}
                            className={`w-full text-left p-6 rounded-[2rem] border transition-all relative ${
                              isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                : 'bg-white border-slate-100 text-slate-800 hover:border-slate-200 hover:bg-slate-50/50'
                            }`}
                          >
                            {t.unreadByAdmin && (
                              <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-brand-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                            <div className="pr-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-md ${
                                  t.status === 'pending' 
                                    ? 'bg-amber-100 text-amber-700 font-semibold' 
                                    : t.status === 'answered' 
                                      ? 'bg-emerald-100 text-emerald-700 font-semibold' 
                                      : 'bg-slate-100 text-slate-500 font-semibold'
                                }`}>
                                  {t.status === 'pending' 
                                    ? 'Pendente' 
                                    : t.status === 'answered' 
                                      ? 'Respondido' 
                                      : 'Fechado'}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
                                  {t.clientName}
                                </span>
                              </div>
                              <h4 className="text-sm font-black truncate uppercase tracking-tight">{t.subject}</h4>
                              <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                {t.lastMessage}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Online Users Section */}
                <div>
                  <div className="flex justify-between items-center mb-3 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Usuários Online ({onlineUsers.filter(u => u.isOnline).length})</p>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider font-mono">Últimas 24h</span>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-sm max-h-[350px] overflow-y-auto no-scrollbar">
                    {onlineUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhuma consulta realizada</p>
                        <p className="text-[9px] text-slate-400/80 mt-1">Clique no botão "Consultar Usuários Online" para puxar as presenças ativas.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {onlineUsers.map((u: any) => (
                          <div key={u.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                            <div className="min-w-0 flex-1 text-left">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full shadow ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-xs font-black text-slate-800 truncate uppercase mt-0.5">{u.name || u.email?.split('@')[0] || 'Usuário'}</span>
                              </div>
                              <p className="text-[10px] text-slate-450 font-medium truncate lowercase">{u.email || 'Sem e-mail'}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                                Role: {u.role === 'admin' ? 'Administrador' : 'Cliente'} • {u.lastActive?.toDate ? `Ativo às ${u.lastActive.toDate().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}` : 'Sem registro'}
                              </p>
                            </div>

                            {u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  // Find if there is an existing ticket or open empty chat for user status
                                  const existingTicket = adminTickets.find((t: any) => t.clientUid === u.id);
                                  if (existingTicket) {
                                    handleAdminSelectTicket(existingTicket);
                                    addToast(`Abrindo canal existente para ${u.name}!`, 'success');
                                  } else {
                                    // Set up subject for virtual quick chat
                                    setSelectedAdminTicket({
                                      id: `temp-${u.id}`,
                                      clientUid: u.id,
                                      clientName: u.name || 'Cliente',
                                      clientEmail: u.email || '',
                                      subject: 'Suporte Técnico Direto',
                                      status: 'pending',
                                      isTemporary: true
                                    });
                                    addToast('Iniciando conversa direta!', 'info');
                                  }
                                }}
                                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-100 rounded-lg text-[9px] font-black uppercase tracking-wider transition shrink-0 select-none cursor-pointer"
                              >
                                Conversar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Conversation */}
              <div className="xl:col-span-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col h-[580px] overflow-hidden">
                {selectedAdminTicket ? (
                  <>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="min-w-0 text-left">
                        <span className="text-[8px] font-black text-brand-600 uppercase tracking-widest font-mono">Conversando com {selectedAdminTicket.clientName}</span>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight truncate leading-snug">{selectedAdminTicket.subject}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 font-mono">
                          ID: {selectedAdminTicket.isTemporary ? 'TEMPORÁRIO' : `#${selectedAdminTicket.id.substring(0, 8)}`} • Email: {selectedAdminTicket.clientEmail}
                        </p>
                      </div>

                      {selectedAdminTicket.status !== 'closed' && !selectedAdminTicket.isTemporary && (
                        <button
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, 'support_tickets', selectedAdminTicket.id), {
                                status: 'closed',
                                updatedAt: serverTimestamp()
                              });
                              addToast('Chamado finalizado!', 'success');
                              setSelectedAdminTicket(prev => ({...prev, status: 'closed'}));
                              fetchAdminTickets();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 font-black rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer"
                        >
                          Resolver Chamado
                        </button>
                      )}
                    </div>

                    {/* Messages feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                      {selectedAdminTicket.isTemporary ? (
                        <div className="text-center py-20 px-8 text-slate-400 space-y-2">
                          <MessageSquareText size={28} className="mx-auto text-slate-300 animate-bounce" />
                          <p className="text-[11px] font-black uppercase tracking-wider">Novo Canal Direto</p>
                          <p className="text-[10px] leading-relaxed max-w-md mx-auto font-medium">Este cliente ainda não abriu problemas específicos, mas você pode iniciar uma conversa enviando uma mensagem. Isso criará um chamado formalizado automaticamente.</p>
                        </div>
                      ) : adminTicketMessages.length === 0 ? (
                        <div className="text-center py-12 text-slate-300 text-xs uppercase tracking-widest font-bold">Sem mensagens iniciadas...</div>
                      ) : (
                        adminTicketMessages.map((m: any) => {
                          const isSenderAdmin = m.senderRole === 'admin';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col max-w-[80%] ${isSenderAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                                {m.senderName} ({isSenderAdmin ? 'Você' : 'Cliente'})
                              </span>
                              <div className={`p-4 rounded-3xl text-sm ${
                                isSenderAdmin 
                                  ? 'bg-brand-600 text-white rounded-tr-none text-left' 
                                  : 'bg-white border border-slate-105 text-slate-800 rounded-tl-none font-medium'
                              }`}>
                                <p className="leading-relaxed whitespace-pre-line font-medium">{m.message}</p>
                              </div>
                              <span className="text-[8px] font-mono text-slate-400 mt-1 px-1">
                                {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : 'Agora'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer Input Bar */}
                    {selectedAdminTicket.status === 'closed' ? (
                      <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-center font-black text-[10px] uppercase text-slate-400 tracking-wider">
                        Este chamado foi marcado como encerrado.
                      </div>
                    ) : (
                      <div className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
                        <textarea
                          rows={1}
                          value={adminReplyText}
                          onChange={e => setAdminReplyText(e.target.value)}
                          onKeyDown={async e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (selectedAdminTicket.isTemporary) {
                                setSendingAdminReply(true);
                                try {
                                  const ticketRef = doc(collection(db, 'support_tickets'));
                                  await setDoc(ticketRef, {
                                    subject: 'Suporte Técnico Direto',
                                    clientEmail: selectedAdminTicket.clientEmail,
                                    clientName: selectedAdminTicket.clientName,
                                    clientUid: selectedAdminTicket.clientUid,
                                    status: 'pending',
                                    createdAt: serverTimestamp(),
                                    updatedAt: serverTimestamp(),
                                    unreadByAdmin: false,
                                    unreadByClient: true,
                                    lastMessage: adminReplyText.substring(0, 150)
                                  });

                                  await setDoc(doc(collection(db, 'support_tickets', ticketRef.id, 'messages')), {
                                    senderId: auth.currentUser?.uid,
                                    senderName: 'Atendimento Acelera SEO',
                                    senderRole: 'admin',
                                    message: adminReplyText,
                                    createdAt: serverTimestamp()
                                  });

                                  setAdminReplyText('');
                                  addToast('Chamado inicial criado!', 'success');
                                  fetchAdminTickets();
                                  setSelectedAdminTicket({
                                    id: ticketRef.id,
                                    clientEmail: selectedAdminTicket.clientEmail,
                                    clientName: selectedAdminTicket.clientName,
                                    clientUid: selectedAdminTicket.clientUid,
                                    subject: 'Suporte Técnico Direto',
                                    status: 'pending'
                                  });
                                } catch (err) {
                                  console.error(err);
                                } finally {
                                  setSendingAdminReply(false);
                                }
                              } else {
                                handleSendAdminReply();
                              }
                            }
                          }}
                          placeholder="Escreva sua resposta de suporte..."
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 max-h-24 resize-none"
                        />
                        <button
                          disabled={sendingAdminReply || !adminReplyText.trim()}
                          onClick={async () => {
                            if (selectedAdminTicket.isTemporary) {
                              setSendingAdminReply(true);
                              try {
                                const ticketRef = doc(collection(db, 'support_tickets'));
                                await setDoc(ticketRef, {
                                  subject: 'Suporte Técnico Direto',
                                  clientEmail: selectedAdminTicket.clientEmail,
                                  clientName: selectedAdminTicket.clientName,
                                  clientUid: selectedAdminTicket.clientUid,
                                  status: 'pending',
                                  createdAt: serverTimestamp(),
                                  updatedAt: serverTimestamp(),
                                  unreadByAdmin: false,
                                  unreadByClient: true,
                                  lastMessage: adminReplyText.substring(0, 150)
                                });

                                await setDoc(doc(collection(db, 'support_tickets', ticketRef.id, 'messages')), {
                                  senderId: auth.currentUser?.uid,
                                  senderName: 'Atendimento Acelera SEO',
                                  senderRole: 'admin',
                                  message: adminReplyText,
                                  createdAt: serverTimestamp()
                                });

                                setAdminReplyText('');
                                addToast('Chamado inicial criado!', 'success');
                                fetchAdminTickets();
                                setSelectedAdminTicket({
                                  id: ticketRef.id,
                                  clientEmail: selectedAdminTicket.clientEmail,
                                  clientName: selectedAdminTicket.clientName,
                                  clientUid: selectedAdminTicket.clientUid,
                                  subject: 'Suporte Técnico Direto',
                                  status: 'pending'
                                });
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setSendingAdminReply(false);
                              }
                            } else {
                              handleSendAdminReply();
                            }
                          }}
                          className="p-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-2xl transition shadow-lg active:scale-95 cursor-pointer"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                    <MessageSquareText size={32} className="stroke-[1.5] text-slate-200 mb-3" />
                    <p className="text-xs uppercase font-black tracking-widest text-slate-450">Nenhum chamado selecionado</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm font-medium">Consulte as conversas de suporte abertas pelos clientes ou ative a verificação de usuários online.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'Configurações' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <SettingsGlobal />
          </motion.div>
        ) : null}
      </div>
    </main>

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
    />

    <BacklinkFormModal 
      showBacklinkForm={showBacklinkForm}
      setShowBacklinkForm={setShowBacklinkForm}
      backlinkForm={backlinkForm}
      setBacklinkForm={setBacklinkForm}
      handleSaveBacklink={handleSaveBacklink}
      clientsList={clientsList}
      isSaving={isSaving}
    />

    <KeywordFormModal
      showKeywordForm={showKeywordForm}
      setShowKeywordForm={setShowKeywordForm}
      keywordForm={keywordForm}
      setKeywordForm={setKeywordForm}
      handleSaveKeyword={handleSaveKeyword}
      clientsList={clientsList}
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
    />

    <ToastContainer toasts={toasts} removeToast={removeToast} />
  </div>
);
}

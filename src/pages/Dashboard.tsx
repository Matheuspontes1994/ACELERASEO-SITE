import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import YoastTrafficLight from '../components/YoastTrafficLight';
import { 
  TrendingUp, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  CheckCircle,
  Calendar,
  Trash2,
  Edit2,
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
  Loader2,
  Circle,
  AlertCircle,
  Zap,
  LogOut,
  RefreshCcw,
  Key
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, where, startAfter } from 'firebase/firestore';
import { db, auth } from '../firebase';
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
import SettingsGlobal from '../components/SettingsGlobal';

import { HorizontalScroll } from '../components/HorizontalScroll';

export default function Dashboard() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email !== 'matheuspontes290594@gmail.com' && user.email !== 'aceleraseo@gmail.com') {
       navigate('/portal-cliente', { replace: true });
    }
  }, [navigate]);

  const [portalMode, setPortalMode] = useState<'agencia' | 'clientes'>('agencia');
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [filterClient, setFilterClient] = useState('');
  const [subTabCrm, setSubTabCrm] = useState('Clientes');
  const [siteUrl, setSiteUrl] = useState('');
  
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

  const [showGscPrompt, setShowGscPrompt] = useState(false);
  const [loadingGSC, setLoadingGSC] = useState(false);
  const [gscError, setGscError] = useState('');
  const [gscData, setGscData] = useState<any>(null);

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
    try {
      const { id, ...data } = categoryForm;
      const slug = data.slug || data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const payload = {
        ...data,
        slug,
        updatedAt: serverTimestamp()
      };

      if (id) {
        const oldCategory = categories.find(c => c.id === id);
        await updateDoc(doc(db, 'blog_categories', id), payload);
        
        // If name changed, update all posts belonging to this category
        if (oldCategory && oldCategory.name !== data.name) {
          const postsQ = query(collection(db, 'blog_posts'), where('category', '==', oldCategory.name));
          const postsSnap = await getDocs(postsQ);
          const updatePromises = postsSnap.docs.map(postDoc => 
            updateDoc(postDoc.ref, { category: data.name })
          );
          await Promise.all(updatePromises);
        }
      } else {
        await addDoc(collection(db, 'blog_categories'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      setShowCategoryForm(false);
      loadCategories();
      alert("Categoria salva com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar categoria.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (cat.isProtected || cat.name === 'Geral') {
      alert("A categoria Geral é protegida e não pode ser excluída.");
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
      alert(`Categoria excluída. ${updatePromises.length} artigos foram movidos para "Geral".`);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir categoria.");
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
      await updateDoc(doc(db, collectionName, id), { status: newStatus });
      if (collectionName === 'audit_leads') {
        setAuditLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      } else {
        setContactLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      }
    } catch (err) {
      console.error("Erro ao atualizar status", err);
      alert("Erro ao atualizar status. Você precisa estar autenticado.");
    }
  };

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showBacklinkForm, setShowBacklinkForm] = useState(false);
  const [postForm, setPostForm] = useState({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
  const [backlinkForm, setBacklinkForm] = useState({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });

  // Hub Clients Settings
  const [selectedHubClient, setSelectedHubClient] = useState('');
  const [keywordsUniverse, setKeywordsUniverse] = useState<any[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [keywordForm, setKeywordForm] = useState({ id: '', clientName: '', clientEmail: '', keyword: '', searchVolume: '', difficulty: '', status: 'Disponível', notes: '', targetMonth: '', targetWords: '' });

  // Client Management State
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', active: true, approvalDeadlineDays: '5', lastPaymentMonth: '', websiteUrl: '',
    extraMonth: '', extraPosts: '0', extraBacklinks: '0', extraDevHours: '0'
  });

  const loadClients = async () => {
    if (!auth.currentUser) return;
    try {
      setLoadingClients(true);
      const q = portalMode === 'agencia'
        ? query(collection(db, 'clients'), where('agencyUid', '==', auth.currentUser.uid))
        : query(collection(db, 'clients'), where('websiteUrl', '==', auth.currentUser.email));
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a: any, b: any) => (a.name||'').localeCompare(b.name||''));
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (clientForm.id) {
        await updateDoc(doc(db, 'clients', clientForm.id), {
          ...clientForm,
          monthlyPosts: Number(clientForm.monthlyPosts),
          monthlyBacklinks: Number(clientForm.monthlyBacklinks),
          initialDevHours: Number(clientForm.initialDevHours),
          monthlyDevHours: Number(clientForm.monthlyDevHours),
          billingDay: Number(clientForm.billingDay),
          approvalDeadlineDays: Number(clientForm.approvalDeadlineDays),
          extraPosts: Number(clientForm.extraPosts || 0),
          extraBacklinks: Number(clientForm.extraBacklinks || 0),
          extraDevHours: Number(clientForm.extraDevHours || 0),
          updatedAt: serverTimestamp()
        });
        alert("Cliente atualizado!");
      } else {
        await addDoc(collection(db, 'clients'), {
          ...clientForm,
          monthlyPosts: Number(clientForm.monthlyPosts),
          monthlyBacklinks: Number(clientForm.monthlyBacklinks),
          initialDevHours: Number(clientForm.initialDevHours),
          monthlyDevHours: Number(clientForm.monthlyDevHours),
          billingDay: Number(clientForm.billingDay),
          approvalDeadlineDays: Number(clientForm.approvalDeadlineDays),
          extraPosts: Number(clientForm.extraPosts || 0),
          extraBacklinks: Number(clientForm.extraBacklinks || 0),
          extraDevHours: Number(clientForm.extraDevHours || 0),
          createdAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
        alert("Cliente cadastrado!");
      }
      setShowClientForm(false);
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cliente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir cliente.");
    }
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
        alert(`${data.count} URLs auditadas com sucesso!`);
        loadSeoPages();
      } else {
        alert("Erro na auditoria: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com servidor de auditoria.");
    } finally {
      setIsAuditing(false);
    }
  };

  const generateInviteLink = (client: any) => {
    const baseUrl = window.location.origin;
    // Link format: /cadastro?clientId=XYZ&clientEmail=abc@example.com
    const inviteLink = `${baseUrl}/cadastro?clientId=${client.id}&clientEmail=${encodeURIComponent(client.clientEmail || '')}&clientName=${encodeURIComponent(client.name || '')}&clientWebsite=${encodeURIComponent(client.websiteUrl || '')}`;
    navigator.clipboard.writeText(inviteLink);
    alert("Link de cadastro personalizado copiado! Envie este link para o cliente realizar o cadastro e vincular sua conta automaticamente.");
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      alert("Este cliente não possui um e-mail cadastrado.");
      return;
    }

    if (window.confirm(`Deseja enviar um e-mail de redefinição de senha para ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert(`E-mail de redefinição enviado com sucesso para ${email}! O cliente deve verificar a caixa de entrada.`);
      } catch (error: any) {
        console.error("Erro ao enviar reset de senha:", error);
        alert("Ocorreu um erro ao enviar o e-mail. Verifique se o e-mail é válido e está cadastrado no sistema.");
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
    } else if (activeTab === 'Conteúdo Interno (Acelera)' || activeTab === 'Hub de Clientes' || activeTab === 'Planejamento' || activeTab === 'Artigos e Conteúdos' || activeTab === 'Backlinks' || activeTab === 'Aprovações Pendentes') {
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

  const loadKeywordsUniverse = async () => {
    if (!auth.currentUser) return;
    setLoadingKeywords(true);
    try {
      const q = portalMode === 'agencia' 
        ? query(collection(db, 'keyword_universe'), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(150))
        : query(collection(db, 'keyword_universe'), where('clientEmail', '==', auth.currentUser.email), orderBy('createdAt', 'desc'), limit(150));
      
      const querySnapshot = await getDocs(q);
      const kws: any[] = [];
      querySnapshot.forEach((doc) => {
        kws.push({ ...doc.data(), id: doc.id });
      });
      setKeywordsUniverse(kws);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleSaveKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
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
        updatedAt: serverTimestamp()
      };
      if (id) {
        await updateDoc(doc(db, 'keyword_universe', id), dataToSave);
      } else {
        await addDoc(collection(db, 'keyword_universe'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
      }
      setShowKeywordForm(false);
      setKeywordForm({ id: '', clientName: '', clientEmail: '', keyword: '', searchVolume: '', difficulty: '', status: 'Disponível', notes: '', targetMonth: '', targetWords: '' });
      loadKeywordsUniverse();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar palavra-chave");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'keyword_universe', id));
      loadKeywordsUniverse();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir palavra-chave.");
    }
  };

  const loadBlogPosts = async () => {
    if (!auth.currentUser) return;
    setLoadingPosts(true);
    try {
      const q = portalMode === 'agencia'
        ? query(collection(db, 'blog_posts'), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(50))
        : query(collection(db, 'blog_posts'), where('clientEmail', '==', auth.currentUser.email), orderBy('createdAt', 'desc'), limit(50));
      
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
            updateDoc(docSnap.ref, { status: 'Aprovado', clientComment: 'Aprovado automaticamente pelo prazo vencido.', updatedAt: serverTimestamp() });
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
    } catch (error) {
      console.error("Erro ao carregar posts", error);
    }
    setLoadingPosts(false);
  };

  const handleSaveDraft = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const { id, ...saveData } = postForm;
      const dataToSave = {
        ...saveData,
        targetWords: saveData.targetWords || '',
        status: 'Rascunho',
        updatedAt: serverTimestamp()
      };
      if (id) {
        await updateDoc(doc(db, 'blog_posts', id), dataToSave);
      } else {
        await addDoc(collection(db, 'blog_posts'), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      setShowPostForm(false);
      setPostForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
      loadBlogPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (postForm.id) {
        await updateDoc(doc(db, 'blog_posts', postForm.id), {
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
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'blog_posts'), {
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
      setPostForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
      loadBlogPosts();
    } catch (error) {
      console.error("Erro ao salvar post", error);
      alert("Erro ao salvar artigo. Verifique as regras de segurança.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string, coverImageUrl?: string) => {
    if(!id) return;
    try {
      if (coverImageUrl && coverImageUrl.includes('firebasestorage')) {
        try {
          const { ref, deleteObject } = await import('firebase/storage');
          const { storage } = await import('../firebase');
          const fileRef = ref(storage, coverImageUrl);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.error("Erro ao excluir imagem do storage", storageErr);
        }
      }
      await deleteDoc(doc(db, 'blog_posts', id));
      loadBlogPosts();
    } catch (error) {
       console.error("Erro ao excluir", error);
       alert("Erro ao excluir artigo.");
    }
  };

  const loadBacklinks = async () => {
    if (!auth.currentUser) return;
    setLoadingBacklinks(true);
    try {
      const q = portalMode === 'agencia'
        ? query(collection(db, 'backlinks'), where('agencyUid', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(50))
        : query(collection(db, 'backlinks'), where('clientEmail', '==', auth.currentUser.email), orderBy('createdAt', 'desc'), limit(50));
      
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
            updateDoc(docSnap.ref, { status: 'Aprovado', clientComment: 'Aprovado automaticamente pelo prazo vencido.', updatedAt: serverTimestamp() });
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
    } catch (error) {
      console.error("Erro ao carregar backlinks", error);
    }
    setLoadingBacklinks(false);
  };

  const handleSaveBacklink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (backlinkForm.id) {
        await updateDoc(doc(db, 'backlinks', backlinkForm.id), {
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
          status: backlinkForm.status || 'Rascunho',
          publishedAt: backlinkForm.publishedAt || '',
          publishedUrl: backlinkForm.publishedUrl || '',
          wordCount: backlinkForm.wordCount || '',
          targetWords: backlinkForm.targetWords || '',
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'backlinks'), {
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
          status: backlinkForm.status || 'Rascunho',
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
      setBacklinkForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
      loadBacklinks();
    } catch (error) {
      console.error("Erro ao salvar backlink", error);
      alert("Erro ao salvar backlink. Verifique as regras de segurança.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBacklink = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'backlinks', id));
      loadBacklinks();
    } catch (error) {
      console.error("Erro ao excluir backlink", error);
      alert("Erro ao excluir backlink.");
    }
  };

  const loadContactLeads = async (isLoadMore = false) => {
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
      console.error("Erro ao carregar contatos", error);
    }
    setContactLoadingMore(false);
  };

  const loadAuditLeads = async (isLoadMore = false) => {
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
      console.error("Erro ao carregar leads", error);
    }
    setLoadingLeads(false);
    setAuditLoadingMore(false);
  };

  const loadSeoPages = async () => {
    if (!auth.currentUser) return;
    setLoadingSeo(true);
    try {
      const q = portalMode === 'agencia'
        ? query(collection(db, 'seo_pages'), where('agencyUid', '==', auth.currentUser.uid), limit(400))
        : query(collection(db, 'seo_pages'), where('clientEmail', '==', auth.currentUser.email), limit(400));
      
      const querySnapshot = await getDocs(q);
      const pages: any[] = [];
      querySnapshot.forEach((doc) => {
        pages.push({ ...doc.data(), id: doc.id });
      });
      pages.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setSeoPages(pages);
    } catch (error) {
      console.error("Erro ao carregar paginas", error);
    }
    setLoadingSeo(false);
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (seoForm.id) {
        await updateDoc(doc(db, 'seo_pages', seoForm.id), {
          url: seoForm.url || '',
          title: seoForm.title || '',
          description: seoForm.description || '',
          customNotes: seoForm.customNotes || '',
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'seo_pages'), {
          url: seoForm.url || '',
          title: seoForm.title || '',
          description: seoForm.description || '',
          customNotes: seoForm.customNotes || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        });
      }
      setShowSeoForm(false);
      setSeoForm({ id: '', url: '', title: '', description: '', customNotes: '' });
      loadSeoPages();
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro ao salvar dados de SEO.");
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
      alert("Erro ao excluir monitoramento.");
    }
  };

  const filteredSeoPages = seoPages.filter(p => p.url.toLowerCase().includes(seoSearch.toLowerCase()) || p.title.toLowerCase().includes(seoSearch.toLowerCase()));

  const fetchGscData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl) {
      setGscError("Digite a URL ou Propriedade do site (ex: sc-domain:seusite.com.br)");
      return;
    }
    setLoadingGSC(true);
    setGscError('');
    try {
      const res = await fetch(`/api/search-console?siteUrl=${encodeURIComponent(siteUrl)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao buscar do Search Console");
      }
      const data = await res.json();
      setGscData(data);
      setShowGscPrompt(false);
    } catch(err: any) {
      setGscError(err.message);
    } finally {
      setLoadingGSC(false);
    }
  };

  const chartData = gscData?.clicksOverTime 
    ? gscData.clicksOverTime.map((row: any) => ({
        name: row.keys[0].split('-').slice(1).join('/'),
        clicks: row.clicks
      }))
    : defaultTrafficData;

  const currentKwData = gscData?.topKeywords
    ? gscData.topKeywords.map((row: any, i: number) => ({
        kw: row.keys[0],
        pos: row.position ? row.position.toFixed(1) : '-',
        diff: 0,
        vol: row.clicks + ' clicks'
      }))
    : defaultKwData;

  const totalClicksInfo = gscData?.clicksOverTime
    ? gscData.clicksOverTime.reduce((acc: number, val: any) => acc + val.clicks, 0).toLocaleString()
    : '14.2k';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500/30 selection:text-white">
      <Helmet>
        <title>Painel da Agência | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-100/30 to-transparent pointer-events-none z-0"></div>

      {/* Modern Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center group gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-slate-900 block leading-tight">ACELERA<span className="text-brand-600">SEO</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Agency Command</span>
              </div>
            </Link>

            <div className="hidden md:flex ml-8 bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => {
                   setPortalMode('agencia');
                   setActiveTab('Visão Geral');
                 }} 
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${portalMode === 'agencia' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Visão Agência
               </button>
               <button 
                 onClick={() => navigate('/portal-cliente')} 
                 className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
               >
                 Visão Cliente
               </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistemas Ativos</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>
            <button 
              onClick={async () => {
                const { signOut } = await import('firebase/auth');
                const { auth } = await import('../firebase');
                await signOut(auth);
                navigate('/');
              }}
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-all gap-2 px-4 py-2"
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
              <div className="h-1.5 w-10 bg-slate-900 rounded-full"></div>
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.4em]">Command Center</p>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 font-display tracking-tight leading-[0.9] mb-4">
              Dashboard <span className="text-brand-600">Agência</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              Gerencie pautas, backlinks, rankings e performance técnica de todo o ecossistema Acelera SEO.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center bg-white/50 p-1.5 rounded-[2.5rem] border border-slate-200 shadow-sm backdrop-blur-sm gap-3">
             <div className="flex items-center bg-white rounded-3xl border border-slate-100 shadow-sm gap-4 px-6 py-3">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                 <Activity size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Operacional:</p>
                 <div className="flex items-center gap-2">
                   <p className="text-sm font-black text-slate-900 tracking-tight">Agência Online</p>
                   <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                 </div>
               </div>
             </div>
             
             <button 
                onClick={() => setShowGscPrompt(!showGscPrompt)}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 gap-2 px-6 py-4"
             >
               <Globe2 size={16} /> Search Console
             </button>
          </div>
        </motion.div>

        {showGscPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
               className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-lg p-8 relative">
               <button onClick={() => setShowGscPrompt(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                 <AlertCircle size={24} />
               </button>
               <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 font-display">Conectar Site</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Google Search Console API</p>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-6">Insira a URL exata ou o prefixo do domínio cadastrado no Search Console. Certifique-se de que a conta de serviço possui permissões de visualização.</p>
               <form onSubmit={fetchGscData} className="space-y-4">
                 <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text" 
                     value={siteUrl}
                     onChange={e => setSiteUrl(e.target.value)}
                     placeholder="sc-domain:exemplo.com.br"
                     className="w-full pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all py-4"
                   />
                 </div>
                 {gscError && <div className="text-xs font-bold text-rose-500 bg-rose-50 rounded-2xl border border-rose-100 flex p-4 gap-2"><AlertTriangle size={14} className="shrink-0" /> {gscError}</div>}
                 <button 
                  disabled={loadingGSC}
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-xs hover:bg-brand-600 flex justify-center items-center transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-slate-900/10 py-4 gap-3">
                    {loadingGSC ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : 'Importar Dados'}
                 </button>
               </form>
            </motion.div>
          </div>
        )}

        {/* Improved Tab Navigation */}
        <HorizontalScroll className="mb-10">
          <div className="flex bg-slate-200/30 rounded-2xl border border-slate-200 gap-1 p-1 w-fit">
            {['Visão Geral', 'Conteúdo Interno (Acelera)', 'Hub de Clientes', 'Planejamento', 'Artigos e Conteúdos', 'Categorias', 'Backlinks', 'Monitoramento de Rankings', 'Aprovações Pendentes', 'Clientes & CRM', 'Configurações'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setFilterClient('');
                }}
                className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-xl ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </HorizontalScroll>

        {activeTab === 'Categorias' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-[10px] font-black text-brand-600 uppercase tracking-[0.4em] mb-2">Editor de Taxonomia</h3>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Categorias do Blog</h2>
                  <p className="text-slate-500 font-medium mt-1">Organização temática e otimização de taxonomia para SEO.</p>
                </div>
                <button onClick={() => {
                  setCategoryForm({ id: '', name: '', slug: '', description: '', seoTitle: '', seoDescription: '', isProtected: false });
                  setShowCategoryForm(true);
                }} className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-brand-600 transition-all shadow-lg px-8 py-4">
                  + Nova Categoria
                </button>
              </div>

              {showCategoryForm && (
                <motion.form 
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleSaveCategory} className="bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6 mb-12 p-8 lg:p-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Informações Base</h4>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Categoria</label>
                        <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all" placeholder="Ex: SEO Técnico" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL Amigável (Slug)</label>
                        <input type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all" placeholder="seo-tecnico" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Curta</label>
                        <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all" rows={3} placeholder="Explique do que se trata esta categoria..." />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-brand-600 uppercase tracking-widest border-b border-brand-100 pb-2">Otimização SEO</h4>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">SEO Title</label>
                        <input type="text" value={categoryForm.seoTitle} onChange={e => setCategoryForm({...categoryForm, seoTitle: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all" placeholder="Título que aparecerá no Google" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Description</label>
                        <textarea value={categoryForm.seoDescription} onChange={e => setCategoryForm({...categoryForm, seoDescription: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all" rows={3} placeholder="Descrição para os resultados de busca..." />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-6 py-4">Descartar</button>
                    <button type="submit" disabled={isSaving} className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-brand-600 px-10 py-4 shadow-lg transition-all active:scale-95 disabled:opacity-50">
                      {isSaving ? 'Salvando...' : 'Salvar Categoria'}
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Nome da Categoria</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Slug / URL</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">SEO Health</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-right">Controle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-slate-50 last:border-0 group hover:bg-slate-50/80 transition-colors">
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${cat.isProtected ? 'bg-brand-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-slate-300'}`}></div>
                            <div>
                               <span className="text-sm font-black text-slate-900 block leading-none mb-1">{cat.name}</span>
                               <span className="text-[9px] font-medium text-slate-400 truncate max-w-[200px] block">{cat.description || 'Sem descrição'}</span>
                            </div>
                            {cat.isProtected && <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">/blog/{cat.slug}</span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex gap-2">
                            <div className={`w-3 h-3 rounded-full border-2 ${cat.seoTitle ? 'bg-emerald-500 border-emerald-100' : 'bg-slate-100 border-slate-200'}`} title="Title SEO"></div>
                            <div className={`w-3 h-3 rounded-full border-2 ${cat.seoDescription ? 'bg-emerald-500 border-emerald-100' : 'bg-slate-100 border-slate-200'}`} title="Meta Description"></div>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setCategoryForm(cat);
                                setShowCategoryForm(true);
                              }}
                              className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
                            >
                              <Edit2 size={16} />
                            </button>
                            {!cat.isProtected && (
                              <button 
                                onClick={() => handleDeleteCategory(cat)}
                                className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-20">
                          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhuma categoria encontrada</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'Visão Geral' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Clientes Ativos', val: clients.length, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
                 { label: 'Backlinks Totais', val: backlinks.length, icon: LinkIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'Artigos Publicados', val: blogPosts.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 { label: 'Palavras Rankeadas', val: '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon size={28} />
                      </div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Stat</div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Tráfego Agregado</h3>
                      <p className="text-slate-500 font-medium">Consolidado das propriedades monitoradas</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl px-6 py-3 border border-slate-100 flex items-center gap-4">
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clicks Totais</p>
                         <p className="text-xl font-black text-slate-900 tracking-tighter">{totalClicksInfo}</p>
                       </div>
                       <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center ring-4 ring-emerald-500/10">
                         <TrendingUp size={20} />
                       </div>
                    </div>
                  </div>
                  
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                        <RechartsTooltip 
                           contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                           itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col justify-between">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/10 backdrop-blur-sm">
                      <Zap className="text-brand-400" size={28} />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight leading-[1.1] mb-6">Próximos <br/> <span className="text-brand-400">Marcos</span></h3>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                      Estamos prestes a atingir a meta de indexação técnica para 85% dos novos clientes.
                    </p>
                  </div>
                  
                  <div className="relative z-10 bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Meta Mensal</p>
                     <div className="flex justify-between items-end mb-3">
                        <span className="text-3xl font-black">74%</span>
                        <span className="text-sm font-bold text-slate-400">22/30 Clientes</span>
                     </div>
                     <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '74%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                        />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* SLAs and Rankings in Overview */}
            <div className="grid lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                  <div className="mb-8">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">SLA & Pendências</h3>
                     <p className="text-slate-500 font-medium text-sm">Acompanhamento e gargalos operacionais por cliente</p>
                  </div>
                  <div className="space-y-4">
                    {(() => {
                      const now = new Date();
                      const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                      const slaIssues = clients.map(client => {
                        const isExpired = Number(now.getDate()) >= Number(client.billingDay || 10) && client.lastPaymentMonth !== currentMonthYear;
                        let targetPosts = Number(client.monthlyPosts || 0);
                        let targetBacklinks = Number(client.monthlyBacklinks || 0);
                        if (client.extraMonth === currentMonthYear) {
                          targetPosts += Number(client.extraPosts || 0);
                          targetBacklinks += Number(client.extraBacklinks || 0);
                        }
                        const clientPosts = blogPosts.filter(p => p.clientName === client.name && ['Publicado', 'Aprovado'].includes(p.status)).length;
                        const clientLinks = backlinks.filter(b => b.clientName === client.name && ['Publicado'].includes(b.status)).length;
                        const missingPosts = targetPosts > clientPosts;
                        const missingLinks = targetBacklinks > clientLinks;
                        return {
                          ...client,
                          isExpired,
                          missingPosts: missingPosts ? (targetPosts - clientPosts) : 0,
                          missingLinks: missingLinks ? (targetBacklinks - clientLinks) : 0,
                          hasIssues: isExpired || missingPosts || missingLinks
                        }
                      }).filter(c => c.hasIssues);

                      if (slaIssues.length === 0) return (
                        <div className="py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                          <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-4" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Operação 100% em dia</p>
                        </div>
                      );

                      return slaIssues.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-200 transition-all">
                          <div>
                            <p className="text-base font-black text-slate-900 mb-2">{c.name}</p>
                            <div className="flex gap-2">
                              {c.missingPosts > 0 && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg">Faltam {c.missingPosts} Artigos</span>}
                              {c.missingLinks > 0 && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg">Faltam {c.missingLinks} Backlinks</span>}
                              {c.isExpired && <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded-lg">Pagamento Pendente</span>}
                            </div>
                          </div>
                          <button onClick={() => { setActiveTab('Clientes & CRM'); setFilterClient(c.name); }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-600 transition-all">
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10 overflow-hidden">
                  <div className="mb-8">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Rankings</h3>
                     <p className="text-slate-500 font-medium text-sm">Palavras principais em destaque</p>
                  </div>
                  <div className="space-y-6">
                    {currentKwData.slice(0, 6).map((k: any, i: number) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0">
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-800 truncate pr-4">{k.kw}</p>
                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{k.vol}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">#{k.pos}</span>
                            {k.diff > 0 ? (
                               <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">+{k.diff}</span>
                            ) : k.diff < 0 ? (
                               <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">{k.diff}</span>
                            ) : null}
                         </div>
                      </div>
                    ))}
                    <button onClick={() => setActiveTab('Monitoration de Rankings')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-brand-600 hover:bg-brand-50 rounded-2xl transition-all border border-brand-100 mt-4">
                      Ver Relatório Completo
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'Clientes & CRM' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 gap-1 mb-8 w-fit">
              {['Clientes Ativos', 'Leads Auditoria', 'Mensagens Contato'].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setSubTabCrm(sub)}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${subTabCrm === sub ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {subTabCrm === 'Clientes Ativos' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Gestão de Clientes</h2>
                   <p className="text-slate-500 font-medium">Contratos, volume de entregas e horas de desenvolvimento.</p>
                 </div>
                 <button onClick={() => {
                   setClientForm({ id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', active: true, approvalDeadlineDays: '5', websiteUrl: '', lastPaymentMonth: '', extraMonth: '', extraPosts: '0', extraBacklinks: '0', extraDevHours: '0' });
                   setShowClientForm(true);
                 }} className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-brand-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 px-8 py-4">
                   + Novo Cliente
                 </button>
               </div>

               {showClientForm && (
                 <motion.form 
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleSaveClient} className="bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6 mb-12 p-8 lg:p-10">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{clientForm.id ? 'Editar Cadastro' : 'Novo Cadastro Regional'}</h3>
                      <div className="bg-white px-4 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Creation Wizard</div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Empresa</label>
                        <input type="text" required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="Nome Fantasia" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Portal Access Email</label>
                        <input type="email" required value={clientForm.clientEmail} onChange={e => setClientForm({...clientForm, clientEmail: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="financeiro@empresa.com" />
                      </div>
                      <div className="col-span-1 md:col-span-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monitoramento (URL Principal)</label>
                        <input type="url" value={clientForm.websiteUrl} onChange={e => setClientForm({...clientForm, websiteUrl: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="https://www.dominio.com.br" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Inicial</label>
                        <input type="date" required value={clientForm.contractStart} onChange={e => setClientForm({...clientForm, contractStart: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ciclo de Cobrança</label>
                        <input type="number" min="1" max="31" required value={clientForm.billingDay} onChange={e => setClientForm({...clientForm, billingDay: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Artigos / Mês</label>
                        <input type="number" min="0" required value={clientForm.monthlyPosts} onChange={e => setClientForm({...clientForm, monthlyPosts: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Backlinks / Mês</label>
                        <input type="number" min="0" required value={clientForm.monthlyBacklinks} onChange={e => setClientForm({...clientForm, monthlyBacklinks: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="bg-white/50 border border-slate-200 rounded-2xl p-6">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Zap size={16} className="text-brand-500" /> Extras e Vendas Avulsas
                      </h4>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mês Aplicável</label>
                          <input type="month" value={clientForm.extraMonth || ''} onChange={e => setClientForm({...clientForm, extraMonth: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Posts Adicionais</label>
                          <input type="number" min="0" value={clientForm.extraPosts || '0'} onChange={e => setClientForm({...clientForm, extraPosts: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Backlinks Adicionais</label>
                          <input type="number" min="0" value={clientForm.extraBacklinks || '0'} onChange={e => setClientForm({...clientForm, extraBacklinks: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                      <button type="button" onClick={() => setShowClientForm(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors px-6 py-4">Descartar</button>
                      <button type="submit" className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-brand-600 transition-all shadow-lg px-10 py-4">
                        {clientForm.id ? 'Salvar Alterações' : 'Concluir Cadastro'}
                      </button>
                    </div>
                 </motion.form>
               )}

               <HorizontalScroll>
                 <table className="w-full text-left border-collapse min-w-[900px]">
                   <thead>
                     <tr className="border-b border-slate-100">
                       <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Parceiro / Cliente</th>
                       <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Faturamento</th>
                       <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">SLA Mensal</th>
                       <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-right">Controle</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {loadingClients ? (
                       <tr><td colSpan={6} className="text-center text-slate-500 font-medium p-8">Carregando...</td></tr>
                     ) : clients.length === 0 ? (
                       <tr><td colSpan={6} className="text-center text-slate-500 font-medium p-8">Nenhum cliente cadastrado.</td></tr>
                     ) : clients.map(client => (
                       <tr key={client.id} className="hover:bg-slate-50 transition">
                         <td className="text-sm font-bold text-slate-900 p-4">{client.name}</td>
                         <td className="text-sm text-slate-600 p-4">Dia {client.billingDay}</td>
                         <td className="text-sm text-slate-600 font-medium p-4">
                           {client.monthlyPosts} Posts • {client.monthlyBacklinks} Backlinks
                         </td>
                         <td className="text-sm text-slate-600 p-4">{client.initialDevHours} hrs</td>
                         <td className="text-sm text-slate-600 p-4">{client.monthlyDevHours} hrs</td>
                         <td className="p-4">
                           <div className="flex gap-2">
                            <button 
                              onClick={() => generateInviteLink(client)} 
                              title="Copiar link de convite"
                              className="text-slate-400 hover:text-emerald-600 p-1"
                            >
                              <LinkIcon size={16} />
                            </button>
                            <button 
                              onClick={() => handleResetPassword(client.clientEmail)} 
                              title="Redefinir Senha do Cliente"
                              className="text-slate-400 hover:text-amber-600 p-1"
                            >
                              <RefreshCcw size={16} />
                            </button>
                             <button onClick={() => {
                               setClientForm({
                                 id: client.id,
                                 name: client.name || '',
                                 clientEmail: client.clientEmail || '',
                                 billingDay: String(client.billingDay || '10'),
                                 contractStart: client.contractStart || '',
                                 monthlyPosts: String(client.monthlyPosts || '0'),
                                 monthlyBacklinks: String(client.monthlyBacklinks || '0'),
                                 initialDevHours: String(client.initialDevHours || '0'),
                                 monthlyDevHours: String(client.monthlyDevHours || '0'),
                                 active: client.active !== false,
                                 approvalDeadlineDays: String(client.approvalDeadlineDays || '5'),
                                 websiteUrl: client.websiteUrl || '',
                                 lastPaymentMonth: client.lastPaymentMonth || '',
                                 extraMonth: client.extraMonth || '',
                                 extraPosts: String(client.extraPosts || '0'),
                                 extraBacklinks: String(client.extraBacklinks || '0'),
                                 extraDevHours: String(client.extraDevHours || '0')
                               });
                               setShowClientForm(true);
                             }} className="text-slate-400 hover:text-brand-600 p-1"><Edit2 size={16} /></button>
                             <button onClick={() => handleDeleteClient(client.id)} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={16} /></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </HorizontalScroll>
            </div>
            )}

            {subTabCrm === 'Leads Auditoria' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                 <div>
                   <h2 className="text-xl font-bold font-display text-slate-900 text-center md:text-left">Leads da Auditoria Grátis</h2>
                   <p className="text-sm font-medium text-slate-500">Contatos capturados no teste de SEO.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center gap-3">
                   <select 
                      value={auditDateFilter} 
                      onChange={e => setAuditDateFilter(e.target.value)} 
                      className="bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 px-3 py-2"
                   >
                     <option value="Todos">Todo o Período</option>
                     <option value="7d">Últimos 7 dias</option>
                     <option value="30d">Últimos 30 dias</option>
                   </select>
                   <select 
                      value={auditFilter} 
                      onChange={e => setAuditFilter(e.target.value)} 
                      className="bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 px-3 py-2"
                   >
                     <option value="Todos">Todos</option>
                     <option value="Pendentes">Pendentes</option>
                     <option value="Tratados">Tratados</option>
                   </select>
                   <button 
                      onClick={() => exportToCSV(filteredAuditLeads, 'leads-auditoria.csv', 'audit')}
                      disabled={filteredAuditLeads.length === 0}
                      className="w-full sm:w-auto flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-4 py-2">
                      <Download size={16} /> Exportar
                   </button>
                 </div>
               </div>
               <HorizontalScroll>
                 {loadingLeads ? (
                   <p className="text-center text-slate-500 py-8">Carregando leads...</p>
                 ) : (
                   <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                       <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-bold">
                         <th className="pr-4 pb-3">Data</th>
                         <th className="pb-3 px-4">Nome</th>
                         <th className="pb-3 px-4">Celular</th>
                         <th className="pb-3 px-4">URL (Site)</th>
                         <th className="pl-4 text-center pb-3">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredAuditLeads.map(lead => (
                         <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                           <td className="pr-4 text-sm text-slate-500 whitespace-nowrap py-4">{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente'}</td>
                           <td className="text-sm font-medium text-slate-800 py-4 px-4">{lead.name}</td>
                           <td className="text-sm text-slate-600 py-4 px-4">{lead.phone}</td>
                           <td className="text-sm text-brand-600 hover:underline py-4 px-4"><a href={lead.url} target="_blank" rel="noopener noreferrer">{lead.url}</a></td>
                           <td className="pl-4 text-center py-4">
                             <button
                               onClick={() => toggleLeadStatus('audit_leads', lead.id, lead.status)}
                               className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${lead.status === 'tratado' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                             >
                               {lead.status === 'tratado' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                               {lead.status === 'tratado' ? 'Tratado' : 'Pendente'}
                             </button>
                           </td>
                         </tr>
                       ))}
                       {filteredAuditLeads.length === 0 && (
                         <tr><td colSpan={5} className="text-center text-sm font-medium text-slate-400 py-8">Nenhum lead encontrado.</td></tr>
                       )}
                     </tbody>
                   </table>
                 )}
               </HorizontalScroll>
               {auditHasMore && !loadingLeads && filteredAuditLeads.length > 0 && (
                   <div className="flex justify-center mt-6">
                     <button
                       onClick={() => loadAuditLeads(true)}
                       disabled={auditLoadingMore}
                       className="flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition disabled:opacity-50 gap-2 px-4 py-2"
                     >
                       {auditLoadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                       Carregar Mais
                     </button>
                   </div>
                 )}
               </div>
            )}

            {subTabCrm === 'Mensagens Contato' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                 <div>
                   <h2 className="text-xl font-bold font-display text-slate-900 text-center md:text-left">Mensagens de Contato</h2>
                   <p className="text-sm font-medium text-slate-500">Enviadas através do formulário principal.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center gap-3">
                   <select 
                      value={contactDateFilter} 
                      onChange={e => setContactDateFilter(e.target.value)} 
                      className="bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 px-3 py-2"
                   >
                     <option value="Todos">Todo o Período</option>
                     <option value="7d">Últimos 7 dias</option>
                     <option value="30d">Últimos 30 dias</option>
                   </select>
                   <select 
                      value={contactFilter} 
                      onChange={e => setContactFilter(e.target.value)} 
                      className="bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 px-3 py-2"
                   >
                     <option value="Todos">Todos</option>
                     <option value="Pendentes">Pendentes</option>
                     <option value="Tratados">Tratados</option>
                   </select>
                   <button 
                      onClick={() => exportToCSV(filteredContactLeads, 'mensagens-contato.csv', 'contact')}
                      disabled={filteredContactLeads.length === 0}
                      className="w-full sm:w-auto flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-4 py-2">
                      <Download size={16} /> Exportar
                   </button>
                 </div>
               </div>
               <HorizontalScroll>
                   <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                       <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-bold">
                         <th className="pr-4 pb-3">Data</th>
                         <th className="pb-3 px-4">Nome / Empresa</th>
                         <th className="pb-3 px-4">Email</th>
                         <th className="pb-3 px-4">Mensagem</th>
                         <th className="pl-4 text-center pb-3">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredContactLeads.map(lead => (
                         <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                           <td className="pr-4 text-sm text-slate-500 whitespace-nowrap align-top py-4">{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente'}</td>
                           <td className="text-sm font-medium text-slate-800 align-top py-4 px-4">
                             {lead.name}
                             <span className="block text-xs font-normal text-slate-500 mt-1">{lead.company}</span>
                           </td>
                           <td className="text-sm text-brand-600 hover:underline align-top w-[200px] truncate py-4 px-4"><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                           <td className="text-sm text-slate-600 align-top max-w-sm whitespace-pre-line py-4 px-4">{lead.message}</td>
                           <td className="pl-4 text-center align-top py-4">
                             <button
                               onClick={() => toggleLeadStatus('contacts', lead.id, lead.status)}
                               className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${lead.status === 'tratado' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                             >
                               {lead.status === 'tratado' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                               {lead.status === 'tratado' ? 'Tratado' : 'Pendente'}
                             </button>
                           </td>
                         </tr>
                       ))}
                       {filteredContactLeads.length === 0 && (
                         <tr><td colSpan={5} className="text-center text-sm font-medium text-slate-400 py-8">Nenhuma mensagem.</td></tr>
                       )}
                     </tbody>
                   </table>
               </HorizontalScroll>
               {contactHasMore && !contactLoadingMore && filteredContactLeads.length > 0 && (
                     <div className="flex justify-center mt-6 pb-4">
                       <button
                         onClick={() => loadContactLeads(true)}
                         disabled={contactLoadingMore}
                         className="flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition disabled:opacity-50 gap-2 px-4 py-2"
                       >
                         Carregar Mais
                       </button>
                     </div>
                   )}
                   {contactLoadingMore && (
                       <div className="flex justify-center mt-6 pb-4">
                           <div className="flex items-center text-slate-500 font-bold text-sm gap-2 px-4 py-2">
                               <Loader2 size={16} className="animate-spin" /> Carregando...
                           </div>
                       </div>
                   )}
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
             selectedHubClient={selectedHubClient}
             setSelectedHubClient={setSelectedHubClient}
             keywordsUniverse={keywordsUniverse}
             showKeywordForm={showKeywordForm}
             setShowKeywordForm={setShowKeywordForm}
             keywordForm={keywordForm}
             setKeywordForm={setKeywordForm}
             handleSaveKeyword={handleSaveKeyword}
             handleDeleteKeyword={handleDeleteKeyword}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Aprovações Críticas</h2>
                  <p className="text-slate-500 font-medium">Controles de qualidade para conteúdos aguardando validação final dos parceiros.</p>
                </div>
                
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trilhas de Conteúdo Pendentes</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogPosts
                        .filter((p:any) => p.clientName && p.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas'].includes(p.status))
                        .map((post:any, idx: number) => (
                        <div key={`pending-post-${post.id || idx}`} className="group bg-slate-50 border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                             <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-brand-600 uppercase tracking-widest">{post.status}</div>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{post.clientName}</span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 leading-tight mb-6 line-clamp-2">{post.title}</h4>
                          <button 
                            onClick={() => { setPostForm(post); setShowPostForm(true); }} 
                            className="mt-auto w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm"
                          >
                            Revisar e Publicar
                          </button>
                        </div>
                      ))}
                      {blogPosts.filter((p:any) => p.clientName && p.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas'].includes(p.status)).length === 0 && (
                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum artigo aguardando ação</p>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estratégia de Backlinks em Fila</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {backlinks
                        .filter((b:any) => b.clientName && b.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado'].includes(b.status))
                        .map((backlink:any, idx: number) => (
                        <div key={`pending-backlink-${backlink.id || idx}`} className="group bg-slate-50 border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                             <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-blue-600 uppercase tracking-widest">{backlink.status}</div>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{backlink.clientName}</span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 leading-tight mb-2 line-clamp-1">{backlink.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 truncate mb-6">URL: {backlink.targetUrl}</p>
                          <button 
                            onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} 
                            className="mt-auto w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm"
                          >
                            Validar Estratégia
                          </button>
                        </div>
                      ))}
                      {backlinks.filter((b:any) => b.clientName && b.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado'].includes(b.status)).length === 0 && (
                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum backlink pendente</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
             </div>
          </motion.div>
        ) : activeTab === 'Monitoramento de Rankings' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Monitoramento</h2>
                   <p className="text-slate-500 font-medium">Controle de posicionamento orgânico e saúde técnica.</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-3">
                   <div className="relative">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Buscar keyword..." 
                       value={seoSearch}
                       onChange={e => setSeoSearch(e.target.value)}
                       className="pl-10 pr-6 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest w-full md:w-64 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all py-3"
                     />
                   </div>
                   <button 
                      onClick={triggerTechnicalAudit} 
                      disabled={isAuditing}
                      className="bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center px-6 py-3 gap-2"
                    >
                      {isAuditing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="text-brand-500" />}
                      {isAuditing ? 'Auditoria em curso...' : 'Audit Técnica'}
                   </button>
                   <button onClick={() => setShowSeoForm(true)} className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all px-8 py-3 shadow-lg">
                     Nova Keyword
                   </button>
                 </div>
               </div>

               {showSeoForm && (
                 <motion.form 
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleSaveSeo} className="bg-slate-50 rounded-[2rem] border border-slate-200 space-y-6 p-8 lg:p-10 mb-12">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{seoForm.id ? 'Editar Monitoramento' : 'Configurar Nova Track'}</h3>
                      <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-300 uppercase tracking-widest">SEO Control Center</div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Palavra-chave Foco</label>
                        <input required type="text" value={seoForm.title} onChange={e => setSeoForm({...seoForm, title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="Ex: agencia de seo" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL Alvo (Pilar / Landing)</label>
                        <input required type="text" value={seoForm.url} onChange={e => setSeoForm({...seoForm, url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" placeholder="https://..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Observações Gsc / Semrush</label>
                      <input type="text" value={seoForm.customNotes} onChange={e => setSeoForm({...seoForm, customNotes: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Ex: Top 3 - Meta subir para Top 1" />
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                      <button type="button" onClick={() => {setShowSeoForm(false); setSeoForm({ id: '', url: '', title: '', description: '', customNotes: '' });}} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors px-6 py-4">Descartar</button>
                      <button type="submit" className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-brand-600 transition-all shadow-lg px-10 py-4">Salvar Configuração</button>
                    </div>
                 </motion.form>
               )}

               <div className="overflow-x-auto no-scrollbar">
                 {loadingSeo ? (
                   <div className="flex flex-col items-center justify-center py-20">
                     <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                     <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Sincronizando Rankings...</p>
                   </div>
                 ) : (
                   <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead>
                       <tr className="border-b border-slate-100">
                         <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Palavra-chave Monitorada</th>
                         <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Performance & Saúde</th>
                         <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-right">Controle</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {filteredSeoPages.map(page => (
                         <tr key={page.id} className="group hover:bg-slate-50/80 transition-colors">
                           <td className="py-6 px-4">
                             <p className="text-sm font-black text-slate-900 mb-1">{page.title}</p>
                             <div className="flex items-center gap-2">
                               <p className="text-[10px] font-bold text-slate-400 truncate max-w-[300px]">{page.url}</p>
                               <a href={page.url} target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-600"><LinkIcon size={10} /></a>
                             </div>
                           </td>
                           <td className="py-6 px-4">
                             <div className="flex items-center gap-3">
                               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100 gap-2">
                                 <TrendingUp size={12} /> {page.customNotes || 'Ranking Info'}
                               </div>
                               {page.lastAuditStatus && (
                                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${page.health === 'healthy' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                   HTTP {page.lastAuditStatus} {page.health === 'critical' && '⚠️'}
                                 </div>
                               )}
                             </div>
                           </td>
                           <td className="py-6 px-4 text-right">
                             <div className="flex justify-end gap-2">
                               <button onClick={() => { setSeoForm(page); setShowSeoForm(true); }} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                 <Edit2 size={16} />
                               </button>
                               <button onClick={() => handleDeleteSeo(page.id)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {filteredSeoPages.length === 0 && (
                         <tr><td colSpan={3} className="text-center py-20">
                            <div className="flex flex-col items-center opacity-30">
                              <Search size={40} className="mb-4" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum monitoramento configurado</p>
                            </div>
                         </td></tr>
                       )}
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'Configurações' ? (
          <SettingsGlobal />
        ) : activeTab === 'Artigos e Conteúdos' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Central de Conteúdo</h2>
                  <p className="text-slate-500 font-medium">Todos os artigos em produção, aprovação e publicados.</p>
                </div>
                <button onClick={() => {
                  setPostForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
                  setShowPostForm(true);
                }} className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] px-8 py-4 hover:bg-brand-600 transition-all shadow-lg active:scale-95">
                  + Novo Artigo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nenhum artigo encontrado</p>
                  </div>
                ) : (
                  blogPosts.map((post: any) => (
                    <div key={post.id} className="group bg-slate-50/50 border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          post.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          post.status === 'Aguardando Aprovação' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-white text-slate-400 border-slate-200'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{post.clientName || 'Geral'}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 leading-tight mb-6 line-clamp-2">{post.title}</h4>
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex gap-4">
                           <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-[10px] font-black text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors">Editar</button>
                           <button onClick={() => handleDeletePost(post.id, post.coverImage)} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">Remover</button>
                        </div>
                        {post.publishedUrl && (
                          <a href={post.publishedUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-slate-900 transition-colors">
                            <ArrowUpRight size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'Backlinks' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Monitoramento de Backlinks</h2>
                  <p className="text-slate-500 font-medium">Gestão de links externos e autoridade de domínio.</p>
                </div>
                <button onClick={() => {
                  setBacklinkForm({ id: '', title: '', clientName: '', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
                  setShowBacklinkForm(true);
                }} className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] px-8 py-4 hover:bg-brand-600 transition-all shadow-lg active:scale-95">
                  + Novo Link
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Status</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Cliente</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Target Keyword / Âncora</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">URL Alvo</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {backlinks.length === 0 ? (
                      <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Nenhum backlink registrado</td></tr>
                    ) : (
                      backlinks.map((link: any) => (
                        <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-widest ${
                              link.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200'
                            }`}>
                              {link.status}
                            </span>
                          </td>
                          <td className="py-5 px-4 text-sm font-black text-slate-900">{link.clientName}</td>
                          <td className="py-5 px-4 text-sm font-bold text-slate-600">{link.anchor || link.focusKeywords || '-'}</td>
                          <td className="py-5 px-4 text-xs font-medium text-slate-400 truncate max-w-[200px]">{link.targetUrl}</td>
                          <td className="py-5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setBacklinkForm(link); setShowBacklinkForm(true); }} className="p-2 text-slate-400 hover:text-brand-600"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteBacklink(link.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'Planejamento' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Planejamento Editorial</h2>
                  <p className="text-slate-500 font-medium">Pipeline de oportunidades e pautas futuras.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keywordsUniverse.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nenhum planejamento disponível</p>
                  </div>
                ) : (
                  keywordsUniverse.map((kw: any) => (
                    <div key={kw.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-brand-500">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{kw.targetMonth || 'Pendente'}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{kw.clientName}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mb-6">{kw.keyword}</h4>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>{kw.searchVolume || '0 Vol'}</span>
                        <div className="flex gap-2">
                           <button onClick={() => { setKeywordForm(kw); setShowKeywordForm(true); }} className="hover:text-brand-600">Editar</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

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
    </div>
  );
}

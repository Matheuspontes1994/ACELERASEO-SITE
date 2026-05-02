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
  Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, where, startAfter } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MDEditor from '@uiw/react-md-editor';
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
    // Usamos o campo name ou websiteUrl como identificador no link
    const inviteLink = `${baseUrl}?invitedBy=${auth.currentUser?.uid}&clientEmail=${encodeURIComponent(client.websiteUrl || client.name)}`;
    navigator.clipboard.writeText(inviteLink);
    alert("Link de convite copiado para a área de transferência! Envie para o administrador do cliente.");
  };

  // Efeito para capturar convites na URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedBy = params.get('invitedBy');
    const clientEmail = params.get('clientEmail');
    
    if (invitedBy && clientEmail && auth.currentUser) {
      // Se o usuário logado for o convidado, podemos fazer um link formal no DB se necessário
      console.log("Usuário entrou por convite:", clientEmail, "Agência:", invitedBy);
      // Aqui poderíamos atualizar o UID do cliente no DB para vincular definitivamente
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
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pb-12">
      <Helmet>
        <title>Painel de Performance | Acelera SEO</title>
      </Helmet>

      {/* Modern Agency Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 mb-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center group gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-slate-900 block leading-tight">ACELERA<span className="text-brand-600">SEO</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Agency Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center h-full gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/portal-cliente')}
              className="flex items-center py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-700 bg-brand-50 rounded-2xl hover:bg-brand-100 transition-all border border-brand-200/50 hidden md:flex gap-2 px-4"
            >
              <Users size={14} /> Portal do Cliente
            </button>
            <div className="w-px h-6 bg-slate-200 hidden md:block mx-2"></div>
            <button 
              onClick={async () => {
                const { signOut } = await import('firebase/auth');
                const { auth } = await import('../firebase');
                await signOut(auth);
                navigate('/');
              }}
              className="flex items-center py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-2xl transition-all gap-2 px-4"
            >
              <ArrowRight size={14} /> Sair
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        {/* Page Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-8 bg-brand-600 rounded-full"></div>
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.3em]">Gestão Operacional</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-none mb-4 text-center md:text-center">
              Dashboard <span className="text-brand-600">Agência</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed text-justify md:text-left">
              Controle total sobre entregas, SLAs e crescimento orgânico dos seus clientes.
            </p>
          </div>

          <div className="flex flex-wrap items-center bg-white rounded-3xl border border-slate-200 shadow-sm gap-3 p-2">
            <button 
              onClick={() => setShowGscPrompt(!showGscPrompt)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${showGscPrompt ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-slate-700 hover:bg-slate-50'}`}>
              <Globe2 size={16} /> <span className="hidden sm:inline">Google Search Console</span><span className="sm:hidden">GSC</span>
            </button>
            <button className="flex items-center bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 gap-2 px-5 py-3">
              <Download size={16} /> Relatórios
            </button>
          </div>
          
          {showGscPrompt && (
            <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} 
               className="fixed inset-0 sm:absolute sm:inset-auto sm:top-full sm:right-0 bg-white rounded-none sm:rounded-3xl shadow-2xl border-none sm:border border-slate-200 w-full sm:w-[400px] z-[60] flex flex-col justify-center sm:block mt-4 p-8">
               <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 font-display text-center md:text-left">Conectar Site</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Google Search Console API</p>
                 </div>
                 <button onClick={() => setShowGscPrompt(false)} className="bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-colors p-2"><AlertCircle size={20} /></button>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-6 text-justify md:text-left">Insira a URL exata ou o prefixo do domínio cadastrado no Search Console. Certifique-se de que a conta de serviço possui permissões de visualização.</p>
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
                 {gscError && <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} className="text-xs font-bold text-rose-500 bg-rose-50 rounded-2xl border border-rose-100 flex p-4 gap-2"><AlertTriangle size={14} className="shrink-0" /> {gscError}</motion.div>}
                 <button 
                  disabled={loadingGSC}
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-xs hover:bg-brand-600 flex justify-center items-center transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-slate-900/10 py-4 gap-3">
                    {loadingGSC ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : 'Importar Dados'}
                 </button>
                 <button type="button" onClick={() => setShowGscPrompt(false)} className="w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors sm:hidden py-4">Fechar</button>
               </form>
            </motion.div>
          )}
        </div>
        
        {/* Main Navigation & View Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 w-full max-w-full">
          <div className="flex bg-slate-200/50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative p-1 shrink-0 max-w-full">
            <motion.div 
               className="absolute inset-y-1 transition-all duration-300 bg-white rounded-xl shadow-md" 
               initial={false}
               animate={{ 
                 left: portalMode === 'agencia' ? '4px' : 'calc(50% + 1px)',
                 width: 'calc(50% - 5px)'
               }}
            />
            <button 
              onClick={() => {
                 setPortalMode('agencia');
                 setActiveTab('Visão Geral');
              }}
              className={`relative px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10 w-36 ${portalMode === 'agencia' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="flex items-center justify-center gap-2">
                <TrendingUp size={14} /> Agência
              </span>
            </button>
            <button 
              onClick={() => {
                 setPortalMode('clientes');
                 setActiveTab('Hub de Clientes');
              }}
              className={`relative px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10 w-36 ${portalMode === 'clientes' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="flex items-center justify-center gap-2">
                <Users size={14} /> Clientes
              </span>
            </button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar bg-slate-200/40 rounded-2xl border border-slate-200/50 gap-1 p-1 w-full max-w-full md:w-auto">
            {(portalMode === 'agencia' 
               ? ['Visão Geral', 'Conteúdo Interno (Acelera)', 'Clientes & CRM']
               : ['Hub de Clientes', 'Aprovações Pendentes', 'Monitoramento de Rankings']
            ).map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setFilterClient('');
                }}
                className={`relative px-4 py-2 text-xs font-bold whitespace-nowrap transition-all rounded-xl ${activeTab === tab ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid / conditional content */}
        {activeTab === 'Clientes & CRM' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex border-b border-slate-200 pb-px gap-2 mb-6">
              {['Clientes Ativos', 'Leads Auditoria', 'Mensagens Contato'].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setSubTabCrm(sub)}
                  className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${subTabCrm === sub ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {subTabCrm === 'Clientes Ativos' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                 <div>
                   <h2 className="text-xl font-bold font-display text-slate-900 text-center md:text-left">Gestão de Clientes Ativos</h2>
                   <p className="text-sm font-medium text-slate-500">Contratos, volume de entregas e horas de desenvolvimento.</p>
                 </div>
                 <button onClick={() => {
                   setClientForm({ id: '', name: '', clientEmail: '', billingDay: '10', contractStart: '', monthlyPosts: '0', monthlyBacklinks: '0', initialDevHours: '0', monthlyDevHours: '0', active: true, approvalDeadlineDays: '5', websiteUrl: '', lastPaymentMonth: '', extraMonth: '', extraPosts: '0', extraBacklinks: '0', extraDevHours: '0' });
                   setShowClientForm(true);
                 }} className="bg-brand-600 text-white font-bold rounded-lg text-sm hover:bg-brand-700 transition px-4 py-2">
                   Novo Cliente
                 </button>
               </div>

               {showClientForm && (
                 <form onSubmit={handleSaveClient} className="bg-slate-50 border border-slate-200 rounded-2xl space-y-4 mb-8 p-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 text-center md:text-left">{clientForm.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Cliente</label>
                        <input type="text" required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Nome da empresa" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1">E-mail de Login do Cliente</label>
                        <input type="email" required value={clientForm.clientEmail} onChange={e => setClientForm({...clientForm, clientEmail: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="cliente@empresa.com" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">URL do Site</label>
                        <input type="url" value={clientForm.websiteUrl} onChange={e => setClientForm({...clientForm, websiteUrl: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="https://www.site.com.br" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Início do Contrato</label>
                        <input type="date" required value={clientForm.contractStart} onChange={e => setClientForm({...clientForm, contractStart: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Dia de Cobrança (Ciclo)</label>
                        <input type="number" min="1" max="31" required value={clientForm.billingDay} onChange={e => setClientForm({...clientForm, billingDay: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Posts Blog / Mês</label>
                        <input type="number" min="0" required value={clientForm.monthlyPosts} onChange={e => setClientForm({...clientForm, monthlyPosts: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Backlinks / Mês</label>
                        <input type="number" min="0" required value={clientForm.monthlyBacklinks} onChange={e => setClientForm({...clientForm, monthlyBacklinks: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Horas Dev Setup (Único)</label>
                        <input type="number" min="0" required value={clientForm.initialDevHours} onChange={e => setClientForm({...clientForm, initialDevHours: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Horas Dev / Mês</label>
                        <input type="number" min="0" required value={clientForm.monthlyDevHours} onChange={e => setClientForm({...clientForm, monthlyDevHours: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Prazo de Aprovação (Dias Úteis)</label>
                        <input type="number" min="1" required value={clientForm.approvalDeadlineDays || '5'} onChange={e => setClientForm({...clientForm, approvalDeadlineDays: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <h4 className="text-sm font-bold text-slate-700 mb-4">Venda Avulsa / Produtos Adicionais Neste Mês</h4>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Mês de Aplicação (Ex: 2026-04)</label>
                          <input type="month" value={clientForm.extraMonth || ''} onChange={e => setClientForm({...clientForm, extraMonth: e.target.value})} className="w-full border rounded-lg text-sm px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Posts Avulsos</label>
                          <input type="number" min="0" value={clientForm.extraPosts || '0'} onChange={e => setClientForm({...clientForm, extraPosts: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Backlinks Avulsos</label>
                          <input type="number" min="0" value={clientForm.extraBacklinks || '0'} onChange={e => setClientForm({...clientForm, extraBacklinks: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Horas Dev. Avulsas</label>
                          <input type="number" min="0" value={clientForm.extraDevHours || '0'} onChange={e => setClientForm({...clientForm, extraDevHours: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Dica: Os valores avulsos definidos acima serão somados temporariamente para este mês específico no painel do cliente. Exemplo: se o plano dele é 4 posts e avulso tem 2, verá 6 posts no mês selecionado.</p>
                    </div>

                    <div className="flex justify-end border-t border-slate-200 gap-2 mt-4 pt-4">
                      <button type="button" onClick={() => setShowClientForm(false)} className="text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition px-4 py-2">Cancelar</button>
                      <button type="submit" className="text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 rounded-lg transition px-4 py-2">
                        {clientForm.id ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                      </button>
                    </div>
                 </form>
               )}

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-slate-200">
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Cliente</th>
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Ciclo (Dia)</th>
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Entregáveis (Mês)</th>
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Desenv. Inicial</th>
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Desenv. Mensal</th>
                       <th className="text-xs font-bold text-slate-500 uppercase p-4">Ações</th>
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
               </div>
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
               <div className="overflow-x-auto">
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
               <div className="overflow-x-auto">
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
          <div className="space-y-6 text-justify md:text-left">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-extrabold font-display text-slate-900 mb-2 text-center md:text-left">Aprovações Pendentes (De Clientes)</h2>
                <p className="text-sm font-medium text-slate-500 mb-6">Trilhas de conteúdo que já foram escritas e estão aguardando aprovação ou já foram aprovadas com/sem ressalvas e precisam de publicação.</p>
                
                <h3 className="font-bold text-slate-800 border-b border-slate-200 text-xs uppercase tracking-wider pb-2 mb-4 text-center md:text-left">Artigos Pendentes de Ação</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {blogPosts
                    .filter((p:any) => p.clientName && p.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas'].includes(p.status))
                    .map((post:any, idx: number) => (
                    <div key={`pending-post-${post.id || idx}`} className="border border-amber-200 rounded-2xl flex flex-col hover:shadow-md transition bg-amber-50/30 p-4">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] uppercase font-bold py-0.5 rounded bg-brand-100 text-brand-700 tracking-wider font-display px-2">{post.status}</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{post.clientName}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 leading-tight mb-1">{post.title}</h4>
                      <div className="mt-auto flex flex-wrap justify-between items-center border-t border-slate-200 pt-4 gap-2">
                         <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-xs font-bold text-brand-600 hover:underline uppercase tracking-wider">Revisar/Publicar</button>
                      </div>
                    </div>
                  ))}
                  {blogPosts.filter((p:any) => p.clientName && p.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas'].includes(p.status)).length === 0 && (
                    <p className="text-slate-500 text-sm">Nenhum artigo com esse status.</p>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 text-center md:text-left">Backlinks Pendentes de Ação (Aprovação / Publicação)</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {backlinks
                    .filter((b:any) => b.clientName && b.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado'].includes(b.status))
                    .map((backlink:any, idx: number) => (
                    <div key={`pending-backlink-${backlink.id || idx}`} className="border border-amber-200 rounded-2xl flex flex-col hover:shadow-md transition bg-amber-50/30 p-4">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] uppercase font-bold py-0.5 rounded bg-brand-100 text-brand-700 px-2">{backlink.status}</span>
                         <span className="text-[10px] font-bold text-slate-500">{backlink.clientName}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{backlink.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">Target: {backlink.targetUrl}</p>
                      <div className="mt-auto flex flex-wrap justify-between items-center border-t border-slate-200 pt-4 gap-2">
                         <button onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} className="text-xs font-bold text-brand-600 hover:underline">Revisar/Publicar</button>
                      </div>
                    </div>
                  ))}
                  {backlinks.filter((b:any) => b.clientName && b.clientName !== 'Agência' && ['Aguardando Aprovação', 'Aprovado'].includes(b.status)).length === 0 && (
                    <p className="text-slate-500 text-sm">Nenhum backlink pendente de aprovação.</p>
                  )}
                </div>
             </div>
          </div>
        ) : activeTab === 'Monitoramento de Rankings' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                 <div>
                   <h2 className="text-xl font-bold font-display text-slate-900 text-center md:text-left">Rankings e Posicionamento</h2>
                   <p className="text-sm font-medium text-slate-500">Acompanhe as principais palavras-chave do projeto.</p>
                 </div>
                 <div className="flex gap-3">
                   <button 
                      onClick={triggerTechnicalAudit} 
                      disabled={isAuditing}
                      className="bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition flex items-center px-4 py-2 gap-2"
                    >
                      {isAuditing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                      {isAuditing ? 'Auditoria em curso...' : 'Executar Auditoria Técnica'}
                   </button>
                   <div className="relative">
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Buscar keyword..." 
                       value={seoSearch}
                       onChange={e => setSeoSearch(e.target.value)}
                       className="pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-brand-500 py-2"
                     />
                   </div>
                   <button onClick={() => setShowSeoForm(true)} className="bg-brand-600 text-white font-bold rounded-lg text-sm hover:bg-brand-700 transition px-4 py-2">
                     Adicionar Keyword
                   </button>
                 </div>
               </div>

               {showSeoForm && (
                 <form onSubmit={handleSaveSeo} className="bg-slate-50 rounded-xl border border-slate-200 space-y-4 p-6 mb-8">
                    <h3 className="font-bold text-slate-800 mb-2 text-center md:text-left">{seoForm.id ? 'Editar Monitoramento' : 'Nova Keyword para Monitorar'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Palavra-chave</label>
                        <input required type="text" value={seoForm.title} onChange={e => setSeoForm({...seoForm, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Ex: agencia de seo" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">URL de Destino</label>
                        <input required type="text" value={seoForm.url} onChange={e => setSeoForm({...seoForm, url: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Posição Atual & Notas</label>
                      <input type="text" value={seoForm.customNotes} onChange={e => setSeoForm({...seoForm, customNotes: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Ex: Top 3 - Meta subir para Top 1" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => {setShowSeoForm(false); setSeoForm({ id: '', url: '', title: '', description: '', customNotes: '' });}} className="text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg px-4 py-2">Cancelar</button>
                      <button type="submit" className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg px-4 py-2">Salvar</button>
                    </div>
                 </form>
               )}

               <div className="overflow-x-auto">
                 {loadingSeo ? (
                   <div className="flex flex-col items-center space-y-3 py-12 text-justify md:text-left">
                     <Loader2 className="animate-spin text-brand-600" />
                     <p className="text-sm font-medium text-slate-500">Sincronizando rankings...</p>
                   </div>
                 ) : (
                   <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                       <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-bold">
                         <th className="pr-4 pb-3">Palavra-chave</th>
                         <th className="pb-3 px-4">URL Foco</th>
                         <th className="pb-3 px-4">Status / Saúde</th>
                         <th className="pl-4 text-right pb-3">Ações</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredSeoPages.map(page => (
                         <tr key={page.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                           <td className="pr-4 font-bold text-slate-800 text-sm py-4">{page.title}</td>
                           <td className="text-xs text-slate-500 truncate max-w-[200px] font-mono py-4 px-4">{page.url}</td>
                           <td className="py-4 px-4">
                             <div className="flex flex-col gap-1">
                               <div className="inline-flex items-center px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-tight w-fit gap-2 py-1">
                                 <TrendingUp size={10} /> {page.customNotes || 'Top 10'}
                               </div>
                               {page.lastAuditStatus && (
                                 <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${page.health === 'healthy' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                   HTTP {page.lastAuditStatus} {page.health === 'critical' && '⚠️'}
                                 </div>
                               )}
                             </div>
                           </td>
                           <td className="pl-4 text-right space-x-2 py-4">
                             <button onClick={() => { setSeoForm(page); setShowSeoForm(true); }} className="text-brand-600 hover:text-brand-700 rounded-lg hover:bg-brand-50 transition opacity-0 group-hover:opacity-100 p-2">
                               <Edit2 size={14} />
                             </button>
                             <button onClick={() => handleDeleteSeo(page.id)} className="text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 p-2">
                               <Trash2 size={14} />
                             </button>
                           </td>
                         </tr>
                       ))}
                       {filteredSeoPages.length === 0 && (
                         <tr><td colSpan={4} className="text-center py-12">
                           <div className="flex flex-col items-center space-y-2 opacity-50 text-justify md:text-left">
                             <Search size={32} className="text-slate-300" />
                             <p className="text-sm font-bold text-slate-400 tracking-tight">Nenhuma keyword sendo monitorada no momento.</p>
                           </div>
                         </td></tr>
                       )}
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </motion.div>
        ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              { title: 'Tráfego Orgânico', val: totalClicksInfo, change: '+24%', icon: Activity, color: 'brand' },
              { title: 'Keywords no Top 3', val: currentKwData.length > 5 ? '128' : currentKwData.length, change: '+12%', icon: Search, color: 'indigo' },
              { title: 'Saúde SEO', val: '94/100', change: '+2 pts', icon: CheckCircle2, color: 'emerald' },
              { title: 'Novos Backlinks', val: '24', change: '+5', icon: LinkIcon, color: 'amber' }
            ].map((metric, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-brand-100 transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 bg-${metric.color}-50 text-${metric.color}-600 rounded-2xl`}>
                    <metric.icon size={22} />
                  </div>
                  <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100/50 gap-1">
                    <TrendingUp size={14} /> {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{metric.title}</p>
                  <h3 className="text-3xl font-black text-slate-900 font-display tracking-tight mt-2 text-center md:text-left">
                    {metric.val.toString().includes('/') ? (
                      <>
                        {metric.val.toString().split('/')[0]}
                        <span className="text-lg text-slate-300 font-medium">/{metric.val.toString().split('/')[1]}</span>
                      </>
                    ) : metric.val}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts and Tables Area */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display text-center md:text-left">Crescimento Orgânico</h3>
                  <p className="text-sm text-slate-500 font-medium">Cliques (últimos 12 meses / 30 dias)</p>
                </div>
              </div>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Keyword Rankings */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display text-center md:text-left">Top Palavras-chave</h3>
                  <p className="text-sm text-slate-500 font-medium">Maiores ganhos na semana</p>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold">
                      <th className="pr-4 font-semibold pb-3">Keyword</th>
                      <th className="font-semibold pb-3 px-2">Pos</th>
                      <th className="pl-2 font-semibold text-right pb-3">Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentKwData.map((k: any, i: number) => (
                      <tr key={`kw-${k.kw}-${i}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="pr-4 text-sm font-medium text-slate-800 truncate max-w-[120px] sm:max-w-[150px] py-3">{k.kw}</td>
                        <td className="text-sm font-bold text-slate-900 flex items-center gap-1.5 py-3 px-2">
                          #{k.pos}
                          {k.diff > 0 ? (
                            <span className="text-emerald-500 text-[10px] flex items-center bg-emerald-50 rounded px-1"><ArrowUpRight size={10}/> {k.diff}</span>
                          ) : k.diff < 0 ? (
                            <span className="text-rose-500 text-[10px] flex items-center bg-rose-50 rounded px-1"><TrendingUp size={10} className="rotate-180" /> {Math.abs(k.diff)}</span>
                          ) : <span className="text-slate-300 text-[10px] px-1">-</span>}
                        </td>
                        <td className="pl-2 text-sm font-medium text-slate-500 text-right py-3">{k.vol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link to="/painel" className="text-sm text-brand-600 font-bold hover:text-brand-700 flex items-center justify-center border-t border-slate-100 transition-colors mt-auto mt-4 gap-1 pt-4">
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tasks Area */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display text-center md:text-left">SLA & Pendências</h3>
                <p className="text-sm text-slate-500 font-medium">Acompanhamento e gargalos dos clientes</p>
              </div>
            </div>

            <div className="grid gap-3">
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

                if (slaIssues.length === 0) {
                  return (
                    <div className="text-center text-slate-500 bg-slate-50 rounded-xl py-6">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                      Tudo em dia! Nenhum cliente com pendência no momento.
                    </div>
                  );
                }

                return slaIssues.map(c => (
                  <div key={c.id} className="flex flex-col sm:flex-row rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors p-4 gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <div className="flex flex-wrap mt-2 gap-2">
                        {c.missingPosts > 0 && (
                          <span className="inline-flex items-center px-2.5 text-xs font-bold bg-amber-50 text-amber-600 rounded-md gap-1 py-1">
                            Falta {c.missingPosts} Artigo(s)
                          </span>
                        )}
                        {c.missingLinks > 0 && (
                          <span className="inline-flex items-center px-2.5 text-xs font-bold bg-amber-50 text-amber-600 rounded-md gap-1 py-1">
                            Falta {c.missingLinks} Backlink(s)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => { setActiveTab('Clientes & CRM'); setFilterClient(c.name); }} className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 py-1.5 rounded-lg transition-colors px-3">
                        Ver Cliente
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </motion.div>
        )}
      </div>

      <PostFormModal 
        showPostForm={showPostForm} 
        setShowPostForm={setShowPostForm} 
        postForm={postForm} 
        setPostForm={setPostForm} 
        handleSavePost={handleSavePost}
        handleSaveDraft={handleSaveDraft}
        clientsList={clientsList}
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

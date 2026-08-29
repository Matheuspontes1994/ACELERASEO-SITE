import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import {
  Users,
  Search,
  Plus,
  FileText,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  DollarSign,
  Layers,
  ArrowLeft,
  X,
  Send,
  Building2,
  Filter
} from 'lucide-react';
import { HorizontalScroll } from './HorizontalScroll';

interface HubClientsProps {
  clientsList: string[];
  clients?: any[];
  selectedHubClient: string;
  setSelectedHubClient: (client: string) => void;
  keywordsUniverse: any[];
  showKeywordForm?: boolean;
  setShowKeywordForm: (show: boolean) => void;
  keywordForm?: any;
  setKeywordForm: (form: any) => void;
  handleSaveKeyword?: (e: React.FormEvent) => void;
  handleDeleteKeyword: (id: string) => void;
  blogPosts: any[];
  backlinks: any[];
  postForm?: any;
  setPostForm: (form: any) => void;
  showPostForm?: boolean;
  setShowPostForm: (show: boolean) => void;
  backlinkForm?: any;
  setBacklinkForm: (form: any) => void;
  showBacklinkForm?: boolean;
  setShowBacklinkForm: (show: boolean) => void;
  handleDeletePost: (id: string, coverImage?: string) => void;
  handleDeleteBacklink: (id: string) => void;
  loadBlogPosts: () => void;
  loadBacklinks: () => void;
  promoteKeywordToPost: (keyword: any) => void;
  promoteKeywordToBacklink: (keyword: any) => void;
  handleSavePost?: (e: React.FormEvent) => void;
  handleSaveBacklink?: (e: React.FormEvent) => void;
  [key: string]: any;
}

export function HubClients({
  clientsList = [],
  clients = [],
  selectedHubClient,
  setSelectedHubClient,
  keywordsUniverse = [],
  showKeywordForm,
  setShowKeywordForm,
  keywordForm,
  setKeywordForm,
  handleSaveKeyword,
  handleDeleteKeyword,
  blogPosts = [],
  backlinks = [],
  setPostForm,
  setShowPostForm,
  setBacklinkForm,
  setShowBacklinkForm,
  handleDeletePost,
  handleDeleteBacklink,
  loadBlogPosts,
  loadBacklinks,
  promoteKeywordToPost,
  promoteKeywordToBacklink,
}: HubClientsProps) {
  const [clientSearch, setClientSearch] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [keywordStatusFilter, setKeywordStatusFilter] = useState<'todos' | 'Disponível' | 'Em Produção'>('todos');
  
  // Dialog state para publicação de post ou backlink sem window.prompt
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'backlink';
    id: string;
    title: string;
    url: string;
  }>({
    isOpen: false,
    type: 'post',
    id: '',
    title: '',
    url: '',
  });

  // Lista de unidades válidas
  const selectableClients = useMemo(() => {
    return clients.filter(c => c.name && c.name !== 'Agência');
  }, [clients]);

  const filteredSelectableClients = useMemo(() => {
    if (!clientSearch) return selectableClients;
    const query = clientSearch.toLowerCase();
    return selectableClients.filter(c => 
      c.name.toLowerCase().includes(query) ||
      (c.domain && c.domain.toLowerCase().includes(query)) ||
      (c.plan && c.plan.toLowerCase().includes(query))
    );
  }, [selectableClients, clientSearch]);

  const selectedClientData = useMemo(() => {
    return clients.find(c => c.name === selectedHubClient);
  }, [clients, selectedHubClient]);

  // Palavras-chave da unidade
  const clientKeywords = useMemo(() => {
    return keywordsUniverse.filter(k => k.clientName === selectedHubClient);
  }, [keywordsUniverse, selectedHubClient]);

  const filteredKeywords = useMemo(() => {
    return clientKeywords.filter(k => {
      const matchSearch = !keywordSearch || 
        k.keyword.toLowerCase().includes(keywordSearch.toLowerCase()) ||
        (k.targetMonth && k.targetMonth.toLowerCase().includes(keywordSearch.toLowerCase()));
      const matchStatus = keywordStatusFilter === 'todos' || (k.status || 'Disponível') === keywordStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [clientKeywords, keywordSearch, keywordStatusFilter]);

  // Artigos e Backlinks da unidade
  const clientPosts = useMemo(() => {
    return blogPosts.filter(p => p.clientName === selectedHubClient);
  }, [blogPosts, selectedHubClient]);

  const clientBacklinks = useMemo(() => {
    return backlinks.filter(b => b.clientName === selectedHubClient);
  }, [backlinks, selectedHubClient]);

  // Handler de finalização com URL
  const handleConfirmPublish = async () => {
    if (!publishModal.url.trim() || !publishModal.id) return;
    try {
      if (publishModal.type === 'post') {
        await updateDoc(doc(db, 'blog_posts', publishModal.id), {
          status: 'Publicado',
          publishedUrl: publishModal.url.trim(),
          publishedAt: new Date().toISOString().split('T')[0],
          updatedAt: serverTimestamp(),
        });
        loadBlogPosts();
      } else {
        await updateDoc(doc(db, 'backlinks', publishModal.id), {
          status: 'Publicado',
          publishedUrl: publishModal.url.trim(),
          publishedAt: new Date().toISOString().split('T')[0],
          updatedAt: serverTimestamp(),
        });
        loadBacklinks();
      }
      setPublishModal({ isOpen: false, type: 'post', id: '', title: '', url: '' });
    } catch (err) {
      console.error('Erro ao atualizar status para Publicado:', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 text-left">
      {/* 1. SE NENHUM CLIENTE SELECIONADO: Grade de Seleção de Unidades */}
      {!selectedHubClient ? (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Building2 size={16} />
                <span>Hub de Unidades & Operações</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selecione uma Unidade de Performance
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Gerencie o pipeline de produção, autoridade off-page e inteligência de palavras-chave por cliente
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Buscar unidade ou domínio..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Grade de Unidades */}
          {filteredSelectableClients.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <Building2 className="mx-auto text-slate-300" size={36} />
              <h4 className="text-sm font-bold text-slate-700">Nenhuma unidade encontrada</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Verifique os termos da busca ou cadastre novas contas no painel Clientes & CRM.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSelectableClients.map((c: any) => {
                const totalPosts = blogPosts.filter(p => p.clientName === c.name).length;
                const totalLinks = backlinks.filter(b => b.clientName === c.name).length;
                const totalKw = keywordsUniverse.filter(k => k.clientName === c.name).length;

                return (
                  <div
                    key={c.id || c.name}
                    onClick={() => setSelectedHubClient(c.name)}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-brand-50 group-hover:text-brand-700 font-bold flex items-center justify-center border border-slate-200 group-hover:border-brand-200 uppercase tracking-tight text-sm transition-colors">
                          {c.name.slice(0, 2)}
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {c.plan || 'Plano SEO'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight">
                        {c.name}
                      </h3>
                      {c.domain && (
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                          {c.domain}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-medium">
                        <span><strong>{totalPosts}</strong> pautas</span>
                        <span>•</span>
                        <span><strong>{totalLinks}</strong> links</span>
                        <span>•</span>
                        <span><strong>{totalKw}</strong> kw</span>
                      </div>
                      <span className="text-slate-900 group-hover:text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                        <span>Acessar</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 2. QUANDO UM CLIENTE ESTÁ SELECIONADO: Hub Completo da Unidade */
        <div className="space-y-6">
          {/* Header Executivo da Unidade */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedHubClient('')}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Voltar para lista de unidades"
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Seletor Estilizado com Design Padronizado */}
                  <div className="relative inline-flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 transition">
                    <select
                      value={selectedHubClient}
                      onChange={(e) => setSelectedHubClient(e.target.value)}
                      className="text-base font-bold text-slate-900 bg-transparent pr-6 cursor-pointer focus:outline-hidden appearance-none"
                    >
                      {selectableClients.map((c: any) => (
                        <option key={c.id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 pointer-events-none text-slate-400" />
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    {selectedClientData?.plan || 'Operação Ativa'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                  <span>Gestão operacional de conteúdo, backlinks e palavras-chave</span>
                  {selectedClientData?.domain && (
                    <>
                      <span>•</span>
                      <a
                        href={selectedClientData.domain.startsWith('http') ? selectedClientData.domain : `https://${selectedClientData.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 hover:text-brand-600 flex items-center gap-1 underline font-mono text-xs font-medium"
                      >
                        <span>{selectedClientData.domain}</span>
                        <ExternalLink size={11} />
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions Padronizadas */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setKeywordForm({
                    id: '',
                    clientName: selectedHubClient,
                    clientEmail: '',
                    keyword: '',
                    searchVolume: '',
                    difficulty: '',
                    status: 'Disponível',
                    notes: '',
                    targetMonth: '',
                    internalLinking: '',
                    theme: '',
                    secondaryKeywords: ''
                  });
                  setShowKeywordForm(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer shadow-2xs"
              >
                <Sparkles size={14} className="text-slate-500" />
                <span>+ Palavra-chave</span>
              </button>

              <button
                onClick={() => {
                  setPostForm({
                    id: '',
                    title: '',
                    clientName: selectedHubClient,
                    clientEmail: '',
                    targetMonth: new Date().toISOString().slice(0, 7),
                    slug: '',
                    description: '',
                    content: '',
                    coverImage: '',
                    category: 'Geral',
                    focusKeywords: '',
                    anchor: '',
                    seoTitle: '',
                    wordCount: '',
                    targetWords: '',
                    imagesInfo: '',
                    status: 'RascunhoInterno',
                    publishedAt: '',
                    publishedUrl: '',
                    internalLinking: '',
                    theme: '',
                    secondaryKeywords: '',
                    directioning: ''
                  });
                  setShowPostForm(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <FileText size={14} />
                <span>+ Nova Pauta</span>
              </button>

              <button
                onClick={() => {
                  setBacklinkForm({
                    id: '',
                    title: '',
                    clientName: selectedHubClient,
                    clientEmail: '',
                    targetMonth: new Date().toISOString().slice(0, 7),
                    focusKeywords: '',
                    anchor: '',
                    targetUrl: '',
                    theme: '',
                    directioning: '',
                    content: '',
                    status: 'Pendente',
                    publishedAt: '',
                    publishedUrl: '',
                    wordCount: '',
                    targetWords: ''
                  });
                  setShowBacklinkForm(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <LinkIcon size={14} />
                <span>+ Novo Link</span>
              </button>
            </div>
          </div>

          {/* 4 KPIs de Contrato e SLAs da Unidade - Ícones e Estrutura Padronizados */}
          {selectedClientData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investimento Mensal</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedClientData.packageValue || 0)}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Recorrência acordada</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pautas Contratadas</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedClientData.monthlyPosts || 0}
                    <span className="text-xs font-semibold text-slate-400 ml-1">posts / mês</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Capacidade on-page mensal</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Links Estratégicos</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <LinkIcon size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedClientData.monthlyBacklinks || 0}
                    <span className="text-xs font-semibold text-slate-400 ml-1">links / mês</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Meta de autoridade off-page</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA de Aprovação</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedClientData.approvalDeadlineDays || 5}
                    <span className="text-xs font-semibold text-slate-400 ml-1">dias úteis</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tempo limite de validação</p>
                </div>
              </div>
            </div>
          )}

          {/* Universo de Keywords da Unidade */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-600" />
                  <h3 className="text-base font-bold text-slate-900">Universo de Palavras-chave</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Mapeamento de termos estratégicos, volumes e oportunidades de ranqueamento
                </p>
              </div>

              {/* Filtros e Busca de Keywords */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar palavra ou ciclo..."
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-brand-500 w-44"
                  />
                </div>

                <div className="inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                  <button
                    onClick={() => setKeywordStatusFilter('todos')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      keywordStatusFilter === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Todas ({clientKeywords.length})
                  </button>
                  <button
                    onClick={() => setKeywordStatusFilter('Disponível')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      keywordStatusFilter === 'Disponível' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Disponíveis
                  </button>
                  <button
                    onClick={() => setKeywordStatusFilter('Em Produção')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      keywordStatusFilter === 'Em Produção' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Em Produção
                  </button>
                </div>
              </div>
            </div>

            {/* Tabela de Keywords */}
            {filteredKeywords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Sparkles size={28} className="mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-700">Nenhuma palavra-chave encontrada</p>
                <p className="text-[11px] text-slate-400">
                  Cadastre palavras estratégicas para acelerar a geração de pautas e links.
                </p>
              </div>
            ) : (
              <HorizontalScroll>
                <table className="w-full text-left min-w-[700px] text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Ciclo</th>
                      <th className="py-3 px-4">Palavra-chave Estratégica</th>
                      <th className="py-3 px-4 text-center">Volume</th>
                      <th className="py-3 px-4 text-center">Dificuldade (KD)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredKeywords
                      .sort((a: any, b: any) => (b.targetMonth || '').localeCompare(a.targetMonth || ''))
                      .map((kw: any) => {
                        const kd = Number(kw.difficulty || 0);
                        const kdBadge = kd < 30 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        kd < 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-rose-50 text-rose-700 border-rose-200';

                        return (
                          <tr key={kw.id} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="py-3 px-4">
                              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                {kw.targetMonth || 'Geral'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {kw.keyword}
                              </span>
                              {kw.notes && (
                                <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{kw.notes}</p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-medium text-slate-600">
                              {kw.searchVolume || '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] border ${kdBadge}`}>
                                {kw.difficulty || '0'} KD
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                kw.status === 'Em Produção'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {kw.status || 'Disponível'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => promoteKeywordToPost(kw)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 rounded-lg text-[11px] font-bold border border-slate-200 transition cursor-pointer shadow-2xs"
                                  title="Criar Pauta a partir desta Keyword"
                                >
                                  + Pauta
                                </button>
                                <button
                                  onClick={() => promoteKeywordToBacklink(kw)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 rounded-lg text-[11px] font-bold border border-slate-200 transition cursor-pointer shadow-2xs"
                                  title="Criar Backlink a partir desta Keyword"
                                >
                                  + Link
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remover a palavra-chave "${kw.keyword}"?`)) {
                                      handleDeleteKeyword(kw.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                  title="Excluir Palavra-chave"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </HorizontalScroll>
            )}
          </div>

          {/* Grid de Produção On-Page & Off-Page */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Célula de Conteúdo On-Page */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Célula de Conteúdo (Artigos)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Pipeline on-page e entregáveis</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{clientPosts.length} itens</span>
              </div>

              {clientPosts.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <FileText size={24} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">Nenhum artigo cadastrado</p>
                  <p className="text-[11px] text-slate-400">Clique em "+ Nova Pauta" para iniciar o ciclo.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {clientPosts.map((post: any) => (
                    <div
                      key={`hub-post-${post.id}`}
                      className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          post.status === 'Publicado'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : post.status === 'Aguardando Aprovação'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-brand-50 text-brand-700 border-brand-200'
                        }`}>
                          {post.status}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{post.targetMonth || 'Sem ciclo'}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{post.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Palavra-chave: <strong className="text-slate-700">{post.focusKeywords || 'Não definida'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setPostForm(post);
                              setShowPostForm(true);
                            }}
                            className="font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          >
                            Revisar
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Deseja realmente remover esta pauta?')) {
                                handleDeletePost(post.id, post.coverImage);
                              }
                            }}
                            className="font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>

                        {post.status !== 'Publicado' ? (
                          <button
                            onClick={() => {
                              setPublishModal({
                                isOpen: true,
                                type: 'post',
                                id: post.id,
                                title: post.title,
                                url: post.publishedUrl || '',
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-brand-600 text-white rounded-lg font-bold text-[11px] transition cursor-pointer shadow-2xs"
                          >
                            Finalizar Publicação
                          </button>
                        ) : post.publishedUrl ? (
                          <a
                            href={post.publishedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline"
                          >
                            <span>Ver post</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Célula de Autoridade Off-Page */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <LinkIcon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Célula de Autoridade (Backlinks)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Links estratégicos e prospecção</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{clientBacklinks.length} itens</span>
              </div>

              {clientBacklinks.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <LinkIcon size={24} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">Nenhum backlink cadastrado</p>
                  <p className="text-[11px] text-slate-400">Clique em "+ Novo Link" para planejar ativos.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {clientBacklinks.map((backlink: any) => (
                    <div
                      key={`hub-backlink-${backlink.id}`}
                      className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          backlink.status === 'Publicado'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {backlink.status}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{backlink.targetMonth || 'Sem ciclo'}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{backlink.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Âncora: <strong className="text-slate-700">{backlink.anchor || backlink.focusKeywords || 'Não definida'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setBacklinkForm(backlink);
                              setShowBacklinkForm(true);
                            }}
                            className="font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          >
                            Ajustar
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Deseja realmente remover este backlink?')) {
                                handleDeleteBacklink(backlink.id);
                              }
                            }}
                            className="font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>

                        {backlink.status !== 'Publicado' ? (
                          <button
                            onClick={() => {
                              setPublishModal({
                                isOpen: true,
                                type: 'backlink',
                                id: backlink.id,
                                title: backlink.title,
                                url: backlink.publishedUrl || '',
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-brand-600 text-white rounded-lg font-bold text-[11px] transition cursor-pointer shadow-2xs"
                          >
                            Validar Link Ativo
                          </button>
                        ) : backlink.publishedUrl ? (
                          <a
                            href={backlink.publishedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline"
                          >
                            <span>Ver link</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Suave para Publicação com URL (Substitui window.prompt) */}
      <AnimatePresence>
        {publishModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {publishModal.type === 'post' ? 'Concluir Artigo On-Page' : 'Validar Backlink Off-Page'}
                  </h3>
                </div>
                <button
                  onClick={() => setPublishModal({ isOpen: false, type: 'post', id: '', title: '', url: '' })}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Insira a URL pública final onde o item foi veiculado:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-800 line-clamp-1">
                  {publishModal.title}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Final de Publicação
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com.br/artigo-ou-link"
                    value={publishModal.url}
                    onChange={(e) => setPublishModal({ ...publishModal, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setPublishModal({ isOpen: false, type: 'post', id: '', title: '', url: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPublish}
                  disabled={!publishModal.url.trim()}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 size={14} />
                  <span>Confirmar Publicação</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

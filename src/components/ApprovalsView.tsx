import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Search,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  Filter,
  Eye
} from 'lucide-react';
import { Skeleton } from './Skeleton';

interface ApprovalsViewProps {
  blogPosts: any[];
  backlinks: any[];
  loadingPosts: boolean;
  loadingBacklinks: boolean;
  loadBlogPosts: (force?: boolean) => void;
  loadBacklinks: (force?: boolean) => void;
  updatePostStatus: (id: string, newStatus: string) => Promise<void>;
  updateBacklinkStatus: (id: string, newStatus: string) => Promise<void>;
  setPostForm: (form: any) => void;
  setShowPostForm: (show: boolean) => void;
  setBacklinkForm: (form: any) => void;
  setShowBacklinkForm: (show: boolean) => void;
  selectedHubClient: string;
  setSelectedHubClient: (client: string) => void;
  clientsList: string[];
  handleBulkApprove: () => Promise<void>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelection: (id: string) => void;
}

export function ApprovalsView({
  blogPosts = [],
  backlinks = [],
  loadingPosts = false,
  loadingBacklinks = false,
  loadBlogPosts,
  loadBacklinks,
  updatePostStatus,
  updateBacklinkStatus,
  setPostForm,
  setShowPostForm,
  setBacklinkForm,
  setShowBacklinkForm,
  selectedHubClient,
  setSelectedHubClient,
  clientsList = [],
  handleBulkApprove,
  selectedIds = [],
  setSelectedIds,
  toggleSelection
}: ApprovalsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aguardando Aprovação' | 'Ajustes Necessários' | 'Aprovado'>('Todos');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'artigos' | 'backlinks'>('todos');

  // Filtered Blog Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(p => {
      // Must be in approval workflow status
      const validStatuses = ['Aguardando Aprovação', 'Aprovado', 'Aprovado com Ressalvas', 'Ajustes Necessários'];
      if (!validStatuses.includes(p.status)) return false;

      // Exclude internal agency content from client approvals
      if (!p.clientName || p.clientName === 'Agência') return false;

      // Unit filter
      if (selectedHubClient && p.clientName !== selectedHubClient) return false;

      // Status filter
      if (statusFilter !== 'Todos' && p.status !== statusFilter) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchClient = p.clientName?.toLowerCase().includes(q);
        const matchTheme = p.theme?.toLowerCase().includes(q);
        const matchComment = p.clientComment?.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchTheme && !matchComment) return false;
      }

      return true;
    });
  }, [blogPosts, selectedHubClient, statusFilter, searchQuery]);

  // Filtered Backlinks
  const filteredBacklinks = useMemo(() => {
    return backlinks.filter(b => {
      // Must be in approval workflow status
      const validStatuses = ['Aguardando Aprovação', 'Aprovado', 'Ajustes Necessários'];
      if (!validStatuses.includes(b.status)) return false;

      // Exclude internal agency content from client approvals
      if (!b.clientName || b.clientName === 'Agência') return false;

      // Unit filter
      if (selectedHubClient && b.clientName !== selectedHubClient) return false;

      // Status filter
      if (statusFilter !== 'Todos' && b.status !== statusFilter) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = b.title?.toLowerCase().includes(q);
        const matchAnchor = b.anchor?.toLowerCase().includes(q);
        const matchClient = b.clientName?.toLowerCase().includes(q);
        const matchUrl = b.targetUrl?.toLowerCase().includes(q);
        if (!matchTitle && !matchAnchor && !matchClient && !matchUrl) return false;
      }

      return true;
    });
  }, [backlinks, selectedHubClient, statusFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const totalPendingPosts = blogPosts.filter(p => p.status === 'Aguardando Aprovação' && p.clientName && p.clientName !== 'Agência' && (!selectedHubClient || p.clientName === selectedHubClient)).length;
    const totalPendingLinks = backlinks.filter(b => b.status === 'Aguardando Aprovação' && b.clientName && b.clientName !== 'Agência' && (!selectedHubClient || b.clientName === selectedHubClient)).length;
    const totalAdjustments = blogPosts.filter(p => p.status === 'Ajustes Necessários' && p.clientName && p.clientName !== 'Agência' && (!selectedHubClient || p.clientName === selectedHubClient)).length;
    const totalApproved = blogPosts.filter(p => p.status === 'Aprovado' && p.clientName && p.clientName !== 'Agência' && (!selectedHubClient || p.clientName === selectedHubClient)).length + 
                          backlinks.filter(b => b.status === 'Aprovado' && b.clientName && b.clientName !== 'Agência' && (!selectedHubClient || b.clientName === selectedHubClient)).length;

    return {
      pending: totalPendingPosts + totalPendingLinks,
      adjustments: totalAdjustments,
      approved: totalApproved,
      total: totalPendingPosts + totalPendingLinks + totalAdjustments + totalApproved
    };
  }, [blogPosts, backlinks, selectedHubClient]);

  const isLoading = loadingPosts || loadingBacklinks;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 text-left">
      {/* 1. Header Principal */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Clock size={16} />
            <span>Esteira de Aprovações & Validações</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Central de Validação de Conteúdo
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Acompanhe a revisão de artigos e backlinks submetidos aos clientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { loadBlogPosts(true); loadBacklinks(true); }}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Recarregar Dados"
          >
            <RefreshCcw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. KPIs de Aprovações */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aguardando Cliente</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-600">{metrics.pending}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Sob análise nos portais</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ajustes Solicitados</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-rose-600">{metrics.adjustments}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Requer revisão da redação</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aprovados</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600">{metrics.approved}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Prontos para publicação</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume em Trânsito</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{metrics.total}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total de ativos no fluxo</p>
          </div>
        </div>
      </div>

      {/* Barra de Ações em Massa Flutuante */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="p-4 bg-brand-600 rounded-2xl flex items-center justify-between shadow-lg text-white sticky top-4 z-40"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                {selectedIds.length}
              </div>
              <span className="text-xs font-bold">
                {selectedIds.length === 1 ? '1 ativo selecionado' : `${selectedIds.length} ativos selecionados`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-white text-brand-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 size={15} />
                <span>Aprovar Seleção</span>
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-2 bg-brand-700 hover:bg-brand-800 text-white/90 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Painel de Conteúdos e Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Barra de Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {/* Busca */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, cliente ou nota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
            </div>

            {/* Filtro por Cliente */}
            <div className="relative">
              <select
                value={selectedHubClient}
                onChange={(e) => setSelectedHubClient(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
              >
                <option value="">Todos os Clientes</option>
                {clientsList.filter((c: any) => c !== 'Agência').map((c: string, idx: number) => (
                  <option key={`client-appr-${idx}`} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* Filtro por Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                <option value="Ajustes Necessários">Ajustes Necessários</option>
                <option value="Aprovado">Aprovado</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* Seletor de Tipo (Artigos vs Backlinks) */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold self-start lg:self-auto">
            <button
              onClick={() => setTypeFilter('todos')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                typeFilter === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos ({filteredPosts.length + filteredBacklinks.length})
            </button>
            <button
              onClick={() => setTypeFilter('artigos')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                typeFilter === 'artigos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Artigos ({filteredPosts.length})
            </button>
            <button
              onClick={() => setTypeFilter('backlinks')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                typeFilter === 'backlinks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Backlinks ({filteredBacklinks.length})
            </button>
          </div>
        </div>

        {/* 4. Grid de Validação de Conteúdos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`skel-appr-${i}`} variant="rectangular" className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : (filteredPosts.length === 0 && filteredBacklinks.length === 0) ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Clock size={32} className="mx-auto text-slate-300 stroke-[1.5]" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum ativo aguardando validação</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando novos artigos ou links forem submetidos para validação do cliente, eles aparecerão organizados aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1: Artigos de Blog */}
            {(typeFilter === 'todos' || typeFilter === 'artigos') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <FileText size={15} className="text-brand-600" />
                    <span>Artigos do Blog ({filteredPosts.length})</span>
                  </div>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">Sem artigos para aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPosts.map(post => {
                      const isSelected = selectedIds.includes(post.id);
                      const isNeedsAdjustments = post.status === 'Ajustes Necessários';
                      const isApproved = post.status === 'Aprovado';
                      const isPending = post.status === 'Aguardando Aprovação';

                      return (
                        <div
                          key={post.id}
                          className={`bg-white border rounded-2xl p-5 hover:shadow-sm transition-all relative overflow-hidden group ${
                            isNeedsAdjustments ? 'border-rose-200 bg-rose-50/20' :
                            isApproved ? 'border-emerald-200 bg-emerald-50/20' :
                            'border-slate-200/90'
                          } ${isSelected ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
                        >
                          {/* Checkbox de Seleção */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleSelection(post.id); }}
                            className={`absolute right-4 top-4 z-10 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                              isSelected
                                ? 'bg-brand-600 border-brand-600 text-white'
                                : 'border-slate-300 bg-white hover:border-brand-500 text-transparent'
                            }`}
                            title="Selecionar para ação em massa"
                          >
                            <Check size={12} strokeWidth={3} />
                          </button>

                          {/* Top Badges */}
                          <div className="flex items-center gap-2 mb-2.5 pr-8">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                              {post.clientName}
                            </span>
                            {post.targetMonth && (
                              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                {post.targetMonth}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ml-auto ${
                              isNeedsAdjustments ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {post.status}
                            </span>
                          </div>

                          {/* Título */}
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug mb-2">
                            {post.title}
                          </h4>

                          {/* Feedback de Ajustes do Cliente */}
                          {post.clientComment && (
                            <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 mb-3 space-y-1">
                              <span className="font-bold block text-[11px] uppercase tracking-wider text-rose-800">
                                Feedback do Cliente:
                              </span>
                              <p className="italic">"{post.clientComment}"</p>
                            </div>
                          )}

                          {/* Rodapé e Ações */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                            <button
                              onClick={() => { setPostForm({ clientComment: '', ...post }); setShowPostForm(true); }}
                              className="text-xs font-bold text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={14} />
                              <span>{isNeedsAdjustments ? 'Ver Ajustes' : 'Revisar Conteúdo'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {isApproved && (
                                <button
                                  onClick={() => updatePostStatus(post.id, 'Publicado')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                  <Check size={13} />
                                  <span>Publicar</span>
                                </button>
                              )}

                              {isNeedsAdjustments && (
                                <button
                                  onClick={() => updatePostStatus(post.id, 'Em Produção')}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                  <RotateCcw size={13} />
                                  <span>Refazer</span>
                                </button>
                              )}

                              {isPending && (
                                <div className="text-right">
                                  <span className="text-[10px] font-semibold text-slate-400 block">Aguardando cliente</span>
                                  {post.remainingApprovalDays !== undefined && (
                                    <span className={`text-[10px] font-bold ${
                                      Number(post.remainingApprovalDays) <= 1 ? 'text-rose-600' : 'text-amber-600'
                                    }`}>
                                      {post.remainingApprovalDays} {Number(post.remainingApprovalDays) === 1 ? 'dia útil restante' : 'dias úteis restantes'}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Coluna 2: Backlinks Estratégicos */}
            {(typeFilter === 'todos' || typeFilter === 'backlinks') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <LinkIcon size={15} className="text-indigo-600" />
                    <span>Backlinks & Off-Page ({filteredBacklinks.length})</span>
                  </div>
                </div>

                {filteredBacklinks.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">Sem backlinks para aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBacklinks.map(link => {
                      const isSelected = selectedIds.includes(link.id);
                      const isApproved = link.status === 'Aprovado';
                      const isPending = link.status === 'Aguardando Aprovação';

                      return (
                        <div
                          key={link.id}
                          className={`bg-white border rounded-2xl p-5 hover:shadow-sm transition-all relative overflow-hidden group ${
                            isApproved ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/90'
                          } ${isSelected ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
                        >
                          {/* Checkbox de Seleção */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleSelection(link.id); }}
                            className={`absolute right-4 top-4 z-10 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                              isSelected
                                ? 'bg-brand-600 border-brand-600 text-white'
                                : 'border-slate-300 bg-white hover:border-brand-500 text-transparent'
                            }`}
                            title="Selecionar para ação em massa"
                          >
                            <Check size={12} strokeWidth={3} />
                          </button>

                          {/* Top Badges */}
                          <div className="flex items-center gap-2 mb-2.5 pr-8">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                              {link.clientName}
                            </span>
                            {link.targetMonth && (
                              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                {link.targetMonth}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ml-auto ${
                              isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {link.status}
                            </span>
                          </div>

                          {/* Âncora & Título */}
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug mb-1">
                            {link.anchor || link.title || 'Link Estratégico'}
                          </h4>

                          {link.theme && (
                            <p className="text-xs text-slate-500 italic mb-2">
                              "{link.theme}"
                            </p>
                          )}

                          {link.targetUrl && (
                            <p className="text-[11px] font-mono text-slate-400 truncate mb-3">
                              Destino: {link.targetUrl}
                            </p>
                          )}

                          {/* Rodapé e Ações */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                            <button
                              onClick={() => { setBacklinkForm(link); setShowBacklinkForm(true); }}
                              className="text-xs font-bold text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={14} />
                              <span>Ver Detalhes</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateBacklinkStatus(link.id, 'Publicado')}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-200"
                                title="Marcar como Publicado"
                              >
                                <Check size={13} />
                                <span>Aprovar & Publicar</span>
                              </button>

                              <button
                                onClick={() => updateBacklinkStatus(link.id, 'Ajustes Necessários')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-rose-200"
                                title="Solicitar Ajustes"
                              >
                                <span>Ajustar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

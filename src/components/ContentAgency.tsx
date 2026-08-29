import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Link as LinkIcon, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Filter, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Eye,
  Tag,
  BookOpen
} from 'lucide-react';
import { db } from '../firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

interface ContentAgencyProps {
  blogPosts: any[];
  backlinks: any[];
  setPostForm: (form: any) => void;
  setShowPostForm: (show: boolean) => void;
  setBacklinkForm: (form: any) => void;
  setShowBacklinkForm: (show: boolean) => void;
  handleDeletePost: (id: string, coverImage?: string) => void;
  handleDeleteBacklink: (id: string) => void;
  loadBlogPosts: (force?: boolean) => void;
  loadBacklinks: (force?: boolean) => void;
  selectedCycle?: string;
  setSelectedCycle?: (cycle: string) => void;
  formatCycleDate?: (dateStr: string) => string;
  clientsList?: string[];
  showPostForm?: boolean;
  postForm?: any;
  handleSavePost?: any;
  handleSaveDraft?: any;
  showBacklinkForm?: boolean;
  backlinkForm?: any;
  handleSaveBacklink?: any;
  [key: string]: any;
}

export function ContentAgency({ 
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
  selectedCycle = '',
  setSelectedCycle,
  formatCycleDate = (d) => d
}: ContentAgencyProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeSection, setActiveSection] = useState<'artigos' | 'backlinks'>('artigos');

  // Filtragem estrita para a Agência (sem consultas no banco)
  const agencyPosts = useMemo(() => {
    return blogPosts.filter((p: any) => p.clientName === 'Agência' || p.clientName === '' || !p.clientName);
  }, [blogPosts]);

  const agencyBacklinks = useMemo(() => {
    return backlinks.filter((b: any) => b.clientName === 'Agência' || b.clientName === '' || !b.clientName);
  }, [backlinks]);

  // Lista de categorias únicas em memória
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    agencyPosts.forEach((p: any) => {
      if (p.category) cats.add(p.category);
    });
    return ['Todas', ...Array.from(cats)];
  }, [agencyPosts]);

  // Métricas calculadas em memória (Zero custo de DB)
  const metrics = useMemo(() => {
    const totalPosts = agencyPosts.length;
    const publishedPosts = agencyPosts.filter((p: any) => p.status === 'Publicado').length;
    const draftPosts = agencyPosts.filter((p: any) => p.status === 'Rascunho' || p.status === 'Planejado').length;
    const totalLinks = agencyBacklinks.length;
    const cyclePosts = selectedCycle 
      ? agencyPosts.filter((p: any) => p.targetMonth === selectedCycle).length 
      : totalPosts;
    const pubRate = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

    return { totalPosts, publishedPosts, draftPosts, totalLinks, cyclePosts, pubRate };
  }, [agencyPosts, agencyBacklinks, selectedCycle]);

  // Artigos filtrados
  const filteredPosts = useMemo(() => {
    return agencyPosts.filter((post: any) => {
      // Filtro de ciclo / mês
      if (selectedCycle && post.targetMonth && post.targetMonth !== selectedCycle) {
        return false;
      }
      // Filtro de status
      if (selectedStatus !== 'Todos') {
        if (selectedStatus === 'Publicados' && post.status !== 'Publicado') return false;
        if (selectedStatus === 'Rascunhos' && post.status !== 'Rascunho') return false;
        if (selectedStatus === 'Em Produção' && !['Planejado', 'Em Produção', 'Aguardando Aprovação'].includes(post.status)) return false;
      }
      // Filtro de categoria
      if (selectedCategory !== 'Todas' && post.category !== selectedCategory) {
        return false;
      }
      // Filtro de busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title?.toLowerCase().includes(q);
        const matchesKeywords = post.focusKeywords?.toLowerCase().includes(q);
        const matchesDesc = post.description?.toLowerCase().includes(q);
        const matchesCategory = post.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesKeywords && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [agencyPosts, selectedCycle, selectedStatus, selectedCategory, searchQuery]);

  // Backlinks filtrados
  const filteredBacklinks = useMemo(() => {
    return agencyBacklinks.filter((backlink: any) => {
      if (selectedCycle && backlink.targetMonth && backlink.targetMonth !== selectedCycle) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = backlink.title?.toLowerCase().includes(q);
        const matchesKeywords = backlink.focusKeywords?.toLowerCase().includes(q);
        const matchesUrl = backlink.targetUrl?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesKeywords && !matchesUrl) {
          return false;
        }
      }
      return true;
    });
  }, [agencyBacklinks, selectedCycle, searchQuery]);

  const handleOpenNewPost = () => {
    setPostForm({ 
      id: '', 
      title: '', 
      clientName: 'Agência', 
      clientEmail: '', 
      targetMonth: selectedCycle || new Date().toISOString().slice(0, 7), 
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
      status: 'Rascunho', 
      publishedAt: '', 
      publishedUrl: '', 
      internalLinking: '', 
      theme: '', 
      secondaryKeywords: '', 
      directioning: '' 
    });
    setShowPostForm(true);
  };

  const handleOpenNewBacklink = () => {
    setBacklinkForm({ 
      id: '', 
      title: '', 
      clientName: 'Agência', 
      clientEmail: '', 
      targetMonth: selectedCycle || new Date().toISOString().slice(0, 7), 
      focusKeywords: '', 
      anchor: '', 
      targetUrl: '', 
      theme: '', 
      directioning: '', 
      content: '', 
      status: 'Aguardando Produção', 
      publishedAt: '', 
      publishedUrl: '', 
      wordCount: '', 
      targetWords: '' 
    });
    setShowBacklinkForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      
      {/* Top Banner & Ações */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Workspace Agência</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Crescimento & <span className="text-brand-600">Conteúdo</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Produção editorial do Blog Acelera SEO e esteira estratégica de backlinks proprietários.
            </p>
          </div>

          {/* Ações Rápidas */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleOpenNewPost}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              Novo Artigo do Blog
            </button>
            <button 
              onClick={handleOpenNewBacklink}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-98 cursor-pointer"
            >
              <LinkIcon size={14} className="text-slate-400" />
              Novo Backlink
            </button>
          </div>
        </div>

        {/* Métricas de Performance em Memória */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Artigos Totais</span>
              <BookOpen size={15} className="text-brand-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.totalPosts}</span>
              <span className="text-[11px] font-semibold text-slate-400">ativos</span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Publicados</span>
              <CheckCircle2 size={15} className="text-brand-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.publishedPosts}</span>
              <span className="text-[11px] font-semibold text-brand-600">({metrics.pubRate}%)</span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Em Produção / Rasc.</span>
              <Clock size={15} className="text-brand-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.draftPosts}</span>
              <span className="text-[11px] font-semibold text-slate-400">em esteira</span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Backlinks</span>
              <LinkIcon size={15} className="text-brand-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.totalLinks}</span>
              <span className="text-[11px] font-semibold text-slate-400">estratégicos</span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 col-span-2 sm:col-span-1 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ciclo Filtrado</span>
              <Calendar size={15} className="text-brand-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-brand-600">{metrics.cyclePosts}</span>
              <span className="text-[11px] font-semibold text-slate-400">
                {selectedCycle ? formatCycleDate(selectedCycle) : 'Todos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros & Navegação de Seções */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Seletor de Seção (Artigos / Backlinks) */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSection('artigos')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'artigos' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText size={14} className={activeSection === 'artigos' ? 'text-brand-600' : ''} />
              Artigos do Blog ({filteredPosts.length})
            </button>
            <button
              onClick={() => setActiveSection('backlinks')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'backlinks' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LinkIcon size={14} className={activeSection === 'backlinks' ? 'text-brand-600' : ''} />
              Backlinks ({filteredBacklinks.length})
            </button>
          </div>

          {/* Busca & Controles de Ciclo */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
            {/* Campo de Busca */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, âncora..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ciclo / Mês Contextual com Seletor Direto */}
            {setSelectedCycle && (
              <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs text-slate-700 shadow-2xs">
                <Calendar size={13} className="text-slate-400 mr-1.5 shrink-0 pointer-events-none" />
                <span className="font-semibold text-[11px] uppercase tracking-wide truncate max-w-[110px]">
                  {selectedCycle ? formatCycleDate(selectedCycle) : 'Todos Meses'}
                </span>
                <input
                  type="month"
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="month-picker-overlay cursor-pointer"
                  title="Alterar ciclo de visualização"
                />
                {selectedCycle && (
                  <button
                    onClick={() => setSelectedCycle('')}
                    className="ml-2 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors z-30"
                    title="Exibir todos os meses"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chips de Status & Categoria (visível na seção de artigos) */}
        {activeSection === 'artigos' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Status:</span>
              {['Todos', 'Publicados', 'Em Produção', 'Rascunhos'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {availableCategories.length > 2 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoria:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SEÇÃO 1: ARTIGOS DO BLOG */}
      {activeSection === 'artigos' && (
        <div>
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FileText size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Nenhum artigo encontrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                {searchQuery || selectedStatus !== 'Todos' || selectedCycle
                  ? 'Nenhum artigo corresponde aos filtros aplicados. Tente limpar os filtros.'
                  : 'Nenhum artigo proprietário cadastrado na esteira da agência ainda.'}
              </p>
              <div className="flex justify-center gap-3">
                {(searchQuery || selectedStatus !== 'Todos' || selectedCycle) && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedStatus('Todos'); setSelectedCategory('Todas'); setSelectedCycle && setSelectedCycle(''); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                )}
                <button
                  onClick={handleOpenNewPost}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={14} /> Criar Artigo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post: any) => {
                const isPublished = post.status === 'Publicado';
                const isDraft = post.status === 'Rascunho';

                return (
                  <motion.div 
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          isPublished
                            ? 'bg-brand-50 text-brand-700 border-brand-200/60'
                            : isDraft
                            ? 'bg-slate-100 text-slate-600 border-slate-200/60'
                            : 'bg-slate-100 text-slate-700 border-slate-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-brand-600' : isDraft ? 'bg-slate-400' : 'bg-brand-500 animate-pulse'}`} />
                          {post.status}
                        </span>

                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                          <Calendar size={11} />
                          <span>{post.targetMonth ? formatCycleDate(post.targetMonth) : 'Sem ciclo'}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {post.description || 'Sem descrição estratégica informada.'}
                      </p>

                      {/* Meta Tags: Categoria & Palavra-chave */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {post.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/50 text-[10px] font-medium">
                            <Tag size={10} className="text-slate-400" />
                            {post.category}
                          </span>
                        )}
                        {post.focusKeywords && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50/60 text-brand-700 border border-brand-100/60 text-[10px] font-semibold truncate max-w-[180px]">
                            {post.focusKeywords}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setPostForm(post); setShowPostForm(true); }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors px-2 py-1 rounded-lg hover:bg-brand-50/50 cursor-pointer"
                          title="Revisar ou editar artigo"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => { if (post.id && confirm(`Excluir permanentemente o artigo "${post.title}"?`)) handleDeletePost(post.id, post.coverImage); }}
                          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Excluir artigo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isPublished && (
                          <button
                            onClick={async () => {
                              if (!post.id) return;
                              const url = window.prompt("URL da publicação final no Blog:", post.publishedUrl || `https://aceleraseo.com.br/blog/${post.slug}`);
                              if (url) {
                                await updateDoc(doc(db, 'blog_posts', post.id), { 
                                  status: 'Publicado', 
                                  publishedUrl: url, 
                                  publishedAt: new Date().toISOString().split('T')[0], 
                                  updatedAt: serverTimestamp() 
                                });
                                loadBlogPosts();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                            title="Marcar como publicado"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <a
                          href={post.publishedUrl || `/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="Visualizar no site"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SEÇÃO 2: BACKLINKS DA AGÊNCIA */}
      {activeSection === 'backlinks' && (
        <div>
          {filteredBacklinks.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <LinkIcon size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Nenhum backlink registrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Cadastre os links e publicações de autoridade direcionados ao domínio da agência.
              </p>
              <button
                onClick={handleOpenNewBacklink}
                className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> Novo Backlink
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBacklinks.map((backlink: any) => {
                const isPublished = backlink.status === 'Publicado';

                return (
                  <motion.div
                    key={backlink.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          isPublished
                            ? 'bg-brand-50 text-brand-700 border-brand-200/60'
                            : 'bg-slate-100 text-slate-600 border-slate-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-brand-600' : 'bg-slate-400'}`} />
                          {backlink.status}
                        </span>

                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                          <Calendar size={11} />
                          <span>{backlink.targetMonth ? formatCycleDate(backlink.targetMonth) : 'Sem ciclo'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-brand-600 transition-colors mb-3 line-clamp-2">
                        {backlink.title}
                      </h3>

                      {/* Anchor Highlight */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Palavra-chave / Âncora:</span>
                        <div className="text-xs font-bold text-slate-800 bg-white border border-slate-200/60 rounded-lg px-2.5 py-1 shadow-2xs truncate">
                          {backlink.focusKeywords || backlink.anchor || 'Não especificada'}
                        </div>
                      </div>

                      {/* Target URL Preview */}
                      {backlink.targetUrl && (
                        <div className="text-[11px] text-slate-400 truncate mb-4 font-mono">
                          Destino: <span className="text-slate-600">{backlink.targetUrl}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors px-2 py-1 rounded-lg hover:bg-brand-50/50 cursor-pointer"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => { if (confirm(`Excluir o backlink "${backlink.title}"?`)) handleDeleteBacklink(backlink.id); }}
                          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {backlink.publishedUrl && (
                        <a
                          href={backlink.publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="Acessar link publicado"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

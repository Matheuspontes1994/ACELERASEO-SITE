import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Search,
  Plus,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Edit3,
  Trash2,
  Globe,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Hash,
  FileText
} from 'lucide-react';
import { Skeleton } from './Skeleton';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  isProtected?: boolean;
  articlesCount?: number;
}

interface CategoriesManagerViewProps {
  categories: CategoryItem[];
  loadingCategories: boolean;
  loadCategories: () => void;
  categoryForm: CategoryItem;
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryItem>>;
  showCategoryForm: boolean;
  setShowCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveCategory: (e: React.FormEvent) => void;
  handleDeleteCategory: (cat: CategoryItem) => void;
  isSaving: boolean;
}

export function CategoriesManagerView({
  categories,
  loadingCategories,
  loadCategories,
  categoryForm,
  setCategoryForm,
  showCategoryForm,
  setShowCategoryForm,
  handleSaveCategory,
  handleDeleteCategory,
  isSaving,
}: CategoriesManagerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'optimized' | 'pending' | 'protected'>('all');

  // Metricas rápidas
  const totalCategories = categories.length;
  const optimizedCount = useMemo(() => {
    return categories.filter(c => !!(c.seoTitle && c.seoDescription)).length;
  }, [categories]);
  const pendingCount = totalCategories - optimizedCount;
  const protectedCount = useMemo(() => {
    return categories.filter(c => c.isProtected).length;
  }, [categories]);

  // Filtragem
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'optimized') return !!(cat.seoTitle && cat.seoDescription);
      if (filterType === 'pending') return !(cat.seoTitle && cat.seoDescription);
      if (filterType === 'protected') return !!cat.isProtected;
      return true;
    });
  }, [categories, searchTerm, filterType]);

  // Auto-slug generator ao digitar nome
  const handleNameChange = (name: string) => {
    const slugAuto = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setCategoryForm(prev => ({
      ...prev,
      name,
      slug: prev.id ? prev.slug : slugAuto,
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Taxonomia & Categorias do Blog</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Estruturação temática de conteúdo, silos de relevância e SEO on-page de categorias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadCategories()}
            disabled={loadingCategories}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
            title="Atualizar Categorias"
          >
            <RefreshCcw size={14} className={loadingCategories ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => {
              setCategoryForm({
                id: '',
                name: '',
                slug: '',
                description: '',
                seoTitle: '',
                seoDescription: '',
                isProtected: false,
              });
              setShowCategoryForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Nova Categoria</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Categorias</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FolderOpen size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{totalCategories}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Silos temáticos ativos
            </p>
          </div>
        </div>

        {/* Card 2: 100% Otimizadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Completo</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{optimizedCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Title & Meta Desc prontos
            </p>
          </div>
        </div>

        {/* Card 3: Pendentes de SEO */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requerem Ajuste</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{pendingCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${pendingCount > 0 ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
              {pendingCount === 0 ? 'Tudo 100% preenchido' : 'Faltam metatags de busca'}
            </p>
          </div>
        </div>

        {/* Card 4: Estruturais / Protegidas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Do Sistema</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Shield size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{protectedCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Categorias base protegidas
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Criação / Edição Integrado com Google Preview */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSaveCategory}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-200/80 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {categoryForm.id ? 'Editar Categoria' : 'Criar Nova Categoria'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Configure a nomenclatura, slug da URL e as metatags para indexação orgânica
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Coluna Esquerda: Estrutura da Categoria */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nome da Categoria <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={categoryForm.name}
                      onChange={e => handleNameChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-brand-500 transition"
                      placeholder="Ex: SEO E-commerce"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Slug da URL <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 select-none">
                        /blog/
                      </span>
                      <input
                        required
                        type="text"
                        value={categoryForm.slug}
                        onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        className="w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none focus:bg-white focus:border-brand-500 transition"
                        placeholder="seo-ecommerce"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Descrição Institucional</label>
                    <textarea
                      rows={3}
                      value={categoryForm.description || ''}
                      onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-brand-500 resize-none transition"
                      placeholder="Resumo estratégico e objetivo editorial dos artigos vinculados a este silo..."
                    />
                  </div>
                </div>

                {/* Coluna Direita: SEO On-Page & Preview do Google */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">SEO Title (Título da Aba)</label>
                      <span className={`text-[11px] font-mono ${((categoryForm.seoTitle || '').length > 60) ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {(categoryForm.seoTitle || '').length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={categoryForm.seoTitle || ''}
                      onChange={e => setCategoryForm({ ...categoryForm, seoTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-brand-500 transition"
                      placeholder="Ex: Artigos e Guias de SEO para E-commerce | Acelera SEO"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">Meta Description (Snippet do Google)</label>
                      <span className={`text-[11px] font-mono ${((categoryForm.seoDescription || '').length > 160) ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {(categoryForm.seoDescription || '').length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={categoryForm.seoDescription || ''}
                      onChange={e => setCategoryForm({ ...categoryForm, seoDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-brand-500 resize-none transition"
                      placeholder="Ex: Aprenda estratégias avançadas de otimização orgânica para lojas virtuais e aumente o tráfego..."
                    />
                  </div>

                  {/* Google SERP Live Preview */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Globe size={12} className="text-brand-600" />
                      <span>Prévia no Google</span>
                    </div>
                    <p className="text-xs font-mono text-emerald-700 truncate">
                      https://aceleraseo.com.br/blog/{categoryForm.slug || 'slug-da-categoria'}
                    </p>
                    <h4 className="text-sm font-semibold text-blue-700 truncate hover:underline cursor-pointer">
                      {categoryForm.seoTitle || categoryForm.name || 'Título da Categoria no Blog'}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {categoryForm.seoDescription ||
                        categoryForm.description ||
                        'Adicione uma meta description otimizada para aumentar o CTR nos resultados de busca.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !categoryForm.name.trim()}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCcw size={14} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>{categoryForm.id ? 'Salvar Alterações' : 'Criar Categoria'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filtros e Busca */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por categoria ou slug..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-500 transition"
            />
          </div>

          {/* Sub-filtros por Status */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                filterType === 'all' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas ({totalCategories})
            </button>
            <button
              onClick={() => setFilterType('optimized')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filterType === 'optimized' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              SEO Pronto ({optimizedCount})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filterType === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Pendente ({pendingCount})
            </button>
            <button
              onClick={() => setFilterType('protected')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filterType === 'protected' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Shield size={11} />
              Protegidas ({protectedCount})
            </button>
          </div>
        </div>

        {/* Tabela de Categorias */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Categoria & Descrição</th>
                <th className="px-5 py-3">Slug Estrutural</th>
                <th className="px-5 py-3 text-center">Status SEO</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loadingCategories ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`skel-cat-${i}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Skeleton variant="circular" className="w-8 h-8 rounded-xl" />
                        <div className="space-y-1.5">
                          <Skeleton variant="rectangular" className="h-4 w-40 rounded" />
                          <Skeleton variant="text" className="w-56" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Skeleton variant="rectangular" className="h-6 w-28 rounded-lg" />
                    </td>
                    <td className="px-5 py-3.5">
                      <Skeleton variant="rectangular" className="h-6 w-20 rounded-full mx-auto" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Skeleton variant="rectangular" className="h-8 w-16 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400">
                    <FolderOpen size={32} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-bold text-slate-600">Nenhuma categoria encontrada</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Tente alterar os filtros ou termo de busca.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map(cat => {
                  const isSeoComplete = !!(cat.seoTitle && cat.seoDescription);

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              cat.isProtected
                                ? 'bg-slate-900 text-white'
                                : 'bg-brand-50 text-brand-600 border border-brand-100'
                            }`}
                          >
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 truncate">{cat.name}</span>
                              {cat.isProtected && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                                  <Shield size={10} />
                                  Protegida
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-md font-medium">
                              {cat.description || 'Sem descrição cadastrada'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <a
                          href={`/blog/${cat.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px] font-medium hover:border-brand-300 hover:text-brand-600 transition"
                          title="Visualizar no Blog"
                        >
                          <span>/blog/{cat.slug}</span>
                          <ExternalLink size={11} className="text-slate-400" />
                        </a>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border">
                          {isSeoComplete ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border-emerald-200 px-2 py-0.5 rounded-md">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              Otimizado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border-amber-200 px-2 py-0.5 rounded-md">
                              <AlertCircle size={12} className="text-amber-600" />
                              Incompleto
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setCategoryForm(cat);
                              setShowCategoryForm(true);
                            }}
                            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition cursor-pointer"
                            title="Editar Categoria"
                          >
                            <Edit3 size={15} />
                          </button>

                          {!cat.isProtected && (
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Excluir Categoria"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

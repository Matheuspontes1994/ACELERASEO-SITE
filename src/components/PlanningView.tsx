import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Search,
  Plus,
  RefreshCcw,
  Sparkles,
  Rocket,
  Edit3,
  Trash2,
  Filter,
  BarChart3,
  TrendingUp,
  Target,
  Layers,
  FileText,
  Link as LinkIcon,
  ChevronDown,
  Building2
} from 'lucide-react';
import { HorizontalScroll } from './HorizontalScroll';
import { Skeleton } from './Skeleton';

interface PlanningViewProps {
  keywordsUniverse: any[];
  loadingKeywords: boolean;
  loadKeywordsUniverse: (force?: boolean) => void;
  selectedCycle: string;
  setSelectedCycle: (cycle: string) => void;
  selectedHubClient: string;
  setSelectedHubClient: (client: string) => void;
  clientsList: string[];
  setKeywordForm: (form: any) => void;
  setShowKeywordForm: (show: boolean) => void;
  handleDeleteKeyword: (id: string) => void;
  promoteKeywordToPost: (keyword: any) => void;
  promoteKeywordToBacklink?: (keyword: any) => void;
  setActiveTab: (tab: string) => void;
}

export function PlanningView({
  keywordsUniverse = [],
  loadingKeywords = false,
  loadKeywordsUniverse,
  selectedCycle,
  setSelectedCycle,
  selectedHubClient,
  setSelectedHubClient,
  clientsList = [],
  setKeywordForm,
  setShowKeywordForm,
  handleDeleteKeyword,
  promoteKeywordToPost,
  promoteKeywordToBacklink,
  setActiveTab
}: PlanningViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Disponível' | 'Planejado' | 'Em Produção'>('todos');
  const [cycleFilter, setCycleFilter] = useState<string>('todos');

  // Available cycles from the data
  const availableCycles = useMemo(() => {
    const cycles = new Set<string>();
    keywordsUniverse.forEach(k => {
      if (k.targetMonth) cycles.add(k.targetMonth);
    });
    return Array.from(cycles).sort().reverse();
  }, [keywordsUniverse]);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return keywordsUniverse.filter(k => {
      // Filter by Client
      if (selectedHubClient && k.clientName !== selectedHubClient) return false;

      // Filter by Cycle
      if (cycleFilter !== 'todos' && k.targetMonth !== cycleFilter) return false;

      // Filter by Status
      if (statusFilter !== 'todos') {
        const kStatus = k.status || 'Disponível';
        if (statusFilter === 'Disponível' && kStatus !== 'Disponível' && kStatus !== 'Planejado') return false;
        if (statusFilter === 'Em Produção' && kStatus !== 'Em Produção') return false;
      }

      // Filter by Search Query
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchKeyword = k.keyword?.toLowerCase().includes(query);
        const matchTheme = k.theme?.toLowerCase().includes(query);
        const matchClient = k.clientName?.toLowerCase().includes(query);
        const matchNotes = k.notes?.toLowerCase().includes(query);
        const matchSecondary = k.secondaryKeywords?.toLowerCase().includes(query);
        if (!matchKeyword && !matchTheme && !matchClient && !matchNotes && !matchSecondary) return false;
      }

      return true;
    });
  }, [keywordsUniverse, selectedHubClient, cycleFilter, statusFilter, searchTerm]);

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = filteredKeywords.length;
    let totalKd = 0;
    let validKdCount = 0;
    let availableCount = 0;
    let inProductionCount = 0;

    filteredKeywords.forEach(k => {
      const kdVal = parseInt(k.difficulty, 10);
      if (!isNaN(kdVal)) {
        totalKd += kdVal;
        validKdCount++;
      }
      const st = k.status || 'Disponível';
      if (st === 'Em Produção') {
        inProductionCount++;
      } else {
        availableCount++;
      }
    });

    const avgKd = validKdCount > 0 ? Math.round(totalKd / validKdCount) : 0;

    return {
      total,
      avgKd,
      availableCount,
      inProductionCount
    };
  }, [filteredKeywords]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 text-left">
      {/* 1. Header do Planejamento */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar size={16} />
            <span>Planejamento Editorial & Pautas</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inteligência de Pautas & Ciclos
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Mapeamento de palavras-chave, volumes, KD e direcionamentos estratégicos por unidade
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadKeywordsUniverse(true)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Recarregar Palavras-chave"
          >
            <RefreshCcw size={15} className={loadingKeywords ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => {
              setKeywordForm({
                id: '',
                keyword: '',
                searchVolume: '',
                difficulty: '',
                clientName: selectedHubClient || '',
                clientEmail: '',
                status: 'Disponível',
                notes: '',
                targetMonth: selectedCycle || new Date().toISOString().slice(0, 7),
                targetWords: '',
                internalLinking: '',
                theme: '',
                secondaryKeywords: ''
              });
              setShowKeywordForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Reservar Tema / Keyword</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs do Planejamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Temas</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{metrics.total}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Palavras e pautas mapeadas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disponíveis</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600">{metrics.availableCount}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Prontas para iniciar produção</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Em Produção</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Rocket size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-600">{metrics.inProductionCount}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Convertidas em artigos ou links</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KD Médio (Dificuldade)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">
              {metrics.avgKd}%
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Dificuldade média de ranqueamento</p>
          </div>
        </div>
      </div>

      {/* 3. Tabela & Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Barra de Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {/* Input de Busca */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar palavra, tema ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <option key={`client-opt-${idx}`} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* Filtro por Ciclo */}
            <div className="relative">
              <select
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
              >
                <option value="todos">Todos os Ciclos</option>
                {availableCycles.map((cyc: string) => (
                  <option key={`cycle-opt-${cyc}`} value={cyc}>Ciclo {cyc}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* Abas de Status */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold self-start lg:self-auto">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos ({filteredKeywords.length})
            </button>
            <button
              onClick={() => setStatusFilter('Disponível')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'Disponível' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Disponíveis
            </button>
            <button
              onClick={() => setStatusFilter('Em Produção')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'Em Produção' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Em Produção
            </button>
          </div>
        </div>

        {/* Tabela de Planejamento */}
        {loadingKeywords ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`skel-pl-${i}`} variant="rectangular" className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredKeywords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Calendar size={32} className="mx-auto text-slate-300 stroke-[1.5]" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum tema encontrado no planejamento</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ajuste os filtros selecionados ou clique em "+ Reservar Tema / Keyword" para iniciar o mapeamento.
            </p>
          </div>
        ) : (
          <HorizontalScroll>
            <table className="w-full text-left min-w-[800px] text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ciclo</th>
                  <th className="py-3 px-4">Unidade</th>
                  <th className="py-3 px-4">Tema / Keyword Estratégica</th>
                  <th className="py-3 px-4 text-center">Volume</th>
                  <th className="py-3 px-4 text-center">Dificuldade (KD)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKeywords.map((kw: any) => {
                  const kd = Number(kw.difficulty || 0);
                  const kdBadge = kd < 30 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  kd < 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <tr key={kw.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {kw.targetMonth || 'Geral'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          {kw.clientName || 'Geral'}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors block truncate">
                          {kw.keyword}
                        </span>
                        {kw.theme && (
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {kw.theme}
                          </p>
                        )}
                        {kw.notes && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {kw.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
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
                            onClick={() => {
                              setActiveTab('Artigos e Conteúdos');
                              setTimeout(() => promoteKeywordToPost(kw), 100);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 rounded-lg text-[11px] font-bold border border-slate-200 transition cursor-pointer shadow-2xs flex items-center gap-1"
                            title="Iniciar Produção de Artigo"
                          >
                            <Rocket size={12} className="text-brand-600" />
                            <span>Produzir</span>
                          </button>

                          <button
                            onClick={() => {
                              setKeywordForm(kw);
                              setShowKeywordForm(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
                            title="Editar Planejamento"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remover o tema "${kw.keyword}" do planejamento?`)) {
                                handleDeleteKeyword(kw.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer border border-transparent hover:border-rose-200"
                            title="Excluir do Planejamento"
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
    </motion.div>
  );
}

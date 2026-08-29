import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Globe2,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Target
} from 'lucide-react';

interface ClientOverviewProps {
  selectedHubClient: string;
  selectedCycle: string;
  clients: any[];
  blogPosts: any[];
  backlinks: any[];
  sidebarWorkspace: string;
  setActiveTab: (tab: string) => void;
  setShowPostForm: (show: boolean) => void;
  setPostForm: (form: any) => void;
  setShowBacklinkForm: (show: boolean) => void;
  setBacklinkForm: (form: any) => void;
}

export function ClientOverview({
  selectedHubClient,
  selectedCycle,
  clients,
  blogPosts,
  backlinks,
  sidebarWorkspace,
  setActiveTab,
  setShowPostForm,
  setPostForm,
  setShowBacklinkForm,
  setBacklinkForm,
}: ClientOverviewProps) {
  // Filtragem dos dados de acordo com o workspace ou cliente selecionado
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (selectedHubClient) return c.name === selectedHubClient;
      if (sidebarWorkspace === 'agencia') return c.name === 'Agência';
      if (sidebarWorkspace === 'clientes') return c.name !== 'Agência';
      return true;
    });
  }, [clients, selectedHubClient, sidebarWorkspace]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(p => {
      if (selectedHubClient) return p.clientName === selectedHubClient;
      if (sidebarWorkspace === 'agencia') return p.clientName === 'Agência';
      if (sidebarWorkspace === 'clientes') return p.clientName !== 'Agência';
      return true;
    });
  }, [blogPosts, selectedHubClient, sidebarWorkspace]);

  const filteredBacklinks = useMemo(() => {
    return backlinks.filter(b => {
      if (selectedHubClient) return b.clientName === selectedHubClient;
      if (sidebarWorkspace === 'agencia') return b.clientName === 'Agência';
      if (sidebarWorkspace === 'clientes') return b.clientName !== 'Agência';
      return true;
    });
  }, [backlinks, selectedHubClient, sidebarWorkspace]);

  // Metricas de Conteudo
  const totalMetaPosts = useMemo(() => {
    return filteredClients.reduce(
      (acc, c) => acc + (Number(c.monthlyPosts || 0) + Number(c.extraPosts || 0)),
      0
    );
  }, [filteredClients]);

  const postsInCycle = useMemo(() => {
    return filteredPosts.filter(p => p.targetMonth === selectedCycle);
  }, [filteredPosts, selectedCycle]);

  const totalDeliveredPosts = useMemo(() => {
    return postsInCycle.filter(p => p.status === 'Publicado').length;
  }, [postsInCycle]);

  const totalWaitingApproval = useMemo(() => {
    return postsInCycle.filter(p => p.status === 'Aguardando Aprovação').length;
  }, [postsInCycle]);

  const totalInProductionPosts = useMemo(() => {
    return postsInCycle.filter(
      p => p.status === 'Rascunho' || p.status === 'RascunhoInterno' || p.status === 'Em Produção'
    ).length;
  }, [postsInCycle]);

  const postPercent = totalMetaPosts > 0 ? Math.min(100, Math.round((totalDeliveredPosts / totalMetaPosts) * 100)) : 0;

  // Metricas de Backlinks
  const totalMetaLinks = useMemo(() => {
    return filteredClients.reduce(
      (acc, c) => acc + (Number(c.monthlyBacklinks || 0) + Number(c.extraBacklinks || 0)),
      0
    );
  }, [filteredClients]);

  const linksInCycle = useMemo(() => {
    return filteredBacklinks.filter(b => b.targetMonth === selectedCycle);
  }, [filteredBacklinks, selectedCycle]);

  const totalDeliveredLinks = useMemo(() => {
    return linksInCycle.filter(b => b.status === 'Publicado').length;
  }, [linksInCycle]);

  const totalPendingLinks = useMemo(() => {
    return linksInCycle.filter(b => b.status !== 'Publicado').length;
  }, [linksInCycle]);

  const linkPercent = totalMetaLinks > 0 ? Math.min(100, Math.round((totalDeliveredLinks / totalMetaLinks) * 100)) : 0;

  // Saúde Geral da Entrega
  const totalMetaGeneral = totalMetaPosts + totalMetaLinks;
  const totalDeliveredGeneral = totalDeliveredPosts + totalDeliveredLinks;
  const generalProgress = totalMetaGeneral > 0 ? Math.min(100, Math.round((totalDeliveredGeneral / totalMetaGeneral) * 100)) : 0;

  // Pautas com atenção imediata (Aguardando Aprovação)
  const urgentPosts = useMemo(() => {
    return postsInCycle
      .filter(p => p.status === 'Aguardando Aprovação')
      .slice(0, 3);
  }, [postsInCycle]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16 text-left">
      {/* 1. Header do Ciclo Operacional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
            <Target size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedHubClient ? `Visão Geral — ${selectedHubClient}` : 'Visão Geral das Operações'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                Ciclo {selectedCycle}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Acompanhamento integrado de produção on-page, autoridade off-page e status de entregáveis
            </p>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setShowPostForm(true);
              setPostForm({
                id: '',
                title: '',
                clientName: selectedHubClient,
                clientEmail: '',
                targetMonth: selectedCycle,
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
                status: 'Planejado',
                publishedAt: '',
                publishedUrl: '',
                internalLinking: '',
                theme: '',
                secondaryKeywords: '',
                directioning: '',
                clientComment: '',
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileText size={14} />
            <span>Nova Pauta</span>
          </button>

          <button
            onClick={() => {
              setShowBacklinkForm(true);
              setBacklinkForm({
                id: '',
                title: '',
                clientName: selectedHubClient,
                clientEmail: '',
                targetMonth: selectedCycle,
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
                targetWords: '',
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <LinkIcon size={14} />
            <span>Novo Backlink</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Superior de 4 KPIs Harmonizados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conteúdo On-Page */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conteúdo On-Page</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {totalDeliveredPosts}
                <span className="text-xs font-semibold text-slate-400 ml-1">/ {totalMetaPosts} posts</span>
              </h3>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                {postPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${postPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Backlinks Off-Page */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ativos Off-Page</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <LinkIcon size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {totalDeliveredLinks}
                <span className="text-xs font-semibold text-slate-400 ml-1">/ {totalMetaLinks} links</span>
              </h3>
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                {linkPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${linkPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Backlog & Pendências */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aguardando Aprovação</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{totalWaitingApproval}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  totalWaitingApproval > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500'
                }`}
              >
                {totalWaitingApproval > 0 ? 'Ação Necessária' : 'Em Dia'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${totalWaitingApproval > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {totalWaitingApproval > 0 ? `${totalWaitingApproval} artigos aguardando validação` : 'Nenhum bloqueio detectado'}
            </p>
          </div>
        </div>

        {/* Card 4: Conclusão Geral do Ciclo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saúde do Ciclo</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {generalProgress}%
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {totalDeliveredGeneral}/{totalMetaGeneral} entregues
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${generalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Seções Operacionais (Status de Produção & Pautas em Destaque) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Status Detalhado de Produção & Autoridade */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Status Operacional do Ciclo</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Distribuição de artigos e backlinks por fase de execução
                </p>
              </div>
              <button
                onClick={() => setActiveTab('Artigos e Conteúdos')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Ver todos os artigos</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box Conteúdo */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-white text-brand-600 flex items-center justify-center shadow-2xs border border-slate-200/60">
                    <FileText size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Artigos On-Page</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Meta: {totalMetaPosts} publicações</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      label: 'Publicados',
                      count: totalDeliveredPosts,
                      color: 'bg-emerald-500',
                      badge: 'text-emerald-700 bg-emerald-50',
                    },
                    {
                      label: 'Aguardando Aprovação',
                      count: totalWaitingApproval,
                      color: 'bg-amber-500',
                      badge: 'text-amber-700 bg-amber-50',
                    },
                    {
                      label: 'Em Produção / Rascunho',
                      count: totalInProductionPosts,
                      color: 'bg-brand-500',
                      badge: 'text-brand-700 bg-brand-50',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-slate-600 font-medium">{item.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${item.badge}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box Backlinks */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-white text-violet-600 flex items-center justify-center shadow-2xs border border-slate-200/60">
                    <LinkIcon size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Autoridade Off-Page</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Meta: {totalMetaLinks} backlinks</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      label: 'Ativos / Concluídos',
                      count: totalDeliveredLinks,
                      color: 'bg-emerald-500',
                      badge: 'text-emerald-700 bg-emerald-50',
                    },
                    {
                      label: 'Em Prospecção / Negociação',
                      count: totalPendingLinks,
                      color: 'bg-amber-500',
                      badge: 'text-amber-700 bg-amber-50',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-slate-600 font-medium">{item.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${item.badge}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              Taxa de cumprimento do ciclo atual: <strong className="text-slate-900 font-bold">{generalProgress}%</strong>
            </span>
            <button
              onClick={() => setActiveTab('Planejamento')}
              className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Abrir Cronograma</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Coluna 3: Pautas que Requerem Atenção */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle size={14} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Atenção Prioritária</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {urgentPosts.length} itens
              </span>
            </div>

            {urgentPosts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <ShieldCheck size={28} className="mx-auto text-emerald-500 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-700">Tudo em dia!</p>
                <p className="text-[11px] text-slate-400">
                  Nenhuma pauta aguardando aprovação pendente neste momento.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentPosts.map((post, idx) => (
                  <div
                    key={post.id || idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Aguardando Aprovação
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{post.clientName || 'Geral'}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">{post.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Palavra-chave: {post.focusKeywords || 'Não definida'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('Artigos e Conteúdos')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Revisar Artigos & Entregáveis</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Central de Acessos Rápidos do Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Acessos Rápidos Operacionais</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Navegue pelos módulos estratégicos do cliente de forma direta
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('Planejamento')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
          >
            <Calendar size={14} className="text-slate-500" />
            <span>Cronograma</span>
          </button>

          <button
            onClick={() => setActiveTab('Monitoramento de Rankings')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
          >
            <Globe2 size={14} className="text-slate-500" />
            <span>Rankings Google</span>
          </button>

          <button
            onClick={() => setActiveTab('Palavras-chave')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
          >
            <Sparkles size={14} className="text-slate-500" />
            <span>Palavras-chave</span>
          </button>

          <button
            onClick={() => setActiveTab('Artigos e Conteúdos')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold border border-brand-200 transition cursor-pointer"
          >
            <FileText size={14} className="text-brand-600" />
            <span>Ver Artigos</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import {
  ArrowUpRight,
  CheckCircle,
  Plus,
  Search,
  Trash2,
  Edit2,
  Users,
  LogOut,
  FileText,
  ChevronDown,
  X
} from "lucide-react";
import { HorizontalScroll } from "./HorizontalScroll";

export function HubClients({
  clientsList,
  clients = [],
  selectedHubClient,
  setSelectedHubClient,
  keywordsUniverse,
  showKeywordForm,
  setShowKeywordForm,
  keywordForm,
  setKeywordForm,
  handleSaveKeyword,
  handleDeleteKeyword,
  blogPosts,
  backlinks,
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
}: any) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFabOpen, setIsFabOpen] = React.useState(false);

  const realClients = clientsList
    .filter((c: string) => c !== "Agência")
    .filter((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const clientKeywords = keywordsUniverse.filter(
    (k: any) => k.clientName === selectedHubClient,
  );

  const selectedHubClientData = clients.find((c: any) => c.name === selectedHubClient);

  const clientPosts = blogPosts.filter(
    (p: any) => p.clientName === selectedHubClient,
  );
  const clientBacklinks = backlinks.filter(
    (b: any) => b.clientName === selectedHubClient,
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12 pb-32"
    >
      {!selectedHubClient ? (
        <div className="bg-white border border-slate-100 p-20 rounded-[40px] shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none text-slate-900">
            <Users size={320} />
          </div>
          <div className="relative z-10 max-w-lg mx-auto">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-sm">
                <Search size={32} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
               Selecione uma <span className="text-brand-600">Unidade de Performance</span>
             </h2>
             <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
               A inteligência de SEO, as células de conteúdo e os ativos de backlinks agora são gerenciados por unidade. Selecione o cliente no menu lateral para ativar o ecossistema de performance.
             </p>
             
             <div className="inline-flex items-center gap-3 px-6 py-4 bg-brand-50 text-brand-700 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-brand-100/50 shadow-sm">
                <Users size={14} /> Selecione no Menu Lateral
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 p-8 lg:p-12 rounded-[40px] shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16 pb-10 border-b border-slate-50">
            <div className="relative group/switcher">
              <div className="flex items-center gap-3 mb-4 text-brand-600">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Ambiente de Controle Ativo</span>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap max-w-full">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-none break-words max-w-[calc(100vw-80px)] lg:max-w-full">
                  {selectedHubClient}
                </h2>
                
                <div className="relative">
                  <select 
                    value={selectedHubClient}
                    onChange={(e) => setSelectedHubClient(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  >
                    {clientsList.filter((c:string) => c !== 'Agência').map((c:string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/switcher:bg-brand-600 group-hover/switcher:text-white transition-all shadow-sm">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-20">
            {/* Resumo do Cliente */}
            {selectedHubClientData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all flex flex-col justify-center min-h-[140px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-tight">Investimento Mensal</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight break-words" title={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedHubClientData.packageValue || 0)}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedHubClientData.packageValue || 0)}
                  </h4>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all flex flex-col justify-center min-h-[140px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-tight">Posts Contratados</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors tracking-tight leading-tight">
                    {selectedHubClientData.monthlyPosts || 0} <span className="text-[10px] text-slate-400 block sm:inline font-bold whitespace-nowrap">pautas/mês</span>
                  </h4>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all flex flex-col justify-center min-h-[140px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-tight">Links Estratégicos</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-500 transition-colors tracking-tight leading-tight">
                    {selectedHubClientData.monthlyBacklinks || 0} <span className="text-[10px] text-slate-400 block sm:inline font-bold whitespace-nowrap">backlinks/mês</span>
                  </h4>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all flex flex-col justify-center min-h-[140px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-tight">SLA Aprovação</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-500 transition-colors tracking-tight leading-tight">
                    {selectedHubClientData.approvalDeadlineDays || 5} <span className="text-[10px] text-slate-400 block sm:inline font-bold whitespace-nowrap">dias úteis</span>
                  </h4>
                </div>
              </div>
            )}

            {/* Universo de Palavras */}
            <div className="bg-slate-50/50 border border-slate-100 p-8 lg:p-12 rounded-[32px]">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-10 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Universo de Keywords
                  </h3>
                  <p className="text-slate-400 font-medium tracking-tight text-base">
                    Inteligência de mercado e mapeamento de janelas de oportunidade.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setKeywordForm({
                      id: "",
                      clientName: selectedHubClient,
                      clientEmail: "",
                      keyword: "",
                      searchVolume: "",
                      difficulty: "",
                      status: "Disponível",
                      notes: "",
                      targetMonth: "",
                      internalLinking: "",
                      theme: "",
                      secondaryKeywords: ""
                    });
                    setShowKeywordForm(true);
                  }}
                  className="bg-white border border-slate-200 text-slate-900 text-[10px] font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                   Injetar Inteligência SEO
                </button>
              </div>

              <div className="hidden md:block">
                <HorizontalScroll>
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <th className="py-6 px-8">Ciclo / Ref.</th>
                        <th className="py-6 px-8">Keyword Estratégica</th>
                        <th className="py-6 px-8 text-center text-slate-300">Inteligência de Volume</th>
                        <th className="py-6 px-8 text-center text-slate-300">Status</th>
                        <th className="py-6 px-8 text-right">Acionáveis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-slate-50/20">
                      {clientKeywords
                        .sort((a: any, b: any) => (b.targetMonth || "").localeCompare(a.targetMonth || ""))
                        .map((kw: any) => (
                          <tr key={kw.id} className="group hover:bg-white transition-all duration-500">
                            <td className="py-8 px-8">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                                {kw.targetMonth || "-"}
                              </span>
                            </td>
                            <td className="py-8 px-8">
                              <p className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors uppercase leading-none">
                                {kw.keyword}
                              </p>
                            </td>
                            <td className="py-8 px-8">
                              <div className="flex items-center justify-center gap-6">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] italic opacity-60">{kw.searchVolume || "0 Vol"}</span>
                                <div className="w-1.5 h-1.5 rounded-full shadow-lg border border-white bg-brand-500"></div>
                                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.1em] bg-brand-50 px-4 py-2 rounded-lg border border-brand-100/50 shadow-sm">{kw.difficulty || "0"} KD</span>
                              </div>
                            </td>
                            <td className="py-8 px-8 text-center">
                              <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg border ${
                                kw.status === 'Em Produção' 
                                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                {kw.status || 'Disponível'}
                              </span>
                            </td>
                            <td className="py-8 px-8 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button
                                  onClick={() => promoteKeywordToPost(kw)}
                                  className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.1em] h-10 px-6 rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-slate-200"
                                >
                                  Nova Pauta
                                </button>
                                <button
                                  onClick={() => promoteKeywordToBacklink(kw)}
                                  className="bg-white border border-slate-100 text-slate-900 text-[9px] font-bold uppercase tracking-[0.1em] h-10 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                >
                                  Novo Link
                                </button>
                                <button onClick={() => { if(confirm('Remover keyword?')) handleDeleteKeyword(kw.id); }} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-200 hover:text-rose-500 hover:shadow-xl transition-all shadow-sm">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {clientKeywords.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-24 text-center text-[10px] font-bold text-slate-200 uppercase tracking-[0.2em] italic">
                            Oceano de oportunidades vazio p/ esta unidade.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </HorizontalScroll>
              </div>

              {/* Mobile Card View for Keywords */}
              <div className="md:hidden space-y-4">
                {clientKeywords
                  .sort((a: any, b: any) => (b.targetMonth || "").localeCompare(a.targetMonth || ""))
                  .map((kw: any) => (
                    <div key={`kw-card-${kw.id}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {kw.targetMonth || "-"}
                        </span>
                        <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg border ${
                          kw.status === 'Em Produção' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {kw.status || 'Disponível'}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-lg font-black text-slate-900 tracking-tight uppercase leading-tight mb-2">
                          {kw.keyword}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] italic">{kw.searchVolume || "0 Vol"}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.1em]">{kw.difficulty || "0"} KD</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-50">
                        <button
                          onClick={() => promoteKeywordToPost(kw)}
                          className="flex-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.1em] py-3 rounded-xl active:scale-95 transition-all"
                        >
                          Pauta
                        </button>
                        <button
                          onClick={() => promoteKeywordToBacklink(kw)}
                          className="flex-1 bg-white border border-slate-200 text-slate-900 text-[9px] font-bold uppercase tracking-[0.1em] py-3 rounded-xl active:scale-95 transition-all"
                        >
                          Link
                        </button>
                        <button 
                          onClick={() => { if(confirm('Remover keyword?')) handleDeleteKeyword(kw.id); }} 
                          className="w-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                {clientKeywords.length === 0 && (
                  <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[32px]">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em]">Oceano de oportunidades vazio</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de Produção */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Artigos */}
              <div className="bg-slate-50/70 border border-slate-100 p-8 lg:p-12 rounded-[32px]">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100 transition-transform duration-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Célula de Conteúdo
                    </h3>
                    <div className="flex items-center gap-2 text-brand-600 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Ativos de Atração & Autoridade</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {clientPosts.length === 0 && (
                    <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[24px]">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em]">Sem artigos no pipeline de produção</p>
                    </div>
                  )}
                  {clientPosts.map((post: any) => (
                    <motion.div
                      key={`hub-post-${post.id}`}
                      whileHover={{ y: -4 }}
                      className="group bg-white border border-slate-100 p-8 rounded-[24px] hover:shadow-xl transition-all duration-500 overflow-hidden relative"
                    >
                      <div className="absolute -top-10 -right-10 p-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-700 pointer-events-none group-hover:opacity-[0.05] text-slate-900">
                        <FileText size={200} />
                      </div>
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] border flex items-center gap-2 ${
                            post.status === "Publicado" ? "bg-emerald-50 text-emerald-500 border-emerald-100/50" : 
                            "bg-brand-50 text-brand-600 border-brand-100/50"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Publicado' ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'}`}></div>
                          {post.status}
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em] italic pr-2">
                          {post.targetMonth || 'Fluxo'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-brand-600 transition-colors relative z-10 uppercase h-[2.4em] line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-8 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                        Meta: <span className="text-slate-900">{post.focusKeywords || "-"}</span>
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-5 relative z-10">
                        <div className="flex gap-6">
                          <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-900 transition-colors">REVISAR</button>
                          <button onClick={() => { if(confirm('Remover?')) handleDeletePost(post.id, post.coverImage); }} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-200 hover:text-rose-500 transition-colors">EXCLUIR</button>
                        </div>
                        {["Aprovado", "Aprovado com Ressalvas", "Rascunho", "Planejado"].includes(post.status) && (
                          <button
                            onClick={async () => {
                              const url = window.prompt("URL Final de Publicação:");
                              if (url) {
                                await updateDoc(doc(db, "blog_posts", post.id), {
                                    status: "Publicado",
                                    publishedUrl: url,
                                    publishedAt: new Date().toISOString().split("T")[0],
                                    updatedAt: serverTimestamp(),
                                });
                                loadBlogPosts();
                              }
                            }}
                            className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.1em] px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all shadow-lg active:scale-90"
                          >
                            Finalizar
                          </button>
                        )}
                        {post.status === 'Publicado' && post.publishedUrl && (
                          <a href={post.publishedUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-brand-600 rounded-xl border border-slate-100 transition-all active:scale-90">
                             <ArrowUpRight size={18} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Backlinks */}
              <div className="bg-slate-50/70 border border-slate-100 p-8 lg:p-12 rounded-[32px]">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100 transition-transform duration-500">
                    <ArrowUpRight size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Célula de Autoridade
                    </h3>
                    <div className="flex items-center gap-2 text-violet-600 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Links Estratégicos & Mentions</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {clientBacklinks.length === 0 && (
                    <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[24px]">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em]">Nenhuma estratégia off-page ativa</p>
                    </div>
                  )}
                  {clientBacklinks.map((backlink: any) => (
                    <motion.div
                      key={`hub-backlink-${backlink.id}`}
                      whileHover={{ y: -4 }}
                      className="group bg-white border border-slate-100 p-8 rounded-[24px] hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] border flex items-center gap-2 ${
                          backlink.status === 'Publicado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' : 
                          'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${backlink.status === 'Publicado' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          {backlink.status}
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em] italic pr-2 uppercase">
                          {backlink.targetMonth || 'META'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-violet-600 transition-colors uppercase h-[2.4em] line-clamp-2 relative z-10">
                        {backlink.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-8 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity uppercase">
                        Âncora: <span className="text-slate-900">{backlink.anchor || backlink.focusKeywords || "-"}</span>
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-5 relative z-10">
                        <div className="flex gap-6">
                          <button onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-900 transition-colors uppercase">AJUSTAR</button>
                          <button onClick={() => { if(confirm('Remover?')) handleDeleteBacklink(backlink.id); }} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-200 hover:text-rose-500 transition-colors uppercase">EXCLUIR</button>
                        </div>
                        {["Aprovado", "Rascunho", "Planejado"].includes(backlink.status) && (
                          <button
                            onClick={async () => {
                              const url = window.prompt("URL do Backlink Ativo:");
                              if (url) {
                                await updateDoc(doc(db, "backlinks", backlink.id), {
                                    status: "Publicado",
                                    publishedUrl: url,
                                    publishedAt: new Date().toISOString().split("T")[0],
                                    updatedAt: serverTimestamp(),
                                });
                                loadBacklinks();
                              }
                            }}
                            className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.1em] px-6 py-3 rounded-lg hover:bg-violet-600 transition-all shadow-xl active:scale-90"
                          >
                            Validar
                          </button>
                        )}
                        {backlink.status === 'Publicado' && backlink.publishedUrl && (
                          <a href={backlink.publishedUrl} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-violet-600 rounded-xl border border-slate-100 transition-all active:scale-90">
                             <ArrowUpRight size={18} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedHubClient && (
        <div className="fixed bottom-12 right-12 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {isFabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                className="flex flex-col gap-2 items-end mb-2"
              >
                <button 
                  onClick={() => {
                    setPostForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: new Date().toISOString().slice(0, 7), slug: '', description: '', content: '', coverImage: '', category: 'Geral', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'RascunhoInterno', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
                    setShowPostForm(true);
                    setIsFabOpen(false);
                  }}
                  className="bg-white border border-slate-100 px-6 py-4 rounded-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 group"
                >
                  <FileText size={14} className="text-brand-500 group-hover:text-white" /> Artigo
                </button>
                <button 
                   onClick={() => {
                     setBacklinkForm({ id: '', title: '', clientName: selectedHubClient, clientEmail: '', targetMonth: new Date().toISOString().slice(0, 7), focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Pendente', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
                     setShowBacklinkForm(true);
                     setIsFabOpen(false);
                   }}
                   className="bg-white border border-slate-100 px-6 py-4 rounded-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 group"
                >
                  <ArrowUpRight size={14} className="text-violet-500 group-hover:text-white" /> Link
                </button>
                <button 
                  onClick={() => {
                    setKeywordForm({ id: "", clientName: selectedHubClient, clientEmail: "", keyword: "", searchVolume: "", difficulty: "", status: "Disponível", notes: "", targetMonth: "" });
                    setShowKeywordForm(true);
                    setIsFabOpen(false);
                  }}
                  className="bg-white border border-slate-100 px-6 py-4 rounded-xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 group"
                >
                  <Plus size={14} className="text-emerald-500 group-hover:text-white" /> Palavra
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl hover:bg-brand-600 transition-all cursor-pointer group active:scale-90 ${isFabOpen ? 'rotate-0' : 'rotate-45'}`}
          >
             {isFabOpen ? <X size={24} /> : <Plus size={24} className="-rotate-45 group-hover:rotate-0 transition-transform" />}
          </button>
        </div>
      )}
    </motion.div>
  );
}

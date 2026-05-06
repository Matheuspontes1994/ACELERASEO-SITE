import React from "react";
import { motion } from "motion/react";
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
  FileText
} from "lucide-react";
import { HorizontalScroll } from "./HorizontalScroll";

export function HubClients({
  clientsList,
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
}: any) {
  const realClients = clientsList.filter((c: string) => c !== "Agência");

  const clientKeywords = keywordsUniverse.filter(
    (k: any) => k.clientName === selectedHubClient,
  );
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
      className="space-y-10"
    >
      {!selectedHubClient ? (
        <div className="bg-white border border-slate-200 p-10 lg:p-16 rounded-[3rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-brand-600">
            <Users size={320} />
          </div>
          <div className="mb-16 relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500"></div>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Strategic Operations</p>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Hub de <span className="text-brand-600">Performance</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              Gestão tática de pautas, ativos de conteúdo e inteligência de backlinks por parceiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
            {realClients.map((clientName: string, i: number) => (
              <motion.button
                key={`${clientName}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedHubClient(clientName)}
                className="group p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-left hover:bg-slate-900 transition-all duration-500 shadow-sm relative overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-8 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl group-hover:text-white transition-colors tracking-tight line-clamp-2 leading-tight uppercase mb-6">
                    {clientName}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 group-hover:text-brand-500 uppercase tracking-[0.2em] transition-colors">
                      Comandar Fluxo
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-slate-300 group-hover:text-white transition-all"
                    />
                  </div>
                </div>
              </motion.button>
            ))}
            {realClients.length === 0 && (
              <div className="col-span-full border border-dashed border-slate-200 rounded-[2.5rem] py-24 text-center bg-slate-50/50">
                <Users size={48} className="mx-auto mb-6 text-slate-200" />
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                  Agência Operando Sem Clientes Ativos
                </h3>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 lg:p-12 rounded-[3.5rem] shadow-sm">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-16 pb-10 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Centro de Inteligência Tática
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {selectedHubClient}
              </h2>
            </div>
            <button
              onClick={() => setSelectedHubClient("")}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-5 rounded-2xl hover:bg-brand-600 transition-all shadow-xl"
            >
              <LogOut className="rotate-180" size={14} /> Encerrar Sessão
            </button>
          </div>

          <div className="space-y-20">
            {/* Universo de Palavras */}
            <div className="bg-slate-50/50 border border-slate-200 p-8 lg:p-10 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                    Universo de Palavras
                  </h3>
                  <p className="text-slate-500 font-medium tracking-tight">
                    Mapeamento de janelas de oportunidade e pilares de autoridade.
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
                    });
                    setShowKeywordForm(true);
                  }}
                  className="bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={16} className="inline mr-2" /> Injetar Keyword
                </button>
              </div>

              {showKeywordForm && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleSaveKeyword}
                  className="bg-white border border-slate-200 p-8 lg:p-10 rounded-[2rem] mb-12 shadow-xl shadow-slate-200/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Keyword Principal</label>
                      <input
                        required
                        type="text"
                        value={keywordForm.keyword}
                        onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                        className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                        placeholder="Ex: Consultoria de SEO Digital"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mês de Ataque</label>
                      <input
                        required
                        type="month"
                        value={keywordForm.targetMonth}
                        onChange={(e) => setKeywordForm({ ...keywordForm, targetMonth: e.target.value })}
                        className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vol. Previsto</label>
                      <input
                        type="text"
                        value={keywordForm.searchVolume}
                        onChange={(e) => setKeywordForm({ ...keywordForm, searchVolume: e.target.value })}
                        className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                        placeholder="Ex: 50k/mês"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <button type="button" onClick={() => setShowKeywordForm(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors px-6 py-4">Descartar</button>
                    <button type="submit" className="bg-slate-900 text-white font-black px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-colors shadow-lg">Salvar na Estratégia</button>
                  </div>
                </motion.form>
              )}

              <HorizontalScroll>
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Ciclo</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4">Target Keyword</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-center">Data Insight</th>
                      <th className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6 px-4 text-right">Direcionamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {clientKeywords
                      .sort((a: any, b: any) => (b.targetMonth || "").localeCompare(a.targetMonth || ""))
                      .map((kw: any) => (
                        <tr key={kw.id} className="group hover:bg-white transition-colors">
                          <td className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            {kw.targetMonth || "-"}
                          </td>
                          <td className="py-6 px-4">
                            <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                              {kw.keyword}
                            </p>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex items-center justify-center gap-4">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{kw.searchVolume || "0 Vol"}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{kw.difficulty || "0"} KD</span>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setPostForm({ /* ... reset */ });
                                  setPostForm(prev => ({ ...prev, clientName: selectedHubClient, targetMonth: kw.targetMonth || "", focusKeywords: kw.keyword, targetWords: kw.targetWords || "", status: "Rascunho" }));
                                  setShowPostForm(true);
                                }}
                                className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-lg hover:bg-brand-600 transition-all"
                              >
                                Artigo
                              </button>
                              <button
                                onClick={() => {
                                  setBacklinkForm({ /* ... reset */ });
                                  setBacklinkForm(prev => ({ ...prev, clientName: selectedHubClient, targetMonth: kw.targetMonth || "", focusKeywords: kw.keyword, anchor: kw.keyword, status: "Rascunho" }));
                                  setShowBacklinkForm(true);
                                }}
                                className="bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-lg hover:bg-slate-50 transition-all"
                              >
                                Link
                              </button>
                              <button onClick={() => handleDeleteKeyword(kw.id)} className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </HorizontalScroll>
            </div>

            {/* Grid de Produção */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Artigos */}
              <div className="bg-slate-50 border border-slate-200 p-8 lg:p-10 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                    <FileText size={22} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Fluxo de Artigos
                  </h3>
                </div>

                <div className="space-y-4">
                  {clientPosts.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pipeline de Conteúdo Vazio</p>
                    </div>
                  )}
                  {clientPosts.map((post: any, idx: number) => (
                    <motion.div
                      key={`hub-post-${post.id || idx}`}
                      className="group bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${post.status === "Publicado" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-brand-50 text-brand-600 border-brand-100"}`}>
                          {post.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {post.targetMonth}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8 italic">
                        Target: {post.focusKeywords || "-"}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex gap-4">
                          <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-600 transition-colors">Editar pauta</button>
                          <button onClick={() => handleDeletePost(post.id, post.coverImage)} className="text-[10px] font-black uppercase tracking-widest text-slate-200 hover:text-rose-500 transition-colors">Remover</button>
                        </div>
                        {["Aprovado", "Aprovado com Ressalvas", "Rascunho"].includes(post.status) && (
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
                            className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-brand-600 transition-all"
                          >
                            Publicar Artigo
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Backlinks */}
              <div className="bg-slate-50 border border-slate-200 p-8 lg:p-10 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                    <ArrowUpRight size={22} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Fluxo de Backlinks
                  </h3>
                </div>

                <div className="space-y-4">
                  {clientBacklinks.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fila de Backlinks Limpa</p>
                    </div>
                  )}
                  {clientBacklinks.map((backlink: any, idx: number) => (
                    <motion.div
                      key={`hub-backlink-${backlink.id || idx}`}
                      className="group bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${backlink.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {backlink.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {backlink.targetMonth}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase font-display line-clamp-1">
                        {backlink.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 italic mb-8">
                        Âncora: {backlink.anchor || backlink.focusKeywords || "-"}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex gap-4">
                          <button onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-600 transition-colors">Editar</button>
                          <button onClick={() => handleDeleteBacklink(backlink.id)} className="text-[10px] font-black uppercase tracking-widest text-slate-200 hover:text-rose-500 transition-colors">Excluir</button>
                        </div>
                        {["Aprovado", "Rascunho"].includes(backlink.status) && (
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
                            className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Ativar Link
                          </button>
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
    </motion.div>
  );
}

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
} from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {!selectedHubClient ? (
        <div className="bg-white border border-slate-200 p-8 sm:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-brand-600">
            <Users size={320} />
          </div>
          <div className="mb-16 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-10 h-px bg-brand-500"></span>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Gestão de Conteúdo</p>
            </div>
            <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-none">
              Hub de <span className="text-brand-600">Estratégia</span>
            </h2>
            <p className="text-slate-500 mt-4 font-medium text-lg max-w-xl leading-relaxed text-justify md:text-left">
              Selecione o fluxo de trabalho de um cliente para gerenciar pautas, artigos e backlinks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
            {realClients.map((clientName: string, i: number) => (
              <motion.button
                key={`${clientName}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)"
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedHubClient(clientName)}
                className="group p-6 sm:p-10 bg-white border border-slate-100 rounded-3xl sm:rounded-[3rem] text-left hover:border-brand-300 transition-all duration-500 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all duration-500 border border-slate-100 group-hover:border-brand-200">
                    <Users size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl group-hover:text-brand-600 transition-colors tracking-tight line-clamp-2 leading-tight uppercase font-display border-b border-transparent group-hover:border-brand-100 pb-2">
                    {clientName}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="text-[9px] font-black text-slate-300 group-hover:text-brand-500 uppercase tracking-[0.2em] transition-colors">
                      Gerenciar Fluxo
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-slate-200 group-hover:text-brand-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </div>
                </div>
              </motion.button>
            ))}
            {realClients.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-slate-100 rounded-3xl sm:rounded-[3rem] py-24 text-center bg-slate-50/30">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-100 mx-auto mb-6 shadow-sm">
                  <Users size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">
                  Nenhum cliente ativo
                </h3>
                <p className="text-slate-400 mt-2 font-medium">
                  Ative marcas no CRM para iniciar o planejamento editorial.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-6 sm:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-100/50">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-16 pb-10 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-100">
                  Modo de Planejamento Ativo
                </span>
              </div>
              <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-none uppercase">
                {selectedHubClient}
              </h2>
            </div>
            <button
              onClick={() => setSelectedHubClient("")}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 px-6 py-4 rounded-2xl transition-all border border-slate-200 active:scale-95 shadow-sm"
            >
              <LogOut className="rotate-180" size={14} /> Trocar Especialização
            </button>
          </div>

          <div className="space-y-20">
            {/* Universo de Palavras */}
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display uppercase tracking-tight">
                    Universo de Palavras-chave
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium italic leading-relaxed">
                    Mapeamento de janelas de oportunidade para este cliente.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  className="bg-brand-500 text-slate-900 font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                >
                  <Plus size={18} /> Injetar Palavra
                </motion.button>
              </div>

              {showKeywordForm && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSaveKeyword}
                  className="bg-slate-100 border border-slate-200 p-8 rounded-3xl mb-12 flex flex-col gap-8 shadow-inner"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Palavra Principal
                      </label>
                      <input
                        required
                        type="text"
                        value={keywordForm.keyword}
                        onChange={(e) =>
                          setKeywordForm({
                            ...keywordForm,
                            keyword: e.target.value,
                          })
                        }
                        className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm"
                        placeholder="Ex: Software de Gestão"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Tamanho Previsto
                      </label>
                      <input
                        type="text"
                        value={keywordForm.targetWords}
                        onChange={(e) =>
                          setKeywordForm({
                            ...keywordForm,
                            targetWords: e.target.value,
                          })
                        }
                        className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm"
                        placeholder="Ex: 1500 palavras"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Mês Alvo
                      </label>
                      <input
                        required
                        type="month"
                        value={keywordForm.targetMonth}
                        onChange={(e) =>
                          setKeywordForm({
                            ...keywordForm,
                            targetMonth: e.target.value,
                          })
                        }
                        className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Vol. de Buscas
                      </label>
                      <input
                        type="text"
                        value={keywordForm.searchVolume}
                        onChange={(e) =>
                          setKeywordForm({
                            ...keywordForm,
                            searchVolume: e.target.value,
                          })
                        }
                        className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm"
                        placeholder="Ex: 50.000/mês"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        KD (Diff)
                      </label>
                      <input
                        type="text"
                        value={keywordForm.difficulty}
                        onChange={(e) =>
                          setKeywordForm({
                            ...keywordForm,
                            difficulty: e.target.value,
                          })
                        }
                        className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm"
                        placeholder="0-100"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowKeywordForm(false)}
                      className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-900 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-900 text-white font-bold px-10 py-4 rounded-2xl text-xs uppercase tracking-wider hover:bg-brand-600 transition-colors shadow-xl shadow-slate-900/10"
                    >
                      Salvar na Estratégia
                    </button>
                  </div>
                </motion.form>
              )}

              {clientKeywords.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                  <p className="text-slate-400 font-medium lowercase italic">
                    Matriz de palavras vazia para este cliente.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3 min-w-[800px]">
                    <thead>
                      <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                        <th className="px-6 py-4">Ciclo</th>
                        <th className="px-6 py-4">Palavra-chave</th>
                        <th className="px-6 py-4 text-center">Tamanho</th>
                        <th className="px-6 py-4 text-center">Volume</th>
                        <th className="px-6 py-4 text-center">
                          KD (Dificuldade)
                        </th>
                        <th className="px-6 py-4 text-right">Ações de Pauta</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-4">
                      {clientKeywords
                        .sort((a: any, b: any) =>
                          (b.targetMonth || "").localeCompare(
                            a.targetMonth || "",
                          ),
                        )
                        .map((kw: any) => (
                          <motion.tr
                            key={kw.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group"
                          >
                            <td className="px-6 py-4 bg-slate-50 border-y border-l border-slate-100 rounded-l-2xl text-[11px] font-bold text-slate-400 group-hover:bg-slate-100 transition-colors">
                              {kw.targetMonth || "-"}
                            </td>
                            <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-slate-100 transition-colors">
                              <p className="text-sm font-semibold text-slate-900 tracking-tight">
                                {kw.keyword}
                              </p>
                            </td>
                            <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-slate-100 transition-colors text-center">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">
                                {kw.targetWords || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-slate-100 transition-colors text-center">
                              <span className="text-xs font-mono text-brand-600 font-bold italic">
                                {kw.searchVolume || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-slate-100 transition-colors text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-brand-500"
                                    style={{ width: `${kw.difficulty || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400">
                                  {kw.difficulty || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 bg-slate-50 border-y border-r border-slate-100 rounded-r-2xl group-hover:bg-slate-100 transition-colors text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setPostForm({
                                      id: "",
                                      title: "",
                                      clientName: selectedHubClient,
                                      clientEmail: "",
                                      targetMonth: kw.targetMonth || "",
                                      slug: "",
                                      description: "",
                                      content: "",
                                      coverImage: "",
                                      category: "",
                                      focusKeywords: kw.keyword,
                                      anchor: "",
                                      seoTitle: "",
                                      wordCount: "",
                                      targetWords: kw.targetWords || "",
                                      imagesInfo: "",
                                      status: "Rascunho",
                                      publishedAt: "",
                                      publishedUrl: "",
                                      internalLinking: "",
                                      theme: "",
                                      secondaryKeywords: "",
                                      directioning: "",
                                    });
                                    setShowPostForm(true);
                                  }}
                                  className="bg-brand-500/10 text-brand-600 hover:bg-brand-500 hover:text-white h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                  Novo Artigo
                                </button>
                                <button
                                  onClick={() => {
                                    setBacklinkForm({
                                      id: "",
                                      title: "",
                                      clientName: selectedHubClient,
                                      clientEmail: "",
                                      targetMonth: kw.targetMonth || "",
                                      focusKeywords: kw.keyword,
                                      anchor: kw.keyword,
                                      targetUrl: "",
                                      theme: "",
                                      directioning: "",
                                      content: "",
                                      status: "Rascunho",
                                      publishedAt: "",
                                      publishedUrl: "",
                                      wordCount: "",
                                    });
                                    setShowBacklinkForm(true);
                                  }}
                                  className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                  Novo Backlink
                                </button>
                                <button
                                  onClick={() => handleDeleteKeyword(kw.id)}
                                  className="p-3 text-rose-500/40 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Grid de Produção */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Artigos */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                    <Search size={22} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display uppercase tracking-tight">
                    Fluxo de Artigos
                  </h3>
                </div>

                <div className="space-y-4">
                  {clientPosts.length === 0 && (
                    <div className="py-20 text-center bg-black/20 rounded-[2rem] border border-white/5 border-dashed">
                      <p className="text-slate-600 font-medium italic lowercase">
                        Nenhum artigo processado.
                      </p>
                    </div>
                  )}
                  {clientPosts.map((post: any, idx: number) => (
                    <motion.div
                      key={`hub-post-${post.id || idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white border border-slate-100 p-6 rounded-[2rem] hover:border-brand-500/40 hover:bg-slate-50 transition-all duration-500 shadow-xl shadow-slate-200/40"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            post.status === "Publicado"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-brand-500/10 text-brand-400"
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 font-mono">
                          {post.targetMonth}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-brand-600 transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-6 italic leading-relaxed">
                        Palavra-chave: {post.focusKeywords || "-"}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setPostForm(post);
                              setShowPostForm(true);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePost(post.id, post.coverImage)
                            }
                            className="text-[10px] font-bold uppercase tracking-wider text-rose-500/50 hover:text-rose-500 transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                        {[
                          "Aprovado",
                          "Aprovado com Ressalvas",
                          "Rascunho",
                          "Planejado",
                        ].includes(post.status) && (
                          <button
                            onClick={async () => {
                              const url = window.prompt(
                                "Distribuição Final URL:",
                              );
                              if (url) {
                                await updateDoc(
                                  doc(db, "blog_posts", post.id),
                                  {
                                    status: "Publicado",
                                    publishedUrl: url,
                                    publishedAt: new Date()
                                      .toISOString()
                                      .split("T")[0],
                                    updatedAt: serverTimestamp(),
                                  },
                                );
                                loadBlogPosts();
                              }
                            }}
                            className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-slate-900 transition-all"
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Backlinks */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <ArrowUpRight size={22} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display uppercase tracking-tight">
                    Fluxo de Backlinks
                  </h3>
                </div>

                <div className="space-y-4">
                  {clientBacklinks.length === 0 && (
                    <div className="py-20 text-center bg-black/20 rounded-[2rem] border border-white/5 border-dashed">
                      <p className="text-slate-600 font-medium italic lowercase">
                        Nenhum backlink na fila.
                      </p>
                    </div>
                  )}
                  {clientBacklinks.map((backlink: any, idx: number) => (
                    <motion.div
                      key={`hub-backlink-${backlink.id || idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white border border-slate-100 p-6 rounded-[2rem] hover:border-emerald-500/40 hover:bg-slate-50 transition-all duration-500 shadow-xl shadow-slate-200/40"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                          {backlink.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 font-mono">
                          {backlink.targetMonth}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1 uppercase font-display">
                        {backlink.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-6 italic leading-relaxed">
                        Texto Âncora:{" "}
                        {backlink.anchor || backlink.focusKeywords || "-"}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setBacklinkForm(backlink);
                              setShowBacklinkForm(true);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteBacklink(backlink.id)}
                            className="text-[10px] font-bold uppercase tracking-wider text-rose-500/50 hover:text-rose-500 transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                        {["Aprovado", "Rascunho", "Planejado"].includes(
                          backlink.status,
                        ) && (
                          <button
                            onClick={async () => {
                              const url = window.prompt(
                                "URL do Backlink Ativo:",
                              );
                              if (url) {
                                await updateDoc(
                                  doc(db, "backlinks", backlink.id),
                                  {
                                    status: "Publicado",
                                    publishedUrl: url,
                                    publishedAt: new Date()
                                      .toISOString()
                                      .split("T")[0],
                                    updatedAt: serverTimestamp(),
                                  },
                                );
                                loadBacklinks();
                              }
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-900 px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all"
                          >
                            Publicar
                          </button>
                        )}
                        {backlink.publishedUrl && (
                          <a
                            href={backlink.publishedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                          >
                            <ArrowUpRight size={16} />
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
    </motion.div>
  );
}

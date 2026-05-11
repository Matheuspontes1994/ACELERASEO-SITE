import React, { lazy, Suspense } from 'react';
const MDEditor = lazy(() => import('@uiw/react-md-editor'));
import { motion } from 'motion/react';
import { X, Link as LinkIcon, FileText, Target, Layers, AlignLeft } from 'lucide-react';

export function BacklinkFormModal({ 
  backlinkForm, setBacklinkForm, showBacklinkForm, setShowBacklinkForm, handleSaveBacklink, clientsList, isSaving 
}: any) {
  if (!showBacklinkForm) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-5xl shadow-3xl overflow-hidden max-h-[95vh] flex flex-col border border-white"
      >
        <div className="flex items-center justify-between p-8 sm:p-10 border-b border-slate-50 bg-slate-50/20">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500 rounded-2xl text-slate-900 shadow-xl shadow-emerald-500/20">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">
                {backlinkForm.id ? 'Refinar Backlink' : 'Nova Conexão Alvo'}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">
                {backlinkForm.clientName || 'Novo Planejamento Corporativo'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowBacklinkForm(false)}
            className="p-4 hover:bg-slate-100 rounded-2xl text-slate-300 hover:text-slate-900 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full no-scrollbar">
          <form onSubmit={handleSaveBacklink} className="p-8 sm:p-12 space-y-12">
            <datalist id="clients-list">
              {clientsList.map((client: string, i: number) => (
                <option key={`${client}-${i}`} value={client} />
              ))}
            </datalist>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Grupo 1: Identificação */}
              <div className="space-y-8 bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                   <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-slate-200/50 border border-slate-50">
                    <FileText size={20} />
                   </div>
                   <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Matriz e Contexto</h4>
                </div>
                
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Cliente Alvo</label>
                      <input 
                        list="clients-list" 
                        type="text" 
                        required 
                        value={backlinkForm.clientName} 
                        onChange={e => setBacklinkForm({...backlinkForm, clientName: e.target.value})} 
                        className="w-full h-12 px-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-xs placeholder:text-slate-200" 
                        placeholder="Selecionar Cliente..." 
                        autoComplete="off" 
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Ciclo</label>
                      <input 
                        type="month" 
                        required 
                        value={backlinkForm.targetMonth} 
                        onChange={e => setBacklinkForm({...backlinkForm, targetMonth: e.target.value})} 
                        className="w-full h-12 px-5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-xs" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Título de Identificação</label>
                    <input 
                      type="text" 
                      required 
                      value={backlinkForm.title} 
                      onChange={e => setBacklinkForm({...backlinkForm, title: e.target.value})} 
                      className="w-full h-14 px-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900 text-lg tracking-tight shadow-lg shadow-slate-100 placeholder:text-slate-100 uppercase" 
                      placeholder="Ex: Backlink Portal ABC" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 text-center">Status de Operação</label>
                    <div className="bg-white/50 p-2.5 rounded-[24px] border border-slate-50 flex flex-wrap gap-2 shadow-inner">
                      {['Aguardando Produção', 'Rascunho', 'Aguardando Aprovação', 'Aprovado', 'Publicado'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBacklinkForm({ ...backlinkForm, status: s })}
                          className={`flex-1 min-w-[110px] py-4 text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl transition-all duration-500 active:scale-95 ${
                            backlinkForm.status === s 
                            ? 'bg-emerald-500 text-slate-900 shadow-xl shadow-emerald-500/20 scale-[1.02] z-10' 
                            : 'bg-transparent text-slate-300 hover:text-slate-900 hover:bg-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grupo 2: SEO & Alvo */}
              <div className="space-y-8 bg-slate-50/30 p-8 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-slate-200/50 border border-slate-50">
                    <Target size={20} />
                   </div>
                   <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Estrutura SEO</h4>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">PALAVRA ÂNCORA</label>
                      <input 
                        type="text" 
                        value={backlinkForm.anchor} 
                        onChange={e => setBacklinkForm({...backlinkForm, anchor: e.target.value})} 
                        className="w-full h-14 px-6 bg-white border-none rounded-xl font-bold text-slate-900 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-lg shadow-slate-100" 
                        placeholder="Texto Âncora" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">PALAVRA-CHAVE (SEO)</label>
                      <input 
                        type="text" 
                        value={backlinkForm.focusKeywords} 
                        onChange={e => setBacklinkForm({...backlinkForm, focusKeywords: e.target.value})} 
                        className="w-full h-14 px-6 bg-white border-none rounded-xl font-medium text-slate-500 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-lg shadow-slate-100" 
                        placeholder="Palavra-chave" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">URL ALVO (Página de Conversão)</label>
                    <input 
                      type="url" 
                      value={backlinkForm.targetUrl} 
                      onChange={e => setBacklinkForm({...backlinkForm, targetUrl: e.target.value})} 
                      className="w-full h-14 px-6 bg-white border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-600 shadow-lg shadow-slate-100 text-sm" 
                      placeholder="https://seu-site.com/pauta" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">Link Publicado (Ativo)</label>
                    <input 
                      type="url" 
                      value={backlinkForm.publishedUrl} 
                      onChange={e => setBacklinkForm({...backlinkForm, publishedUrl: e.target.value})} 
                      className="w-full h-14 px-6 bg-white border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-emerald-600 shadow-lg shadow-slate-100 text-sm underline select-all" 
                      placeholder="https://portal-parceiro.com/artigo-publicado" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grupo 3: Planejamento Detalhado */}
            <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 space-y-8">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-slate-200/50 border border-slate-50">
                  <Layers size={20} />
                 </div>
                 <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Briefing & Notas de Redação</h4>
               </div>
               
               <div className="grid md:grid-cols-3 gap-8">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">TEMA (Backlink)</label>
                   <input type="text" value={backlinkForm.theme} onChange={e => setBacklinkForm({...backlinkForm, theme: e.target.value})} className="w-full h-14 px-6 bg-white border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-sm" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">Meta (Palavras)</label>
                   <input type="text" value={backlinkForm.wordCount} onChange={e => setBacklinkForm({...backlinkForm, wordCount: e.target.value})} className="w-full h-14 px-6 bg-white border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-sm" placeholder="Ex: 800" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">Deadline Final</label>
                   <input type="date" value={backlinkForm.publishedAt} onChange={e => setBacklinkForm({...backlinkForm, publishedAt: e.target.value})} className="w-full h-14 px-6 bg-white border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 ml-1">DIRECIONAMENTO (Briefing)</label>
                 <textarea 
                   value={backlinkForm.directioning} 
                   onChange={e => setBacklinkForm({...backlinkForm, directioning: e.target.value})} 
                   className="w-full p-8 bg-white border-none rounded-[32px] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium text-slate-600 shadow-lg shadow-slate-100 leading-relaxed min-h-[140px]" 
                   placeholder="Instruções estratégicas para o backlink (cerca de 60 palavras)..."
                 />
               </div>
            </div>

            <div className="space-y-8 group">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-lg shadow-slate-200/50 border border-slate-50">
                  <AlignLeft size={20} />
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Matriz Editorial (Redação Final)</h4>
              </div>
              <div data-color-mode="light" className="border-none rounded-[32px] overflow-hidden shadow-xl min-h-[450px] relative transition-all duration-500 group-focus-within:ring-4 group-focus-within:ring-emerald-500/10">
                <Suspense fallback={<div className="h-[450px] flex items-center justify-center bg-slate-50 text-slate-300 font-bold uppercase tracking-[0.2em] italic text-sm">Iniciando Protocolo Markdown...</div>}>
                  <MDEditor 
                    value={backlinkForm.content} 
                    onChange={(val) => setBacklinkForm({...backlinkForm, content: val || ''})} 
                    height={450} 
                    preview="edit" 
                  />
                </Suspense>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-end pt-12 border-t border-slate-100 mt-8">
              <button 
                type="button" 
                onClick={() => setShowBacklinkForm(false)} 
                disabled={isSaving} 
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all duration-300 rounded-2xl"
              >
                Cancelar Operação
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-300 transition-all duration-500 flex items-center justify-center gap-3 hover:translate-y-[-1px] active:translate-y-0"
              >
                {isSaving ? <X size={18} className="animate-spin" /> : null}
                {isSaving ? 'Gravando...' : 'Confirmar Estratégia'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

import React, { lazy, Suspense } from 'react';
const MDEditor = lazy(() => import('@uiw/react-md-editor'));
import { motion } from 'motion/react';
import { X, Link as LinkIcon, FileText, Target, Layers, AlignLeft } from 'lucide-react';

export function BacklinkFormModal({ 
  backlinkForm, setBacklinkForm, showBacklinkForm, setShowBacklinkForm, handleSaveBacklink, clientsList, isSaving 
}: any) {
  if (!showBacklinkForm) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-[3rem] w-full max-w-4xl shadow-3xl overflow-hidden max-h-[95vh] sm:max-h-[92vh] flex flex-col border border-white/20"
      >
        <div className="flex items-center justify-between p-4 sm:p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl text-slate-900 shadow-lg shadow-emerald-500/20">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display leading-none">
                {backlinkForm.id ? 'Editar Backlink' : 'Novo Backlink Estratégico'}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                {backlinkForm.clientName || 'Novo Planejamento'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowBacklinkForm(false)}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <form onSubmit={handleSaveBacklink} className="p-8 sm:p-10 space-y-10">
            <datalist id="clients-list">
              {clientsList.map((client: string, i: number) => (
                <option key={`${client}-${i}`} value={client} />
              ))}
            </datalist>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Grupo 1: Identificação */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <FileText size={16} className="text-slate-400" />
                   <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Identificação</h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-5">
                    <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Cliente Destino</label>
                    <input 
                      list="clients-list" 
                      type="text" 
                      required 
                      value={backlinkForm.clientName} 
                      onChange={e => setBacklinkForm({...backlinkForm, clientName: e.target.value})} 
                      className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm" 
                      placeholder="Selecione o cliente..." 
                      autoComplete="off" 
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Mês Alvo</label>
                    <input 
                      type="month" 
                      required 
                      value={backlinkForm.targetMonth} 
                      onChange={e => setBacklinkForm({...backlinkForm, targetMonth: e.target.value})} 
                      className="w-full h-12 px-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm appearance-none" 
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Status</label>
                    <select 
                      value={backlinkForm.status} 
                      onChange={e => setBacklinkForm({...backlinkForm, status: e.target.value})} 
                      className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm bg-white"
                    >
                      <option value="Planejado">Planejado</option>
                      <option value="Rascunho">Rascunho</option>
                      <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Publicado">Publicado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Título de Identificação</label>
                  <input 
                    type="text" 
                    required 
                    value={backlinkForm.title} 
                    onChange={e => setBacklinkForm({...backlinkForm, title: e.target.value})} 
                    className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm" 
                    placeholder="Ex: Backlink Portal ABC" 
                  />
                </div>
              </div>

              {/* Grupo 2: SEO & Target */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <Target size={16} className="text-slate-400" />
                   <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Alvo de SEO</h4>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Palavra-chave</label>
                      <input 
                        type="text" 
                        value={backlinkForm.focusKeywords} 
                        onChange={e => setBacklinkForm({...backlinkForm, focusKeywords: e.target.value})} 
                        className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm" 
                        placeholder="P.C de Foco" 
                      />
                    </div>
                    <div>
                      <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Texto Âncora</label>
                      <input 
                        type="text" 
                        value={backlinkForm.anchor} 
                        onChange={e => setBacklinkForm({...backlinkForm, anchor: e.target.value})} 
                        className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 shadow-sm" 
                        placeholder="Ex: clique aqui" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Página de Destino (URL Alvo)</label>
                    <input 
                      type="url" 
                      value={backlinkForm.targetUrl} 
                      onChange={e => setBacklinkForm({...backlinkForm, targetUrl: e.target.value})} 
                      className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-600 shadow-sm" 
                      placeholder="https://seu-site.com/pauta" 
                    />
                  </div>
                  <div>
                    <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">URL da Publicação (Se ativo)</label>
                    <input 
                      type="url" 
                      value={backlinkForm.publishedUrl} 
                      onChange={e => setBacklinkForm({...backlinkForm, publishedUrl: e.target.value})} 
                      className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-emerald-600 shadow-sm" 
                      placeholder="https://portal-parceiro.com/artigo" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grupo 3: Planejamento Detalhado */}
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
               <div className="flex items-center gap-3 mb-2">
                 <Layers size={16} className="text-slate-400" />
                 <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Direcionamento de Conteúdo</h4>
               </div>
               
               <div className="grid md:grid-cols-3 gap-6">
                 <div>
                   <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tema do Artigo</label>
                   <input type="text" value={backlinkForm.theme} onChange={e => setBacklinkForm({...backlinkForm, theme: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 shadow-sm" />
                 </div>
                 <div>
                   <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tamanho (Palavras)</label>
                   <input type="text" value={backlinkForm.wordCount} onChange={e => setBacklinkForm({...backlinkForm, wordCount: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Ex: 500-800" />
                 </div>
                 <div>
                   <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Data Limite / Publicação</label>
                   <input type="date" value={backlinkForm.publishedAt} onChange={e => setBacklinkForm({...backlinkForm, publishedAt: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 shadow-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Direcionamento Técnico</label>
                 <textarea 
                   value={backlinkForm.directioning} 
                   onChange={e => setBacklinkForm({...backlinkForm, directioning: e.target.value})} 
                   className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm text-slate-600 shadow-sm" 
                   rows={3} 
                   placeholder="Instruções para o redator..."
                 />
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <AlignLeft size={16} className="text-slate-400" />
                <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Corpo do Conteúdo (Markdown)</h4>
              </div>
              <div data-color-mode="light" className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-inner min-h-[350px]">
                <Suspense fallback={<div className="h-[350px] flex items-center justify-center bg-slate-50 text-slate-400 font-medium italic text-sm">Carregando editor markdown...</div>}>
                  <MDEditor 
                    value={backlinkForm.content} 
                    onChange={(val) => setBacklinkForm({...backlinkForm, content: val || ''})} 
                    height={350} 
                    preview="edit" 
                  />
                </Suspense>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowBacklinkForm(false)} 
                disabled={isSaving} 
                className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-all rounded-2xl"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-10 py-4 text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3"
              >
                {isSaving ? 'Gravando...' : 'Salvar Estratégia'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

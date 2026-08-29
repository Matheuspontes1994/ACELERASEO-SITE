import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { X, Link as LinkIcon, FileText, Target, Layers, AlignLeft, Globe, Key, Calendar, Sparkles, Activity } from 'lucide-react';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const MDEditor = lazyWithRetry(() => import('@uiw/react-md-editor'));

export function BacklinkFormModal({ 
  backlinkForm, setBacklinkForm, showBacklinkForm, setShowBacklinkForm, handleSaveBacklink, clientsList, isSaving, isSidebarCollapsed = false
}: any) {
  if (!showBacklinkForm) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-[100] flex items-center justify-center p-3 sm:p-5 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'md:left-18' : 'md:left-72'}`}>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md -z-10" 
        onClick={() => setShowBacklinkForm(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl border border-brand-100/80 flex items-center justify-center shadow-xs">
              <LinkIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {backlinkForm.id ? 'Editar Backlink Estratégico' : 'Novo Backlink Estratégico'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {backlinkForm.clientName ? `Cliente: ${backlinkForm.clientName}` : 'Novo Planejamento de Link Building'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowBacklinkForm(false)}
            className="p-2 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <div className="flex-1 overflow-y-auto w-full">
          <form onSubmit={handleSaveBacklink} className="p-6 sm:p-8 space-y-7">
            <datalist id="clients-list">
              {clientsList.map((client: string, i: number) => (
                <option key={`${client}-${i}`} value={client} />
              ))}
            </datalist>

            {/* Bloco 1: Contexto e Status de Operação */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Identificação Base (7 cols) */}
              <div className="lg:col-span-7 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                    <FileText size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Contexto e Identificação</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-7">
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Cliente Alvo</label>
                    <input 
                      list="clients-list" 
                      type="text" 
                      required 
                      value={backlinkForm.clientName} 
                      onChange={e => setBacklinkForm({...backlinkForm, clientName: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-900 text-xs placeholder:text-slate-400" 
                      placeholder="Selecionar ou digitar cliente..." 
                      autoComplete="off" 
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mês / Ciclo</label>
                    <input 
                      type="month" 
                      required 
                      value={backlinkForm.targetMonth} 
                      onChange={e => setBacklinkForm({...backlinkForm, targetMonth: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-900 text-xs" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Título de Identificação / Pauta</label>
                  <input 
                    type="text" 
                    required 
                    value={backlinkForm.title} 
                    onChange={e => setBacklinkForm({...backlinkForm, title: e.target.value})} 
                    className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400" 
                    placeholder="Ex: Artigo Guest Post - Portal de Tecnologia" 
                  />
                </div>
              </div>

              {/* Status do Workflow (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                      <Activity size={16} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Status de Operação</h4>
                  </div>
                  
                  <div className="bg-slate-200/60 p-1 rounded-xl flex flex-wrap gap-1 border border-slate-200/60">
                    {['Aguardando Produção', 'Rascunho', 'Aguardando Aprovação', 'Aprovado', 'Publicado'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBacklinkForm({ ...backlinkForm, status: s })}
                        className={`flex-1 min-w-[120px] py-2 px-2.5 text-[11px] font-semibold rounded-lg transition-all text-center ${
                          backlinkForm.status === s 
                          ? 'bg-brand-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  <span>Acompanhe o ciclo de aprovação do parceiro.</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Estrutura SEO & Âncoras */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                    <Target size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Estrutura SEO & Conexões</h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
                  Definições de âncora, palavra-chave e URLs
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key size={13} className="text-brand-600" />
                    Palavra Âncora (Texto do Link)
                  </label>
                  <input 
                    type="text" 
                    value={backlinkForm.anchor} 
                    onChange={e => setBacklinkForm({...backlinkForm, anchor: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Ex: consultoria de SEO para e-commerce" 
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-slate-500" />
                    Palavra-Chave SEO (Foco)
                  </label>
                  <input 
                    type="text" 
                    value={backlinkForm.focusKeywords} 
                    onChange={e => setBacklinkForm({...backlinkForm, focusKeywords: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Ex: consultoria seo" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LinkIcon size={13} className="text-slate-500" />
                    URL Alvo (Página de Destino / Cliente)
                  </label>
                  <input 
                    type="url" 
                    value={backlinkForm.targetUrl} 
                    onChange={e => setBacklinkForm({...backlinkForm, targetUrl: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700 text-xs placeholder:text-slate-400" 
                    placeholder="https://seusite.com.br/servico" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe size={13} className="text-brand-600" />
                    Link Publicado (URL Ativa no Parceiro)
                  </label>
                  <input 
                    type="url" 
                    value={backlinkForm.publishedUrl} 
                    onChange={e => setBacklinkForm({...backlinkForm, publishedUrl: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold text-brand-600 text-xs placeholder:text-slate-400" 
                    placeholder="https://portalparceiro.com.br/artigo-publicado" 
                  />
                </div>
              </div>
            </div>

            {/* Bloco 3: Briefing & Parâmetros de Redação */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                  <Layers size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Briefing & Notas de Produção</h4>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Tema do Artigo</label>
                  <input 
                    type="text" 
                    value={backlinkForm.theme} 
                    onChange={e => setBacklinkForm({...backlinkForm, theme: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700 text-xs placeholder:text-slate-400" 
                    placeholder="Ex: Tendências de E-commerce"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Meta de Palavras</label>
                  <input 
                    type="text" 
                    value={backlinkForm.wordCount} 
                    onChange={e => setBacklinkForm({...backlinkForm, wordCount: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700 text-xs placeholder:text-slate-400" 
                    placeholder="Ex: 800 palavras" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-500" />
                    Data Limite / Deadline
                  </label>
                  <input 
                    type="date" 
                    value={backlinkForm.publishedAt} 
                    onChange={e => setBacklinkForm({...backlinkForm, publishedAt: e.target.value})} 
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Direcionamento Estratégico (Instruções ao Redator)</label>
                <textarea 
                  value={backlinkForm.directioning} 
                  onChange={e => setBacklinkForm({...backlinkForm, directioning: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-xs font-medium leading-relaxed text-slate-700 placeholder:text-slate-400 min-h-[90px]" 
                  placeholder="Orientações sobre o veículo parceiro, regras de inserção do link e tom do conteúdo..."
                />
              </div>
            </div>

            {/* Bloco 4: Matriz Editorial (Markdown) */}
            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                    <AlignLeft size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Conteúdo do Artigo (Guest Post)</h4>
                    <p className="text-xs text-slate-500">Redija o texto que será enviado para veiculação no portal parceiro</p>
                  </div>
                </div>
              </div>

              <div data-color-mode="light" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all min-h-[400px]">
                <Suspense fallback={
                  <div className="h-[400px] flex items-center justify-center bg-slate-50 text-slate-400 font-medium text-xs">
                    Carregando editor Markdown...
                  </div>
                }>
                  <MDEditor 
                    value={backlinkForm.content} 
                    onChange={(val) => setBacklinkForm({...backlinkForm, content: val || ''})} 
                    height={400} 
                    preview="edit" 
                  />
                </Suspense>
              </div>
            </div>

            {/* Rodapé com Ações */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowBacklinkForm(false)} 
                disabled={isSaving} 
                className="px-5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Descartar
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-7 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving && <Activity size={14} className="animate-spin" />}
                {isSaving ? 'Gravando...' : 'Salvar Backlink'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

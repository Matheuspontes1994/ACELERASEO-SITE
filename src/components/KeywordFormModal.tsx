import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';

interface KeywordFormModalProps {
  showKeywordForm: boolean;
  setShowKeywordForm: (show: boolean) => void;
  keywordForm: any;
  setKeywordForm: (form: any) => void;
  handleSaveKeyword: (e: React.FormEvent) => void;
  clientsList?: string[];
  isSidebarCollapsed?: boolean;
}

export function KeywordFormModal({
  showKeywordForm,
  setShowKeywordForm,
  keywordForm,
  setKeywordForm,
  handleSaveKeyword,
  clientsList = [],
  isSidebarCollapsed = false
}: KeywordFormModalProps) {
  if (!showKeywordForm) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'md:left-18' : 'md:left-72'}`}>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs -z-10" 
        onClick={() => setShowKeywordForm(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {keywordForm.id ? 'Editar Tema / Palavra-chave' : 'Reservar Tema Estratégico'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Inteligência SEO, volumes e direcionamento editorial
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowKeywordForm(false)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSaveKeyword} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-12">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Unidade / Cliente <span className="text-rose-500">*</span>
              </label>
              <select 
                required 
                value={keywordForm.clientName} 
                onChange={e => setKeywordForm({...keywordForm, clientName: e.target.value})} 
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-semibold text-slate-800 text-xs cursor-pointer"
              >
                <option value="">Selecione a Unidade...</option>
                {clientsList.filter((c: any) => c !== 'Agência').map((client: string, i: number) => (
                  <option key={`${client}-${i}`} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-8">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Palavra-chave Estratégica (Foco) <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                value={keywordForm.keyword}
                onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-bold text-slate-900 text-xs placeholder:text-slate-400"
                placeholder="Ex: Consultoria de SEO para E-commerce"
              />
            </div>

            <div className="md:col-span-4">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Ciclo Editorial <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="month"
                value={keywordForm.targetMonth}
                onChange={(e) => setKeywordForm({ ...keywordForm, targetMonth: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-bold text-slate-800 text-xs"
              />
            </div>

            <div className="md:col-span-6">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Volume Estimado de Busca
              </label>
              <input
                type="text"
                value={keywordForm.searchVolume}
                onChange={(e) => setKeywordForm({ ...keywordForm, searchVolume: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="Ex: 8.500/mês"
              />
            </div>

            <div className="md:col-span-6">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Dificuldade de Ranqueamento (KD %)
              </label>
              <input
                type="text"
                value={keywordForm.difficulty}
                onChange={(e) => setKeywordForm({ ...keywordForm, difficulty: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="Ex: 38"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Tema / Título Sugerido do Conteúdo
              </label>
              <input
                type="text"
                value={keywordForm.theme || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, theme: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="Ex: Guia Completo: Como Escolher a Melhor Consultoria de SEO em 2026"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Palavras-chave Secundárias / Âncoras
              </label>
              <input
                type="text"
                value={keywordForm.secondaryKeywords || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, secondaryKeywords: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="Ex: especialista seo, otimização de sites, tráfego orgânico"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Linkagem Interna Recomendada
              </label>
              <textarea
                value={keywordForm.internalLinking || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, internalLinking: e.target.value })}
                rows={2}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="URLs ou âncoras para linkagem interna cruzada no blog..."
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Direcionamento Editorial (Briefing para Redator)
              </label>
              <textarea
                value={keywordForm.notes || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, notes: e.target.value })}
                rows={3}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition font-medium text-slate-800 text-xs placeholder:text-slate-400"
                placeholder="Orientações de tom de voz, tópicos obrigatórios (H2/H3) e requisitos da marca..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowKeywordForm(false)} 
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Salvar Planejamento</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export function KeywordFormModal({ 
  showKeywordForm, 
  setShowKeywordForm, 
  keywordForm, 
  setKeywordForm, 
  handleSaveKeyword,
  clientsList = []
}: any) {
  if (!showKeywordForm) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xl z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-4xl shadow-3xl overflow-hidden max-h-[90vh] flex flex-col border border-white"
      >
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Reservar Tema Estratégico</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Inteligência SEO e Planejamento de Pauta</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowKeywordForm(false)}
            className="p-3 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveKeyword} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Alvo Corporativo (Cliente)</label>
              <select 
                required 
                value={keywordForm.clientName} 
                onChange={e => setKeywordForm({...keywordForm, clientName: e.target.value})} 
                className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-semibold text-slate-900 text-xs shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Selecionar Cliente...</option>
                {clientsList.filter((c: any) => c !== 'Agência').map((client: string, i: number) => (
                  <option key={`${client}-${i}`} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-8">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Keyword Estratégica</label>
              <input
                required
                type="text"
                value={keywordForm.keyword}
                onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Ex: Software de Logística Internacional"
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Ciclo de Ataque</label>
              <input
                required
                type="month"
                value={keywordForm.targetMonth}
                onChange={(e) => setKeywordForm({ ...keywordForm, targetMonth: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-bold text-slate-900 text-sm shadow-sm"
              />
            </div>

            <div className="md:col-span-6">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Volume Estimado (SEO)</label>
              <input
                type="text"
                value={keywordForm.searchVolume}
                onChange={(e) => setKeywordForm({ ...keywordForm, searchVolume: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Ex: 12.5k/mês"
              />
            </div>
            <div className="md:col-span-6">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Dificuldade (KD %)</label>
              <input
                type="text"
                value={keywordForm.difficulty}
                onChange={(e) => setKeywordForm({ ...keywordForm, difficulty: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Ex: 45%"
              />
            </div>

            <div className="md:col-span-12 h-px bg-slate-50 my-2" />

            <div className="md:col-span-12">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">TEMA (Artigo / Planejamento)</label>
              <input
                type="text"
                value={keywordForm.theme || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, theme: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm shadow-sm"
                placeholder="Tema central do conteúdo (aprox. 20 palavras)"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">PALAVRAS ÂNCORAS SECUNDÁRIAS</label>
              <input
                type="text"
                value={keywordForm.secondaryKeywords || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, secondaryKeywords: e.target.value })}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm shadow-sm"
                placeholder="Ex: logística 4.0, frete internacional, gestão de armazém (5 a 10 palavras)"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">LINKAGEM INTERNA</label>
              <textarea
                value={keywordForm.internalLinking || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, internalLinking: e.target.value })}
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm min-h-[100px] shadow-sm"
                placeholder="Palavras-chave para linkagens internas, separadas por vírgulas (15 a 20 palavras)"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">DIRECIONAMENTO (Briefing p/ Redator)</label>
              <textarea
                value={keywordForm.notes || ""}
                onChange={(e) => setKeywordForm({ ...keywordForm, notes: e.target.value })}
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-900 text-sm min-h-[120px] shadow-sm"
                placeholder="Direcionamento estratégico, tom de voz e pontos obrigatórios (aprox. 60 palavras)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => setShowKeywordForm(false)} 
              className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
            >
              Descartar
            </button>
            <button 
              type="submit" 
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
            >
              Registrar Planejamento
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

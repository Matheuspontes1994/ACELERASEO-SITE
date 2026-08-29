import React from 'react';
import { motion } from 'motion/react';
import { X, Building2, User, Globe, Phone, DollarSign, Calendar, Clock, Layers, Plus, Trash2, ShieldCheck, Check } from 'lucide-react';
import { FileUploader } from './FileUploader';

interface ClientModalProps {
  showClientForm: boolean;
  setShowClientForm: (show: boolean) => void;
  clientForm: any;
  setClientForm: React.Dispatch<React.SetStateAction<any>>;
  handleSaveClient: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
  isSidebarCollapsed?: boolean;
}

export function ClientModal({
  showClientForm,
  setShowClientForm,
  clientForm,
  setClientForm,
  handleSaveClient,
  isSaving,
  isSidebarCollapsed = false
}: ClientModalProps) {
  if (!showClientForm) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-[100] flex items-center justify-center p-3 sm:p-5 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'md:left-18' : 'md:left-72'}`}>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md -z-10" 
        onClick={() => setShowClientForm(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl border border-brand-100/80 flex items-center justify-center shadow-xs">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {clientForm.id ? 'Editar Parceiro' : 'Novo Parceiro'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {clientForm.name ? `Cliente: ${clientForm.name}` : 'Configure os parâmetros cadastrais, operacionais e financeiros'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowClientForm(false)}
            className="p-2 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário com Scroll */}
        <div className="flex-1 overflow-y-auto w-full">
          <form onSubmit={handleSaveClient} className="p-6 sm:p-8 space-y-6">
            
            {/* Bloco 1: Dados Cadastrais & Empresa */}
            <div className="bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Identificação da Empresa</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Razão Social / Nome Fantasia *</label>
                  <input 
                    type="text" 
                    required 
                    value={clientForm.name} 
                    onChange={e => setClientForm({ ...clientForm, name: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="Ex: Empresa Exemplo Ltda" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">CNPJ / CPF</label>
                  <input 
                    type="text" 
                    value={clientForm.taxId || ''} 
                    onChange={e => setClientForm({ ...clientForm, taxId: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="00.000.000/0001-00" 
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Website Oficial (URL)</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={clientForm.websiteUrl || ''} 
                      onChange={e => setClientForm({ ...clientForm, websiteUrl: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                      placeholder="https://www.cliente.com.br" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Logo do Parceiro</label>
                  <FileUploader 
                    currentUrl={clientForm.logoUrl} 
                    onUploadSuccess={(url) => setClientForm({ ...clientForm, logoUrl: url })}
                    folder="client_logos"
                    accept="image/webp,image/png,image/jpeg,image/svg+xml"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Contatos do Cliente */}
            <div className="bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2">
                <User size={16} className="text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contato & Notificações</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pessoa de Contato</label>
                  <input 
                    type="text" 
                    value={clientForm.contactName || ''} 
                    onChange={e => setClientForm({ ...clientForm, contactName: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="Ex: Carlos Mendes" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">E-mail Principal *</label>
                  <input 
                    type="email" 
                    required 
                    value={clientForm.clientEmail} 
                    onChange={e => setClientForm({ ...clientForm, clientEmail: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="contato@empresa.com" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={clientForm.phone || ''} 
                      onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                      placeholder="(11) 98765-4321" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Telefone Adicional</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={clientForm.additionalPhone || ''} 
                      onChange={e => setClientForm({ ...clientForm, additionalPhone: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                      placeholder="(11) 3456-7890" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 3: Pacote Financeiro e Faturamento */}
            <div className="bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pacote & Faturamento</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ciclo Atual (Mês/Ano)</label>
                  <input 
                    type="month" 
                    value={clientForm.currentCycleDate || ''} 
                    onChange={e => setClientForm({ ...clientForm, currentCycleDate: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nome do Plano</label>
                  <input 
                    type="text" 
                    value={clientForm.packageName || ''} 
                    onChange={e => setClientForm({ ...clientForm, packageName: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="Ex: SEO Growth" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Valor Mensal (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={clientForm.packageValue || ''} 
                    onChange={e => setClientForm({ ...clientForm, packageValue: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                    placeholder="0.00" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Dia de Vencimento</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={clientForm.billingDay || '10'} 
                    onChange={e => setClientForm({ ...clientForm, billingDay: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* Bloco 4: Entregáveis Mensais & Prazos */}
            <div className="bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Entregáveis Mensais & Prazos</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Artigos Mensais</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={clientForm.monthlyPosts || '0'} 
                    onChange={e => setClientForm({ ...clientForm, monthlyPosts: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Backlinks Mensais</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={clientForm.monthlyBacklinks || '0'} 
                    onChange={e => setClientForm({ ...clientForm, monthlyBacklinks: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Início do Contrato</label>
                  <input 
                    type="date" 
                    value={clientForm.contractStart || ''} 
                    onChange={e => setClientForm({ ...clientForm, contractStart: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Prazo Aprovação (Dias Úteis)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={clientForm.approvalDeadlineDays || '5'} 
                    onChange={e => setClientForm({ ...clientForm, approvalDeadlineDays: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* Bloco 5: Adicionais Avulsos */}
            <div className="bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plus size={16} className="text-brand-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Adicionais Avulsos no Ciclo</h4>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const newItem = { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, price: 0 };
                    setClientForm({ ...clientForm, onDemandItems: [...(clientForm.onDemandItems || []), newItem] });
                  }} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 transition-colors"
                >
                  <Plus size={13} /> Adicionar Item
                </button>
              </div>

              <div className="space-y-3">
                {(clientForm.onDemandItems || []).map((item: any, index: number) => (
                  <div key={item.id || index} className="flex flex-col sm:flex-row gap-3 items-end bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
                    <div className="flex-1 w-full space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Serviço / Descrição</label>
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={e => {
                          const newItems = [...clientForm.onDemandItems];
                          newItems[index].name = e.target.value;
                          setClientForm({ ...clientForm, onDemandItems: newItems });
                        }} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-brand-500" 
                        placeholder="Ex: Artigo Adicional de 2000 palavras" 
                      />
                    </div>
                    <div className="w-full sm:w-24 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Qtd.</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={e => {
                          const newItems = [...clientForm.onDemandItems];
                          newItems[index].quantity = Number(e.target.value);
                          setClientForm({ ...clientForm, onDemandItems: newItems });
                        }} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-brand-500" 
                      />
                    </div>
                    <div className="w-full sm:w-32 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Preço (R$)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={item.price} 
                        onChange={e => {
                          const newItems = [...clientForm.onDemandItems];
                          newItems[index].price = Number(e.target.value);
                          setClientForm({ ...clientForm, onDemandItems: newItems });
                        }} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-brand-500" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newItems = clientForm.onDemandItems.filter((_: any, i: number) => i !== index);
                        setClientForm({ ...clientForm, onDemandItems: newItems });
                      }} 
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!clientForm.onDemandItems || clientForm.onDemandItems.length === 0) && (
                  <p className="text-xs text-slate-400 italic">Nenhum adicional avulso registrado para este ciclo.</p>
                )}
              </div>
            </div>

            {/* Rodapé de Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowClientForm(false)} 
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Check size={14} />
                {clientForm.id ? 'Salvar Alterações' : 'Cadastrar Parceiro'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, Loader2, Trash2, TrendingUp } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';

interface PaymentModalProps {
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  selectedClientForPayments: any;
  setSelectedClientForPayments: (client: any) => void;
  payments: any[];
  loadingPayments: boolean;
  paymentForm: {
    amount: number;
    paymentDate: string;
    paymentMonth: string;
    description: string;
    type: string;
  };
  setPaymentForm: React.Dispatch<React.SetStateAction<{
    amount: number;
    paymentDate: string;
    paymentMonth: string;
    description: string;
    type: string;
  }>>;
  handleAddPayment: (e: React.FormEvent) => void;
  handleDeletePayment: (payment: any) => void;
  clients: any[];
  isSidebarCollapsed?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  showPaymentModal,
  setShowPaymentModal,
  selectedClientForPayments,
    payments,
  loadingPayments,
  paymentForm,
  setPaymentForm,
  handleAddPayment,
  handleDeletePayment,
  clients,
  setSelectedClientForPayments,
  isSidebarCollapsed = false,
}) => {
  return (
    <AnimatePresence>
      {showPaymentModal && (
        <div className={`fixed inset-y-0 right-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'md:left-18' : 'md:left-72'}`}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm -z-10" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col"
          >
            <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar flex-1">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-brand-600 rounded-full"></div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão Financeira</h2>
                  </div>
                  {selectedClientForPayments ? (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedClientForPayments.name}</p>
                  ) : (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selecione uma Unidade</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Add Payment Form */}
                <div className="lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-10 space-y-8">
                   <div>
                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Novo Lançamento</h4>
                     <form onSubmit={handleAddPayment} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade / Cliente</label>
                          <select 
                            value={selectedClientForPayments?.id || ''}
                            onChange={e => {
                               const client = clients.find((c: any) => c.id === e.target.value);
                               if (client) setSelectedClientForPayments(client);
                            }}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none appearance-none"
                            required
                          >
                            <option value="">Selecione...</option>
                            {clients.map((c: any) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between ml-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor do Pagamento</label>
                            {selectedClientForPayments && (
                              <span className="text-[8px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Plano: R$ {(selectedClientForPayments.packageValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                            <input 
                              type="number" required step="0.01"
                              value={paymentForm.amount}
                              onChange={e => setPaymentForm({...paymentForm, amount: Number(e.target.value)})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Lançamento</label>
                          <select 
                            value={paymentForm.type}
                            onChange={e => setPaymentForm({...paymentForm, type: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none appearance-none"
                          >
                            <option value="Mensalidade">Mensalidade</option>
                            <option value="Setup">Setup</option>
                            <option value="Serviço Avulso">Serviço Avulso</option>
                            <option value="Consultoria">Consultoria</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                          <input 
                            type="text"
                            value={paymentForm.description}
                            onChange={e => setPaymentForm({...paymentForm, description: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
                            placeholder="Ex: Mensalidade SEO, Setup de Analytics..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Efetiva</label>
                          <input 
                            type="date" required
                            value={paymentForm.paymentDate}
                            onChange={e => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mês de Referência</label>
                          <input 
                            type="month" required
                            value={paymentForm.paymentMonth}
                            onChange={e => setPaymentForm({...paymentForm, paymentMonth: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
                          />
                          <p className="text-[8px] text-slate-400 font-medium ml-1">Define o status "Ativo" no portal do cliente.</p>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-[0.98]"
                        >
                          Registrar Pagamento
                        </button>
                     </form>
                   </div>
                </div>

                {/* Payment History */}
                <div className="lg:col-span-2">
                   <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
                     Histórico Financeiro
                     <span className="text-[8px] text-slate-400 font-medium">Últimos Lançamentos</span>
                   </h4>

                   <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                     {loadingPayments ? (
                       <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></div>
                     ) : payments.length === 0 ? (
                       <div className="py-20 text-center">
                         <DollarSign size={40} className="mx-auto text-slate-100 mb-4" />
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum pagamento registrado</p>
                       </div>
                     ) : payments.map(payment => (
                       <div key={payment.id} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between group hover:border-brand-200 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                              <DollarSign size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-black text-slate-900 tracking-tight">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                  payment.type === 'Mensalidade' ? 'bg-emerald-100 text-emerald-600' : 
                                  payment.type === 'Setup' ? 'bg-indigo-100 text-indigo-600' :
                                  'bg-amber-100 text-amber-600'
                                }`}>
                                  {payment.type}
                                </span>
                              </div>
                              <p className="text-[9px] font-bold text-slate-500 mt-0.5">{payment.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(payment.paymentDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Ref: {payment.paymentMonth}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeletePayment(payment)}
                            className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Os status no Portal do Cliente são automatizados<br/>com base no Mês de Referência lançado aqui.</p>
               </div>
               <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
               >
                 Concluir Visão
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Download, 
  RefreshCcw, 
  Search, 
  Building2, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  Calendar, 
  ChevronDown, 
  Plus, 
  Percent, 
  Receipt, 
  Wallet, 
  Check, 
  Trash2, 
  Edit3, 
  Filter,
  User,
  Phone,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CreditCard
} from 'lucide-react';

interface FinancialHealthViewProps {
  clients: any[];
  globalPayments: any[];
  loadingGlobalPayments: boolean;
  loadGlobalPayments: () => Promise<void>;
  setSelectedClientForPayments: (client: any) => void;
  setShowPaymentModal: (show: boolean) => void;
  handleConfirmPayment: (payment: any) => Promise<void>;
  handleDeletePayment: (payment: any) => Promise<void>;
  addToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function FinancialHealthView({
  clients,
  globalPayments,
  loadingGlobalPayments,
  loadGlobalPayments,
  setSelectedClientForPayments,
  setShowPaymentModal,
  handleConfirmPayment,
  handleDeletePayment,
  addToast
}: FinancialHealthViewProps) {
  const currentMonthString = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthString);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pagos' | 'Pendentes' | 'Atrasados'>('Todos');
  const [activeSubTab, setActiveSubTab] = useState<'parceiros' | 'extrato'>('parceiros');

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  // Active contract clients (excluding agency internal account)
  const activeClients = useMemo(() => {
    return clients.filter(c => (c.status === 'Ativo' || c.active !== false) && c.name !== 'Agência');
  }, [clients]);

  // Payments for selected month
  const monthPayments = useMemo(() => {
    return globalPayments.filter(p => p.paymentMonth === selectedMonth);
  }, [globalPayments, selectedMonth]);

  // Clients with detailed financial status for selected month
  const clientFinancialDetails = useMemo(() => {
    const now = new Date();
    const today = now.getDate();
    const isCurrentCycle = selectedMonth === currentMonthString;
    const isPastCycle = selectedMonth < currentMonthString;

    return activeClients.map(client => {
      const billingDay = Number(client.billingDay || 10);
      const pkgValue = Number(client.packageValue || 0);

      // Check payments made by this client for this selectedMonth
      const paymentsForClientMonth = globalPayments.filter(
        p => p.clientId === client.id && p.paymentMonth === selectedMonth
      );
      
      const isPaid = paymentsForClientMonth.some(p => p.status === 'confirmado') || (client.lastPaymentMonth && client.lastPaymentMonth >= selectedMonth);
      const hasPendingApproval = paymentsForClientMonth.some(p => p.status === 'pendente');
      const paidAmount = paymentsForClientMonth.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      let statusType: 'pago' | 'pendente' | 'atrasado' | 'hoje' | 'aguardando_aprovacao' = 'pendente';
      let statusLabel = 'A Vencer';
      let statusColor = 'text-amber-700 bg-amber-50 border-amber-200';

      if (hasPendingApproval) {
        statusType = 'aguardando_aprovacao';
        statusLabel = 'Confirmação Pendente';
        statusColor = 'text-purple-700 bg-purple-50 border-purple-200';
      } else if (isPaid) {
        statusType = 'pago';
        statusLabel = 'Liquidado';
        statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (isPastCycle) {
        statusType = 'atrasado';
        statusLabel = 'Em Atraso';
        statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
      } else if (isCurrentCycle) {
        if (today > billingDay) {
          statusType = 'atrasado';
          statusLabel = `Atrasado (${today - billingDay}d)`;
          statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
        } else if (today === billingDay) {
          statusType = 'hoje';
          statusLabel = 'Vencimento Hoje';
          statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
        } else {
          const daysToDue = billingDay - today;
          statusType = 'pendente';
          statusLabel = daysToDue <= 5 ? `Vence em ${daysToDue}d` : `Vence dia ${billingDay}`;
          statusColor = daysToDue <= 5 ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-slate-600 bg-slate-100 border-slate-200';
        }
      }

      return {
        ...client,
        billingDay,
        packageValue: pkgValue,
        isPaid,
        hasPendingApproval,
        paidAmount,
        statusType,
        statusLabel,
        statusColor,
        payments: paymentsForClientMonth
      };
    });
  }, [activeClients, globalPayments, selectedMonth, currentMonthString]);

  // Overall Financial Metrics
  const metrics = useMemo(() => {
    const totalMRR = activeClients.reduce((acc, c) => acc + (Number(c.packageValue) || 0), 0);
    
    const totalReceived = clientFinancialDetails
      .filter(c => c.isPaid)
      .reduce((acc, c) => acc + (c.packageValue || c.paidAmount || 0), 0);

    const totalOverdue = clientFinancialDetails
      .filter(c => c.statusType === 'atrasado')
      .reduce((acc, c) => acc + c.packageValue, 0);

    const totalPending = clientFinancialDetails
      .filter(c => c.statusType === 'pendente' || c.statusType === 'hoje')
      .reduce((acc, c) => acc + c.packageValue, 0);

    const paidCount = clientFinancialDetails.filter(c => c.isPaid).length;
    const overdueCount = clientFinancialDetails.filter(c => c.statusType === 'atrasado').length;
    const pendingCount = clientFinancialDetails.filter(c => c.statusType === 'pendente' || c.statusType === 'hoje').length;
    const pendingApprovalCount = globalPayments.filter(p => p.status === 'pendente').length;

    const averageTicket = activeClients.length > 0 ? totalMRR / activeClients.length : 0;
    const settlementRate = totalMRR > 0 ? (totalReceived / totalMRR) * 100 : 0;

    return {
      totalMRR,
      totalReceived,
      totalOverdue,
      totalPending,
      paidCount,
      overdueCount,
      pendingCount,
      pendingApprovalCount,
      averageTicket,
      settlementRate
    };
  }, [activeClients, clientFinancialDetails, globalPayments]);

  // Filtered Client List
  const filteredClients = useMemo(() => {
    return clientFinancialDetails.filter(client => {
      const matchesSearch = 
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.websiteUrl?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'Pagos') return client.isPaid;
      if (statusFilter === 'Pendentes') return client.statusType === 'pendente' || client.statusType === 'hoje' || client.statusType === 'aguardando_aprovacao';
      if (statusFilter === 'Atrasados') return client.statusType === 'atrasado';

      return true;
    });
  }, [clientFinancialDetails, searchQuery, statusFilter]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const [year, month] = selectedMonth.split('-');
    let csv = `Relatório Financeiro - Ciclo ${month}/${year}\n`;
    csv += `Parceiro,Responsável,Telefone,E-mail,Vencimento,Valor Mensalidade (R$),Situação\n`;

    clientFinancialDetails.forEach(c => {
      const safeName = (c.name || '').replace(/"/g, '""');
      const safeContact = (c.contactName || '').replace(/"/g, '""');
      const safePhone = (c.phone || c.additionalPhone || '').replace(/"/g, '""');
      const safeEmail = (c.clientEmail || '').replace(/"/g, '""');
      const val = (c.packageValue || 0).toFixed(2).replace('.', ',');
      const status = c.isPaid ? 'Pago' : c.statusType === 'atrasado' ? 'Em Atraso' : 'A Vencer';

      csv += `"${safeName}","${safeContact}","${safePhone}","${safeEmail}","Dia ${c.billingDay}","${val}","${status}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeiro-acelera-seo-${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Relatório exportado com sucesso!", "success");
  };

  // WhatsApp reminder message builder
  const getWhatsappBillingLink = (client: any) => {
    const rawPhone = client.phone || client.additionalPhone || '';
    if (!rawPhone) return '';

    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 11 || cleanPhone.length === 10 || (cleanPhone.length === 9 && cleanPhone.startsWith('9'))) {
      if (!cleanPhone.startsWith('55')) {
        cleanPhone = '55' + cleanPhone;
      }
    }

    const [year, m] = selectedMonth.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthName = monthNames[parseInt(m, 10) - 1] || selectedMonth;
    const val = Number(client.packageValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const name = client.contactName || client.name || 'Parceiro';

    const message = `Olá, ${name}! Tudo bem?\n\nPassando para enviar o lembrete da mensalidade de SEO referente ao ciclo de *${monthName}/${year}*, no valor de *R$ ${val}*, com vencimento no dia *${client.billingDay || 10}*.\n\nCaso precise da chave PIX ou nota fiscal, estamos à disposição por aqui!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 pb-16"
    >
      {/* Top Header & Month Navigator */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center">
                <DollarSign size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Saúde Financeira</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Gestão de recebíveis, previsibilidade de receita e liquidação de mensalidades.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month Navigator */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-xs">
              <button 
                onClick={handlePrevMonth}
                className="px-2.5 py-1.5 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 transition-all text-xs font-bold"
                title="Mês Anterior"
              >
                ←
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                <Calendar size={14} className="text-brand-600" />
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>
              <button 
                onClick={handleNextMonth}
                className="px-2.5 py-1.5 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 transition-all text-xs font-bold"
                title="Próximo Mês"
              >
                →
              </button>
            </div>

            {/* Sync Button */}
            <button 
              onClick={() => loadGlobalPayments()}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition-colors shadow-xs"
              title="Sincronizar Lançamentos"
            >
              <RefreshCcw size={16} className={loadingGlobalPayments ? 'animate-spin text-brand-600' : ''} />
            </button>

            {/* Export CSV */}
            <button 
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-2xl px-4 py-2.5 shadow-xs transition-colors"
            >
              <Download size={14} /> Exportar CSV
            </button>

            {/* New Payment Button */}
            <button 
              onClick={() => {
                if (clients.length > 0) {
                  setSelectedClientForPayments(clients[0]);
                  setShowPaymentModal(true);
                } else {
                  addToast("Cadastre um parceiro antes de lançar pagamentos.", "warning");
                }
              }}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl px-4 py-2.5 shadow-xs transition-all active:scale-95"
            >
              <Plus size={16} /> Lançar Pagamento
            </button>
          </div>
        </div>

        {/* Pending Approvals Banner (if any) */}
        {metrics.pendingApprovalCount > 0 && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  {metrics.pendingApprovalCount} pagamento(s) aguardando confirmação
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  Comprovantes enviados pelo portal que necessitam da sua validação.
                </span>
              </div>
            </div>
            <button 
              onClick={() => setActiveSubTab('extrato')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0"
            >
              Ver Extrato Pendente <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Progress Bar of Month Settlement */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Progresso de Arrecadação do Mês</span>
              <span className="text-slate-400 font-medium">({selectedMonth})</span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60 text-[11px] font-bold">
                {metrics.settlementRate.toFixed(1)}% Liquidado
              </span>
              <span className="text-slate-700">
                R$ {metrics.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {metrics.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, metrics.settlementRate)}%` }}
            />
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: MRR Total */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MRR Contratado</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                R$ {metrics.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span> 
                {activeClients.length} contratos ativos
              </p>
            </div>
          </div>

          {/* Card 2: Total Liquidado */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Liquidado</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                R$ {metrics.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {metrics.paidCount} de {activeClients.length} parceiros quitados
              </p>
            </div>
          </div>

          {/* Card 3: A Receber */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">A Receber</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                R$ {metrics.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {metrics.pendingCount} parceiros no prazo
              </p>
            </div>
          </div>

          {/* Card 4: Em Atraso */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Em Atraso</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-rose-600 group-hover:bg-rose-50 transition-colors flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                R$ {metrics.totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {metrics.overdueCount} {metrics.overdueCount === 1 ? 'parceiro pendente' : 'parceiros pendentes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs & Filters Navigation */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        {/* Subtabs */}
        <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5 w-fit shadow-xs">
          <button
            onClick={() => setActiveSubTab('parceiros')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeSubTab === 'parceiros'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Building2 size={14} className={activeSubTab === 'parceiros' ? 'text-brand-600' : 'text-slate-400'} />
            <span>Cobrança por Parceiro</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeSubTab === 'parceiros' ? 'bg-brand-50 text-brand-600 border border-brand-100' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {activeClients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('extrato')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeSubTab === 'extrato'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Receipt size={14} className={activeSubTab === 'extrato' ? 'text-brand-600' : 'text-slate-400'} />
            <span>Extrato de Lançamentos</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeSubTab === 'extrato' ? 'bg-brand-50 text-brand-600 border border-brand-100' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {monthPayments.length}
            </span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por parceiro ou domínio..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none w-64 shadow-xs"
            />
          </div>

          {activeSubTab === 'parceiros' && (
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs gap-1">
              {(['Todos', 'Pagos', 'Pendentes', 'Atrasados'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === filter 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'parceiros' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Table Header Description */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mapa de Cobrança — Ciclo {selectedMonth}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Dispare lembretes via WhatsApp e acompanhe a quitação mensal de cada parceiro.</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {filteredClients.length} de {activeClients.length} exibidos
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 text-xs font-bold text-slate-500 border-b border-slate-200/80">
                  <th className="px-6 py-4">Parceiro & Contato</th>
                  <th className="px-6 py-4">Plano Contratado</th>
                  <th className="px-6 py-4">Vencimento</th>
                  <th className="px-6 py-4 text-center">Status do Ciclo</th>
                  <th className="px-6 py-4 text-right">Ações & Cobrança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-medium text-xs">
                      Nenhum parceiro encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : filteredClients.map(client => {
                  const whatsappLink = getWhatsappBillingLink(client);
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Col 1: Parceiro */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border transition-all ${
                            client.logoUrl ? "bg-white border-slate-200" : "bg-slate-100 border-slate-200 text-slate-400"
                          }`}>
                            {client.logoUrl ? (
                              <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                            ) : (
                              <Building2 size={20} />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block group-hover:text-brand-600 transition-colors">
                              {client.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {client.contactName && (
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                  <User size={11} className="text-slate-400" /> {client.contactName}
                                </span>
                              )}
                              {client.websiteUrl && (
                                <a 
                                  href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-slate-400 hover:text-brand-600 font-mono inline-flex items-center gap-1 transition-colors"
                                >
                                  {client.websiteUrl.replace(/^https?:\/\//, '')}
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Plano & Mensalidade */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-900 block">
                          {client.packageName || 'Personalizado'}
                        </span>
                        <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                          R$ {client.packageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Col 3: Vencimento */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                          Dia {client.billingDay}
                        </span>
                      </td>

                      {/* Col 4: Status do Ciclo */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${client.statusColor}`}>
                          <span className={`w-2 h-2 rounded-full ${
                            client.statusType === 'pago' ? 'bg-emerald-500' :
                            client.statusType === 'atrasado' ? 'bg-rose-500 animate-pulse' :
                            client.statusType === 'aguardando_aprovacao' ? 'bg-purple-500 animate-pulse' :
                            'bg-amber-500'
                          }`} />
                          {client.statusLabel}
                        </span>
                      </td>

                      {/* Col 5: Ações */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Lembrete WhatsApp */}
                          {!client.isPaid && whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                              title="Enviar lembrete de cobrança via WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5 fill-emerald-600" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.45 5.3 0 9.6-4.3 9.6-9.6s-4.3-9.6-9.6-9.6C6.1 1.4 1.8 5.7 1.8 11c0 1.7.5 3.3 1.4 4.8l-1 3.6 3.7-.9c1.6.9 3.1 1.4 4.7 1.4z"/>
                              </svg>
                              Cobrança
                            </a>
                          )}

                          {/* Gerenciar Pagamentos Modal */}
                          <button
                            onClick={() => {
                              setSelectedClientForPayments(client);
                              setShowPaymentModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                            title="Gerenciar faturas e histórico de pagamentos"
                          >
                            <CreditCard size={13} className="text-slate-500" />
                            Extrato
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-slate-200">
                Nenhum parceiro encontrado com os filtros selecionados.
              </div>
            ) : filteredClients.map(client => {
              const whatsappLink = getWhatsappBillingLink(client);
              return (
                <div key={client.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border shrink-0 ${
                        client.logoUrl ? "bg-white border-slate-200" : "bg-slate-100 border-slate-200 text-slate-400"
                      }`}>
                        {client.logoUrl ? (
                          <img src={client.logoUrl} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Building2 size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{client.packageName || 'Plano Customizado'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${client.statusColor}`}>
                      {client.statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Mensalidade</span>
                      <span className="text-xs font-bold text-slate-900">
                        R$ {client.packageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Vencimento</span>
                      <span className="text-xs font-bold text-slate-900">Dia {client.billingDay}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {!client.isPaid && whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Lembrete WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedClientForPayments(client);
                        setShowPaymentModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Ver Extrato
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Subtab 2: Extrato de Lançamentos */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Extrato Financeiro Completo</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Histórico consolidado de recebimentos e comprovantes registrados.</p>
            </div>
            <button 
              onClick={() => loadGlobalPayments()} 
              className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
              title="Sincronizar"
            >
              <RefreshCcw size={15} className={loadingGlobalPayments ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 text-xs font-bold text-slate-500 border-b border-slate-200/80">
                  <th className="px-6 py-4">Parceiro</th>
                  <th className="px-6 py-4">Data Pagamento</th>
                  <th className="px-6 py-4">Ciclo Ref.</th>
                  <th className="px-6 py-4">Tipo & Descrição</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                  <th className="px-6 py-4 text-center">Status / Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {globalPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-medium text-xs">
                      Nenhum lançamento registrado no sistema.
                    </td>
                  </tr>
                ) : globalPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 block group-hover:text-brand-600 transition-colors">
                        {payment.clientName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium block">
                        {payment.description || 'Mensalidade SEO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 font-mono">
                      {payment.paymentDate ? new Date(payment.paymentDate + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/60 px-2.5 py-1 rounded-lg">
                        {payment.paymentMonth}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {payment.type || 'Mensalidade'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-sm">
                      R$ {(Number(payment.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {payment.status === 'pendente' ? (
                          <button
                            onClick={() => handleConfirmPayment(payment)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                            title="Confirmar este recebimento"
                          >
                            <Check size={13} /> Confirmar
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                            <CheckCircle2 size={12} /> Confirmado
                          </span>
                        )}
                        <button
                          onClick={() => handleDeletePayment(payment)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remover Registro"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

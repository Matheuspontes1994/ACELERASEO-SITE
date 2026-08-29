import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareText,
  Users,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Check,
  Send,
  RefreshCcw,
  Sparkles,
  ExternalLink,
  MessageCircle,
  UserCheck,
  ShieldCheck,
  Zap,
  RotateCcw,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase';

interface TechnicalSupportViewProps {
  adminTickets: any[];
  selectedAdminTicket: any;
  setSelectedAdminTicket: (ticket: any) => void;
  adminTicketMessages: any[];
  loadingAdminTickets: boolean;
  fetchAdminTickets: () => Promise<void>;
  onlineUsers: any[];
  checkingOnline: boolean;
  checkOnlineUsers: () => Promise<void>;
  clients: any[];
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const QUICK_SNIPPETS = [
  {
    id: 'received',
    label: 'Analisando solicitação',
    text: 'Olá! Recebemos sua solicitação e nossa equipe técnica especializada já está analisando o caso.'
  },
  {
    id: 'more_info',
    label: 'Solicitar detalhes',
    text: 'Para avançarmos com mais precisão, você poderia nos fornecer mais detalhes ou uma captura de tela?'
  },
  {
    id: 'in_progress',
    label: 'Ajustes em andamento',
    text: 'Identificamos a demanda e as otimizações técnicas já estão sendo aplicadas no seu projeto.'
  },
  {
    id: 'resolved',
    label: 'Concluído com sucesso',
    text: 'Solicitação atendida e verificada com sucesso! Poderia testar no seu painel para confirmar?'
  }
];

export const TechnicalSupportView: React.FC<TechnicalSupportViewProps> = ({
  adminTickets,
  selectedAdminTicket,
  setSelectedAdminTicket,
  adminTicketMessages,
  loadingAdminTickets,
  fetchAdminTickets,
  onlineUsers,
  checkingOnline,
  checkOnlineUsers,
  clients,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'online'>('tickets');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'pending' | 'answered' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminTicketMessages, selectedAdminTicket]);

  // Handler to select ticket and mark read
  const handleSelectTicket = async (ticket: any) => {
    setSelectedAdminTicket(ticket);
    if (ticket.unreadByAdmin) {
      try {
        await updateDoc(doc(db, 'support_tickets', ticket.id), {
          unreadByAdmin: false,
          updatedAt: serverTimestamp()
        });
        fetchAdminTickets();
      } catch (err) {
        console.error('Erro ao marcar chamado como lido:', err);
      }
    }
  };

  // Status updates (pending, answered, closed)
  const handleUpdateTicketStatus = async (newStatus: 'pending' | 'answered' | 'closed') => {
    if (!selectedAdminTicket?.id || selectedAdminTicket.isTemporary) return;
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, 'support_tickets', selectedAdminTicket.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setSelectedAdminTicket((prev: any) => ({ ...prev, status: newStatus }));
      fetchAdminTickets();
      const statusLabels = {
        pending: 'marcado como Pendente',
        answered: 'marcado como Respondido',
        closed: 'marcado como Encerrado/Resolvido'
      };
      addToast(`Chamado ${statusLabels[newStatus]}!`, 'success');
    } catch (err) {
      console.error('Erro ao atualizar status do chamado:', err);
      addToast('Erro ao atualizar status do chamado.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedAdminTicket || !auth.currentUser) return;
    setSendingReply(true);

    try {
      // If temporary ticket (created from online user without formal ticket yet)
      if (selectedAdminTicket.isTemporary) {
        const ticketRef = doc(collection(db, 'support_tickets'));
        await setDoc(ticketRef, {
          subject: selectedAdminTicket.subject || 'Suporte Técnico Direto',
          clientEmail: selectedAdminTicket.clientEmail || '',
          clientName: selectedAdminTicket.clientName || 'Cliente',
          clientUid: selectedAdminTicket.clientUid,
          status: 'answered',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          unreadByAdmin: false,
          unreadByClient: true,
          lastMessage: replyText.substring(0, 150)
        });

        await setDoc(doc(collection(db, 'support_tickets', ticketRef.id, 'messages')), {
          senderId: auth.currentUser.uid,
          senderName: 'Atendimento Acelera SEO',
          senderRole: 'admin',
          message: replyText.trim(),
          createdAt: serverTimestamp()
        });

        // Notify client
        if (selectedAdminTicket.clientUid) {
          try {
            await addDoc(collection(db, 'notifications'), {
              userId: selectedAdminTicket.clientUid,
              clientEmail: selectedAdminTicket.clientEmail || '',
              title: 'Novo Chamado de Suporte',
              message: `O Atendimento Acelera SEO iniciou um chamado: "${selectedAdminTicket.subject || 'Suporte Técnico Direto'}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          } catch (notifErr) {
            console.error('Erro ao notificar cliente:', notifErr);
          }
        }

        setReplyText('');
        addToast('Chamado criado e mensagem enviada!', 'success');
        await fetchAdminTickets();
        setSelectedAdminTicket({
          id: ticketRef.id,
          clientEmail: selectedAdminTicket.clientEmail,
          clientName: selectedAdminTicket.clientName,
          clientUid: selectedAdminTicket.clientUid,
          subject: selectedAdminTicket.subject || 'Suporte Técnico Direto',
          status: 'answered'
        });
      } else {
        // Regular reply to existing ticket
        const messageData = {
          senderId: auth.currentUser.uid,
          senderName: 'Atendimento Acelera SEO',
          senderRole: 'admin',
          message: replyText.trim(),
          createdAt: serverTimestamp()
        };

        const messageRef = doc(collection(db, 'support_tickets', selectedAdminTicket.id, 'messages'));
        await setDoc(messageRef, messageData);

        await updateDoc(doc(db, 'support_tickets', selectedAdminTicket.id), {
          unreadByClient: true,
          unreadByAdmin: false,
          lastMessage: replyText.trim().substring(0, 150),
          status: 'answered',
          updatedAt: serverTimestamp()
        });

        if (selectedAdminTicket.clientUid) {
          try {
            await addDoc(collection(db, 'notifications'), {
              userId: selectedAdminTicket.clientUid,
              clientEmail: selectedAdminTicket.clientEmail || '',
              title: 'Nova Mensagem de Suporte',
              message: `Você recebeu uma resposta no chamado: "${selectedAdminTicket.subject}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          } catch (notifErr) {
            console.error('Erro ao notificar resposta:', notifErr);
          }
        }

        setReplyText('');
        fetchAdminTickets();
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      addToast('Erro ao enviar mensagem.', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  // Find client data to link WhatsApp
  const matchedClient = selectedAdminTicket
    ? clients.find(
        c =>
          (selectedAdminTicket.clientUid && (c.id === selectedAdminTicket.clientUid || c.uid === selectedAdminTicket.clientUid)) ||
          (selectedAdminTicket.clientEmail && c.email?.toLowerCase() === selectedAdminTicket.clientEmail.toLowerCase()) ||
          (selectedAdminTicket.clientName && c.name?.toLowerCase() === selectedAdminTicket.clientName.toLowerCase())
      )
    : null;

  const clientPhone = matchedClient?.phone || matchedClient?.whatsapp || '';

  const getWhatsAppLink = (phone: string, ticketSubject: string, clientName: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 10 && !cleanPhone.startsWith('55')) {
      cleanPhone = `55${cleanPhone}`;
    }
    const message = `Olá, ${clientName}! Aqui é do Suporte Técnico da Acelera SEO referente ao seu chamado "${ticketSubject}". Como podemos te ajudar?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Calculations for Metrics
  const totalTickets = adminTickets.length;
  const pendingTickets = adminTickets.filter(t => t.status === 'pending' || t.unreadByAdmin).length;
  const answeredTickets = adminTickets.filter(t => t.status === 'answered' && !t.unreadByAdmin).length;
  const closedTickets = adminTickets.filter(t => t.status === 'closed').length;
  const onlineCount = onlineUsers.filter(u => u.isOnline).length;

  // Filtered tickets
  const filteredTickets = adminTickets.filter(ticket => {
    // Tab filter
    if (ticketFilter === 'pending' && ticket.status !== 'pending' && !ticket.unreadByAdmin) return false;
    if (ticketFilter === 'answered' && (ticket.status !== 'answered' || ticket.unreadByAdmin)) return false;
    if (ticketFilter === 'closed' && ticket.status !== 'closed') return false;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = ticket.clientName?.toLowerCase().includes(term);
      const matchSubject = ticket.subject?.toLowerCase().includes(term);
      const matchEmail = ticket.clientEmail?.toLowerCase().includes(term);
      const matchMessage = ticket.lastMessage?.toLowerCase().includes(term);
      return matchName || matchSubject || matchEmail || matchMessage;
    }
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
            <MessageSquareText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Suporte Técnico & Atendimento</h2>
            <p className="text-xs text-slate-500 font-medium">Gestão centralizada de chamados, mensagens diretas e monitoramento de presença</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminTickets}
            disabled={loadingAdminTickets}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
            title="Atualizar Chamados"
          >
            <RefreshCcw size={14} className={loadingAdminTickets ? 'animate-spin' : ''} />
            Atualizar
          </button>
          <button
            onClick={checkOnlineUsers}
            disabled={checkingOnline}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            <Users size={14} className={checkingOnline ? 'animate-pulse' : ''} />
            {checkingOnline ? 'Consultando...' : 'Verificar Online'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - Standardized to match Dashboard design system */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aguardando Resposta</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{pendingTickets}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {pendingTickets === 1 ? 'Chamado aguarda retorno' : 'Chamados aguardam retorno'}
            </p>
          </div>
        </div>

        {/* Card 2: Em Atendimento / Respondidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Respondidos</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors flex items-center justify-center">
              <MessageCircle size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{answeredTickets}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Em acompanhamento com cliente
            </p>
          </div>
        </div>

        {/* Card 3: Resolvidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolvidos</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{closedTickets}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Concluídos com sucesso
            </p>
          </div>
        </div>

        {/* Card 4: Usuários Conectados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Presença Ativa</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{onlineCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${onlineCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {onlineCount === 1 ? 'Usuário conectado agora' : 'Usuários conectados agora'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace: Proportional & Balanced Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Tickets & Presence Selector (4.5 / 12 on large screens) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Tab switchers: Chamados vs Presença */}
          <div className="p-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquareText size={14} />
              Chamados ({totalTickets})
            </button>
            <button
              onClick={() => {
                setActiveTab('online');
                if (onlineUsers.length === 0) checkOnlineUsers();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'online'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={14} />
              Presença ({onlineCount})
            </button>
          </div>

          {/* If Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="p-3.5 flex-1 flex flex-col min-h-0 space-y-3">
              {/* Search box */}
              <div className="relative shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente, assunto ou e-mail..."
                  className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-brand-500 transition"
                />
              </div>

              {/* Sub-filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar shrink-0">
                <button
                  onClick={() => setTicketFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    ticketFilter === 'all'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({totalTickets})
                </button>
                <button
                  onClick={() => setTicketFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    ticketFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Pendentes ({pendingTickets})
                </button>
                <button
                  onClick={() => setTicketFilter('answered')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    ticketFilter === 'answered'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                  Respondidos ({answeredTickets})
                </button>
                <button
                  onClick={() => setTicketFilter('closed')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    ticketFilter === 'closed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Resolvidos ({closedTickets})
                </button>
              </div>

              {/* Ticket list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar min-h-0">
                {loadingAdminTickets ? (
                  <div className="py-16 text-center text-slate-400">
                    <RefreshCcw size={20} className="animate-spin mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">Carregando chamados...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-5">
                    <MessageSquareText size={24} className="mx-auto mb-1.5 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">Nenhum chamado encontrado</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Não há tickets com este filtro.</p>
                  </div>
                ) : (
                  filteredTickets.map(ticket => {
                    const isSelected = selectedAdminTicket?.id === ticket.id;
                    const isPending = ticket.status === 'pending' || ticket.unreadByAdmin;

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full text-left p-3 rounded-xl border transition-all relative flex flex-col gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-brand-50/70 border-brand-500/90 shadow-xs ring-1 ring-brand-500/30'
                            : isPending
                            ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isSelected
                                  ? 'bg-brand-600 text-white'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {ticket.clientName ? ticket.clientName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <span
                              className={`text-xs font-bold truncate ${
                                isSelected ? 'text-brand-900' : 'text-slate-800'
                              }`}
                            >
                              {ticket.clientName || 'Cliente'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {ticket.unreadByAdmin && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            )}
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                ticket.status === 'closed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : ticket.unreadByAdmin || ticket.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                  : 'bg-brand-50 text-brand-700 border border-brand-200/60'
                              }`}
                            >
                              {ticket.status === 'closed'
                                ? 'Resolvido'
                                : ticket.unreadByAdmin || ticket.status === 'pending'
                                ? 'Pendente'
                                : 'Respondido'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-slate-900' : 'text-slate-800'
                            }`}
                          >
                            {ticket.subject || 'Suporte Geral'}
                          </h4>
                          <p
                            className={`text-[11px] line-clamp-1 mt-0.5 ${
                              isSelected ? 'text-slate-600' : 'text-slate-500'
                            }`}
                          >
                            {ticket.lastMessage || 'Sem mensagens recentes'}
                          </p>
                        </div>

                        <div
                          className={`flex items-center justify-between text-[10px] font-medium pt-1 border-t ${
                            isSelected ? 'border-brand-200/60 text-slate-500' : 'border-slate-100 text-slate-400'
                          }`}
                        >
                          <span className="truncate max-w-[150px]">{ticket.clientEmail || 'E-mail não informado'}</span>
                          <span>
                            {ticket.updatedAt?.toDate
                              ? ticket.updatedAt.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                              : 'Recente'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* If Online Users Tab */}
          {activeTab === 'online' && (
            <div className="p-3.5 flex-1 flex flex-col min-h-0 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 shrink-0">
                <span className="font-bold">Usuários com presença detectada</span>
                <button
                  onClick={checkOnlineUsers}
                  disabled={checkingOnline}
                  className="text-brand-600 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCcw size={12} className={checkingOnline ? 'animate-spin' : ''} />
                  Atualizar lista
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar min-h-0">
                {onlineUsers.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-5">
                    <Users size={24} className="mx-auto mb-1.5 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">Nenhum usuário verificado</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Clique em "Verificar Online" para listar presenças ativas.</p>
                  </div>
                ) : (
                  onlineUsers.map((user: any) => {
                    const existingTicket = adminTickets.find((t: any) => t.clientUid === user.id);
                    const isClientOnline = user.isOnline;

                    return (
                      <div
                        key={user.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2.5 hover:border-slate-300 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isClientOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {user.name || user.email?.split('@')[0] || 'Usuário'}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                              {user.role === 'admin' ? 'Admin' : 'Cliente'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {user.lastActive?.toDate
                              ? `Visto às ${user.lastActive.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                              : 'Sem registro recente'}
                          </p>
                        </div>

                        {user.role !== 'admin' && (
                          <button
                            onClick={() => {
                              if (existingTicket) {
                                handleSelectTicket(existingTicket);
                                addToast(`Abrindo chamado existente de ${user.name || 'Cliente'}!`, 'info');
                              } else {
                                setSelectedAdminTicket({
                                  id: `temp-${user.id}`,
                                  clientUid: user.id,
                                  clientName: user.name || 'Cliente',
                                  clientEmail: user.email || '',
                                  subject: 'Suporte Técnico Direto',
                                  status: 'pending',
                                  isTemporary: true
                                });
                                addToast('Iniciando canal de conversa direta!', 'info');
                              }
                            }}
                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-brand-600 border border-slate-200 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer"
                          >
                            Conversar
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Chat Window & Interaction (7 / 12 on large screens, aligned height) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {selectedAdminTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedAdminTicket.clientName || 'Cliente'}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        selectedAdminTicket.status === 'closed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : selectedAdminTicket.status === 'pending' || selectedAdminTicket.unreadByAdmin
                          ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          : 'bg-brand-50 text-brand-700 border border-brand-200/60'
                      }`}
                    >
                      {selectedAdminTicket.status === 'closed'
                        ? 'Resolvido'
                        : selectedAdminTicket.status === 'pending' || selectedAdminTicket.unreadByAdmin
                        ? 'Aguardando Atendimento'
                        : 'Respondido'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {selectedAdminTicket.subject || 'Suporte Técnico'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {selectedAdminTicket.isTemporary ? 'CANAL DIRETO' : `#${selectedAdminTicket.id?.substring(0, 8)}`} • {selectedAdminTicket.clientEmail}
                  </p>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  {/* WhatsApp Quick Direct Contact */}
                  {clientPhone && (
                    <a
                      href={getWhatsAppLink(clientPhone, selectedAdminTicket.subject || 'Suporte', selectedAdminTicket.clientName || 'Parceiro')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={14} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}

                  {/* Status Toggle Dropdown / Button */}
                  {!selectedAdminTicket.isTemporary && (
                    <>
                      {selectedAdminTicket.status === 'closed' ? (
                        <button
                          disabled={updatingStatus}
                          onClick={() => handleUpdateTicketStatus('pending')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          Reabrir
                        </button>
                      ) : (
                        <button
                          disabled={updatingStatus}
                          onClick={() => handleUpdateTicketStatus('closed')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          Finalizar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/30 min-h-0">
                {selectedAdminTicket.isTemporary ? (
                  <div className="py-16 text-center px-6 space-y-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto">
                      <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Iniciar Atendimento Direto</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Envie uma mensagem abaixo para abrir um canal de atendimento direto. O cliente receberá no painel.
                    </p>
                  </div>
                ) : adminTicketMessages.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <MessageSquareText size={22} className="mx-auto mb-1.5 text-slate-300" />
                    <p className="text-xs font-medium">Nenhuma mensagem registrada neste chamado.</p>
                  </div>
                ) : (
                  adminTicketMessages.map((m: any) => {
                    const isSenderAdmin = m.senderRole === 'admin';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                          isSenderAdmin ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-400 px-1 mb-0.5">
                          {m.senderName} {isSenderAdmin ? '(Equipe Acelera)' : ''}
                        </span>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isSenderAdmin
                              ? 'bg-brand-600 text-white rounded-tr-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs font-medium'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.message}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">
                          {m.createdAt?.toDate
                            ? m.createdAt.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                            : 'Agora'}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Snippets Toggle & List */}
              <div className="px-3.5 py-1.5 border-t border-slate-100 bg-white shrink-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowSnippets(prev => !prev)}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Sparkles size={12} />
                    {showSnippets ? 'Ocultar respostas rápidas' : 'Usar respostas rápidas'}
                  </button>
                  <span className="text-[10px] text-slate-400">Pressione Enter para enviar</span>
                </div>

                <AnimatePresence>
                  {showSnippets && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 pb-1"
                    >
                      {QUICK_SNIPPETS.map(snippet => (
                        <button
                          key={snippet.id}
                          onClick={() => {
                            setReplyText(snippet.text);
                            setShowSnippets(false);
                          }}
                          className="text-left p-2 rounded-lg bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200 text-slate-700 transition cursor-pointer"
                        >
                          <p className="text-[11px] font-bold text-slate-900">{snippet.label}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{snippet.text}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input Footer */}
              {selectedAdminTicket.status === 'closed' ? (
                <div className="p-3 border-t border-slate-200 bg-slate-50 text-center flex items-center justify-center gap-2 shrink-0">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span className="text-xs font-bold text-slate-600">Este chamado está marcado como resolvido.</span>
                  <button
                    onClick={() => handleUpdateTicketStatus('pending')}
                    className="text-xs font-bold text-brand-600 hover:underline cursor-pointer"
                  >
                    Reabrir para responder
                  </button>
                </div>
              ) : (
                <div className="p-3 border-t border-slate-200/80 bg-white flex items-end gap-2 shrink-0">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escreva sua resposta de suporte..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-brand-500 resize-none transition"
                  />
                  <button
                    disabled={sendingReply || !replyText.trim()}
                    onClick={handleSendMessage}
                    className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl transition shadow-xs cursor-pointer shrink-0"
                    title="Enviar Mensagem"
                  >
                    <Send size={15} className={sendingReply ? 'animate-pulse' : ''} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-2.5">
                <MessageSquareText size={22} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Nenhum chamado selecionado</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Selecione um chamado na lista ao lado ou escolha um usuário na aba de presença para iniciar o atendimento.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

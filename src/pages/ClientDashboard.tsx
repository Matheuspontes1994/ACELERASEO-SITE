import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from '../components/ui/Skeleton';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';
import { 
  CheckCircle2, 
  CheckCircle,
  ChevronDown,
  Activity,
  LogOut,
  Calendar,
  Code,
  AlertCircle,
  Users,
  Search,
  FileText,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  RefreshCcw,
  MessageSquareText,
  Menu,
  X,
  Globe2,
  Link as LinkIcon,
  Clock,
  Rocket,
  Zap,
  Check,
  DollarSign,
  Bell
} from 'lucide-react';
import { collection, getDocs, updateDoc, addDoc, setDoc, doc, serverTimestamp, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { auth, db } from '../firebase';
import { updateUserActiveStatus } from '../utils/userStatus';

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  while (days > 0) {
    result.setDate(result.getDate() + 1);
    // 0 = Sunday, 6 = Saturday
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      days--;
    }
  }
  return result;
};

const getRemainingBusinessDays = (startDate: Date, deadlineDays: number): number | string => {
  const deadline = addBusinessDays(startDate, deadlineDays);
  const now = new Date();
  
  if (now > deadline) return 0;
  
  let remaining = 0;
  let current = new Date(now);
  while (current < deadline) {
    current.setDate(current.getDate() + 1);
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      remaining++;
    }
  }
  return remaining;
};
import { onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useNavigate, Link } from 'react-router-dom';
import PostChat from '../components/PostChat';
import PostHistory from '../components/PostHistory';
import { HorizontalScroll } from '../components/HorizontalScroll';
import { ToastContainer } from '../components/Toast';

export default function ClientDashboard() {
  const { logoUrl: agencyLogo } = useSettings();
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [isChangingTab, setIsChangingTab] = useState(false);

  React.useEffect(() => {
    setIsChangingTab(true);
    const timer = setTimeout(() => {
      setIsChangingTab(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [keywordsUniverse, setKeywordsUniverse] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [reviewingPost, setReviewingPost] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');

  const [postsLimit, setPostsLimit] = useState(5);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [backlinksLimit, setBacklinksLimit] = useState(5);
  const [hasMoreBacklinks, setHasMoreBacklinks] = useState(true);

  const handleLoadMorePosts = () => {
    const newLimit = postsLimit + 10;
    setPostsLimit(newLimit);
    loadBlogPosts(newLimit);
  };

  const handleLoadMoreBacklinks = () => {
    const newLimit = backlinksLimit + 10;
    setBacklinksLimit(newLimit);
    loadBacklinks(newLimit);
  };
  
  const formatCycleDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const monthIdx = parseInt(month) - 1;
      return monthIdx >= 0 && monthIdx < 12 ? `${months[monthIdx]}/${year}` : dateStr;
    } catch {
      return dateStr;
    }
  };

  const [selectedClient, setSelectedClient] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeclarePayment, setShowDeclarePayment] = useState(false);
  const [declarePaymentForm, setDeclarePaymentForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    description: 'Pagamento declarado pelo cliente'
  });
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Support state
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [chatMessageText, setChatMessageText] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchTickets = async () => {
    if (!auth.currentUser) return;
    setLoadingTickets(true);
    try {
      const activeClient = selectedClient 
        ? clientsData.find(c => c.name === selectedClient) 
        : clientsData.find(c => c.uid === auth.currentUser?.uid || c.clientEmail === auth.currentUser?.email);

      let q;
      if (isAdmin && activeClient) {
        if (activeClient.uid) {
          q = query(
            collection(db, 'support_tickets'),
            where('clientUid', '==', activeClient.uid)
          );
        } else if (activeClient.clientEmail) {
          q = query(
            collection(db, 'support_tickets'),
            where('clientEmail', '==', activeClient.clientEmail)
          );
        } else {
          q = query(
            collection(db, 'support_tickets'),
            where('clientName', '==', activeClient.name)
          );
        }
      } else {
        q = query(
          collection(db, 'support_tickets'),
          where('clientUid', '==', auth.currentUser.uid)
        );
      }

      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      list.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0);
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0);
        return timeB - timeA;
      });
      setTickets(list);
      const unread = list.filter((t: any) => t.unreadByClient).length;
      setUnreadTicketsCount(unread);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSelectTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    if (ticket.unreadByClient) {
      try {
        await updateDoc(doc(db, 'support_tickets', ticket.id), {
          unreadByClient: false,
          updatedAt: serverTimestamp()
        });
        setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unreadByClient: false } : t));
        setUnreadTicketsCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Erro ao marcar chamado como lido:", err);
      }
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim() || !auth.currentUser) return;
    setSubmittingTicket(true);
    try {
      const ticketRef = doc(collection(db, 'support_tickets'));
      const activeClient = selectedClient 
        ? clientsData.find(c => c.name === selectedClient) 
        : clientsData.find(c => c.uid === auth.currentUser?.uid || c.clientEmail === auth.currentUser?.email) || clientsData[0];
      const clientName = activeClient?.name || auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Cliente';
      
      const ticketData = {
        subject: newTicketSubject,
        clientEmail: activeClient?.clientEmail || auth.currentUser.email || '',
        clientName: clientName,
        clientUid: activeClient?.uid || auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadByAdmin: true,
        unreadByClient: false,
        lastMessage: newTicketMessage.substring(0, 150)
      };

      await setDoc(ticketRef, ticketData);

      const messageRef = doc(collection(db, 'support_tickets', ticketRef.id, 'messages'));
      const messageData = {
        senderId: auth.currentUser.uid,
        senderName: isAdmin ? 'Atendimento Acelera SEO' : clientName,
        senderRole: isAdmin ? 'admin' : 'client',
        message: newTicketMessage,
        createdAt: serverTimestamp()
      };

      await setDoc(messageRef, messageData);

      try {
        if (isAdmin) {
          if (activeClient?.uid) {
            await addDoc(collection(db, 'notifications'), {
              userId: activeClient.uid,
              clientEmail: activeClient.clientEmail || '',
              title: 'Novo Chamado de Suporte',
              message: `O Atendimento Acelera SEO abriu um chamado para você: "${newTicketSubject}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          }
        } else {
          if (activeClient?.agencyUid) {
            await addDoc(collection(db, 'notifications'), {
              userId: activeClient.agencyUid,
              clientEmail: activeClient.clientEmail || auth.currentUser.email || '',
              title: 'Novo Chamado de Suporte',
              message: `O cliente ${clientName} abriu o chamado: "${newTicketSubject}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          }
        }
      } catch (notifErr) {
        console.error("Erro ao criar notificação de chamado:", notifErr);
      }

      setNewTicketSubject('');
      setNewTicketMessage('');
      setShowNewTicketModal(false);
      addToast('Chamado aberto com sucesso!', 'success');
      fetchTickets();
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      addToast('Erro ao abrir chamado. Verifique os dados.', 'error');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessageText.trim() || !selectedTicket || !auth.currentUser) return;
    setSendingMessage(true);
    try {
      const activeClient = selectedClient 
        ? clientsData.find(c => c.name === selectedClient) 
        : clientsData.find(c => c.uid === auth.currentUser?.uid || c.clientEmail === auth.currentUser?.email);
      const clientName = activeClient?.name || auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Cliente';
      
      const messageData = {
        senderId: auth.currentUser.uid,
        senderName: isAdmin ? 'Atendimento Acelera SEO' : clientName,
        senderRole: isAdmin ? 'admin' : 'client',
        message: chatMessageText,
        createdAt: serverTimestamp()
      };

      const messageRef = doc(collection(db, 'support_tickets', selectedTicket.id, 'messages'));
      await setDoc(messageRef, messageData);

      await updateDoc(doc(db, 'support_tickets', selectedTicket.id), {
        unreadByAdmin: !isAdmin,
        unreadByClient: isAdmin,
        lastMessage: chatMessageText.substring(0, 150),
        status: isAdmin ? 'answered' : 'pending',
        updatedAt: serverTimestamp()
      });

      try {
        if (isAdmin) {
          if (activeClient?.uid) {
            await addDoc(collection(db, 'notifications'), {
              userId: activeClient.uid,
              clientEmail: activeClient.clientEmail || '',
              title: 'Nova Mensagem de Suporte',
              message: `Você recebeu uma resposta da nossa equipe no chamado: "${selectedTicket.subject}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          }
        } else {
          if (activeClient?.agencyUid) {
            await addDoc(collection(db, 'notifications'), {
              userId: activeClient.agencyUid,
              clientEmail: activeClient.clientEmail || auth.currentUser.email || '',
              title: 'Nova Mensagem de Suporte',
              message: `O cliente ${clientName} enviou uma resposta no chamado: "${selectedTicket.subject}".`,
              type: 'info',
              category: 'suporte',
              read: false,
              createdAt: serverTimestamp()
            });
          }
        }
      } catch (notifErr) {
        console.error("Erro ao criar notificação do chat de suporte:", notifErr);
      }

      setChatMessageText('');
      fetchTickets();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      addToast('Erro ao enviar mensagem.', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const fetchUnreadNotifications = async (userId: string, email: string) => {
    const path = 'notifications';
    try {
      // Otimização: Busca apenas as NÃO lidas para reduzir leituras iniciais
      const q = query(
        collection(db, path),
        where('read', '==', false),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const newNotifications = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setNotifications(newNotifications);
      setUnreadCount(snapshot.size);
    } catch (error) {
      console.error(error);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), {
        read: true,
        readAt: serverTimestamp()
      });
      // A atualização no estado local será refletida pelo onSnapshot ou manualmente se quisermos manter visível
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
        await markNotificationAsRead(n.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const navigate = useNavigate();

  const [clientsData, setClientsData] = useState<any[]>([]);

  useEffect(() => {
    let statusInterval: any = null;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const userId = user.uid;
        const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
        setIsAdmin(isUserAdmin);

        // Log user status
        updateUserActiveStatus('client', user.displayName || undefined, user.email || undefined);
        statusInterval = setInterval(() => {
          updateUserActiveStatus('client', user.displayName || undefined, user.email || undefined);
        }, 180000);

        // Fetch support tickets on login
        fetchTickets();
        
        const path = 'clients';
        try {
          let clientsQuery;
          if (isUserAdmin) {
            clientsQuery = query(collection(db, path));
          } else {
            // Try to find by UID first, then email as fallback
            const uidQuery = query(collection(db, path), where('uid', '==', userId));
            const uidSnap = await getDocs(uidQuery);
            
            if (!uidSnap.empty) {
              clientsQuery = uidQuery;
            } else {
              clientsQuery = query(collection(db, path), where('clientEmail', '==', userEmail));
            }
          }
            
          const clientsSnap = await getDocs(clientsQuery);
          const clients = clientsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
          setClientsData(clients);

          // Buscar notificações apenas para o usuário atual
          fetchUnreadNotifications(userId, userEmail || '');

          if (isUserAdmin && clients.length > 0 && !selectedClient) {
            setSelectedClient(clients[0].name);
          }

          // Pre-selecionar o ciclo atual do cliente
          const activeClient = isUserAdmin ? (selectedClient ? clients.find(c => c.name === selectedClient) : clients[0]) : clients[0];
          if (activeClient?.currentCycleDate && !filterMonth) {
            setFilterMonth(activeClient.currentCycleDate);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setIsAdmin(false);
        setClientsData([]);
      }
    });
    return () => {
      unsubscribe();
      if (statusInterval) clearInterval(statusInterval);
    };
  }, []); // Only register auth listener once

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // reset pagination limits on client switch
    setPostsLimit(5);
    setBacklinksLimit(5);
    setHasMorePosts(true);
    setHasMoreBacklinks(true);

    // Pre-selecionar o ciclo atual do cliente selecionado
    const activeClient = selectedClient 
      ? clientsData.find(c => c.name === selectedClient) 
      : clientsData.find(c => c.uid === auth.currentUser?.uid || c.clientEmail === auth.currentUser?.email);
    
    if (activeClient?.currentCycleDate && !filterMonth) {
      setFilterMonth(activeClient.currentCycleDate);
    }

    loadBlogPosts(5);
    loadBacklinks(5);
    loadKeywordsUniverse();
    fetchTickets();
  }, [selectedClient, clientsData]);

  // Real-time listener for the selected ticket's messages
  useEffect(() => {
    if (!selectedTicket?.id) {
      setTicketMessages([]);
      return;
    }

    const q = query(
      collection(db, 'support_tickets', selectedTicket.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTicketMessages(msgs);
    }, (err) => {
      console.error("Erro no canal de mensagens em tempo real:", err);
    });

    return () => unsubscribe();
  }, [selectedTicket?.id]);

  const loadBlogPosts = async (customLimit = postsLimit) => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'blog_posts';
    
    try {
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(customLimit));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(customLimit));
        }
      } else {
        // For clients, we try to match by email OR uid (if we have a client record with that uid)
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          // Many older posts might only have clientEmail or clientName
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(customLimit));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(customLimit));
        }
      }

      setLoadingPosts(true);
      const snapshot = await getDocs(q);
      setHasMorePosts(snapshot.docs.length === customLimit);
      const posts: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        let currentStatus = data.status;
        
        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clientsData.find(c => c.name === data.clientName);
          const deadlineDays = clientInfo?.approvalDeadlineDays ? Number(clientInfo.approvalDeadlineDays) : 5;
          const statusDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
          const remaining = getRemainingBusinessDays(statusDate, deadlineDays);
          
          if (remaining === 0) {
            updateDoc(docSnap.ref, { 
              status: 'Aprovado', 
              clientComment: 'Aprovado automaticamente pelo prazo vencido.', 
              updatedAt: serverTimestamp() 
            });

            // Registrar histórico de revisão automática para blog posts
            addDoc(collection(db, 'blog_posts', docSnap.id, 'revisions'), {
              status: 'Aprovado',
              author: 'Sistema (Prazo Expirado)',
              comment: 'Conteúdo aprovado automaticamente devido ao vencimento do prazo de revisão de 5 dias úteis.',
              timestamp: serverTimestamp(),
              type: 'auto_approval',
              message: 'Aprovação Automática por Prazo'
            });

            currentStatus = 'Aprovado';
            data.clientComment = 'Aprovado automaticamente pelo prazo vencido.';
          } else {
            data.remainingApprovalDays = remaining;
          }
        }

        if (data.clientName && data.clientName !== 'Agência') {
          posts.push({ id: docSnap.id, ...data, status: currentStatus });
        }
      });
      setBlogPosts(posts);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadBacklinks = async (customLimit = backlinksLimit) => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'backlinks';

    try {
      setLoadingBacklinks(true);
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(customLimit));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(customLimit));
        }
      } else {
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(customLimit));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(customLimit));
        }
      }

      const querySnapshot = await getDocs(q);
      setHasMoreBacklinks(querySnapshot.docs.length === customLimit);
      const links: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        let currentStatus = data.status;

        if (currentStatus === 'Aguardando Aprovação' && data.updatedAt) {
          const clientInfo = clientsData.find(c => c.name === data.clientName);
          const deadlineDays = clientInfo?.approvalDeadlineDays ? Number(clientInfo.approvalDeadlineDays) : 5;
          const statusDate = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
          const remaining = getRemainingBusinessDays(statusDate, deadlineDays);
          
          if (remaining === 0) {
            updateDoc(docSnap.ref, { 
              status: 'Aprovado', 
              clientComment: 'Aprovado automaticamente pelo prazo vencido.', 
              updatedAt: serverTimestamp() 
            });

            // Registrar histórico de revisão automática para backlinks
            addDoc(collection(db, 'backlinks', docSnap.id, 'revisions'), {
              status: 'Aprovado',
              author: 'Sistema (Prazo Expirado)',
              comment: 'Backlink aprovado automaticamente devido ao vencimento do prazo de revisão de 5 dias úteis.',
              timestamp: serverTimestamp(),
              type: 'auto_approval',
              message: 'Aprovação Automática por Prazo'
            });

            currentStatus = 'Aprovado';
            data.clientComment = 'Aprovado automaticamente pelo prazo vencido.';
          } else {
            data.remainingApprovalDays = remaining;
          }
        }

        if (data.clientName && data.clientName !== 'Agência') {
          links.push({ id: docSnap.id, ...data, status: currentStatus });
        }
      });
      setBacklinks(links);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setLoadingBacklinks(false);
    }
  };

  const loadKeywordsUniverse = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const userId = user.uid;
    const isUserAdmin = userEmail === 'matheuspontes290594@gmail.com' || userEmail === 'aceleraseo@gmail.com';
    let q;
    const path = 'keyword_universe';

    try {
      if (isUserAdmin) {
        if (selectedClient) {
          q = query(collection(db, path), where('clientName', '==', selectedClient), orderBy('createdAt', 'desc'), limit(500));
        } else {
          q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(500));
        }
      } else {
        const clientRecord = clientsData.find(c => c.uid === userId || c.clientEmail === userEmail);
        if (clientRecord) {
          q = query(collection(db, path), where('clientEmail', '==', clientRecord.clientEmail), orderBy('createdAt', 'desc'), limit(500));
        } else {
          q = query(collection(db, path), where('clientEmail', '==', userEmail), orderBy('createdAt', 'desc'), limit(500));
        }
      }
      const querySnapshot = await getDocs(q);
      const kws: any[] = [];
      querySnapshot.forEach((docSnap) => {
        kws.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setKeywordsUniverse(kws);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const clientNames = Array.from(new Set([
    ...clientsData.map(c => c.name),
    ...blogPosts.map(p => p.clientName), 
    ...backlinks.map(b => b.clientName),
    ...keywordsUniverse.map(k => k.clientName)
  ].filter(Boolean))).sort();

  const handleDeclarePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClientStatus) return;
    
    try {
      await addDoc(collection(db, 'payments'), {
        amount: Number(declarePaymentForm.amount),
        paymentDate: declarePaymentForm.paymentDate,
        paymentMonth: declarePaymentForm.paymentMonth,
        description: declarePaymentForm.description,
        type: 'Mensalidade',
        status: 'pendente',
        clientId: currentClientStatus.id,
        clientName: currentClientStatus.name,
        clientEmail: currentClientStatus.clientEmail,
        agencyUid: currentClientStatus.agencyUid,
        createdAt: serverTimestamp()
      });
      
      addToast("Pagamento declarado com sucesso! Aguarde a confirmação.", "success");
      setShowDeclarePayment(false);

      // Notificar a agência
      try {
        await addDoc(collection(db, 'notifications'), {
          userId: currentClientStatus.agencyUid, // Notifica quem gerencia este cliente
          title: 'Pagamento Declarado',
          message: `O cliente ${currentClientStatus.name} declarou um pagamento de R$ ${Number(declarePaymentForm.amount).toLocaleString('pt-BR')}.`,
          type: 'info',
          category: 'pagamento',
          read: false,
          clientEmail: currentClientStatus.clientEmail,
          createdAt: serverTimestamp()
        });
      } catch (notifErr) {
        console.error("Erro ao criar notificação para agência:", notifErr);
      }
    } catch (err) {
      console.error(err);
      addToast("Erro ao declarar pagamento", "error");
    }
  };

  const filteredBlogPosts = (selectedClient ? blogPosts.filter(p => p.clientName === selectedClient) : blogPosts)
    .filter(p => {
      const isDraft = p.status === 'Rascunho';
      const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.focusKeywords?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
      const matchesMonth = !filterMonth || p.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesStatus && matchesMonth;
    });

  const filteredBacklinks = (selectedClient ? backlinks.filter(b => b.clientName === selectedClient) : backlinks)
    .filter(b => {
      const isDraft = b.status === 'Rascunho';
      const matchesSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.focusKeywords?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = !filterMonth || b.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesMonth;
    });

  const filteredKeywords = (selectedClient ? keywordsUniverse.filter(k => k.clientName === selectedClient) : keywordsUniverse)
    .filter(k => {
      const isDraft = k.status === 'Rascunho';
      const matchesSearch = k.keyword?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = !filterMonth || k.targetMonth === filterMonth;
      return !isDraft && matchesSearch && matchesMonth;
    });

  const currentClientStatus = selectedClient 
    ? clientsData.find((c: any) => c.name === selectedClient) 
    : clientsData.find((c: any) => c.clientEmail === auth.currentUser?.email) || (isAdmin ? null : (clientsData.length > 0 ? clientsData[0] : null));
  
  const effectiveClientName = currentClientStatus?.name || null;

  let targetPosts = 0;
  let targetBacklinks = 0;
  let targetDevHours = 0;
  let targetInitialDevHours = 0;
  let isExpired = false;

  if (currentClientStatus) {
    const now = new Date();
    const billingDay = Number(currentClientStatus.billingDay || 10);
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    isExpired = Number(now.getDate()) >= billingDay && currentClientStatus.lastPaymentMonth !== currentMonthYear;

    targetPosts = Number(currentClientStatus.monthlyPosts || 0);
    targetBacklinks = Number(currentClientStatus.monthlyBacklinks || 0);
    targetDevHours = Number(currentClientStatus.monthlyDevHours || 0);
    targetInitialDevHours = Number(currentClientStatus.initialDevHours || 0);

    if (currentClientStatus.extraMonth === (filterMonth || currentMonthYear)) {
      targetPosts += Number(currentClientStatus.extraPosts || 0);
      targetBacklinks += Number(currentClientStatus.extraBacklinks || 0);
      targetDevHours += Number(currentClientStatus.extraDevHours || 0);
    }
  }

  const getPlanStatus = () => {
    if (!currentClientStatus) return { label: 'Ativo', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    
    if (currentClientStatus.status === 'Cancelado') {
      return { label: 'Cancelado', color: 'text-slate-500', bg: 'bg-slate-100' };
    }

    const now = new Date();
    const billingDay = Number(currentClientStatus.billingDay || 10);
    const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.getDate();

    // Check if delayed
    const isPaidCurrentCycle = currentClientStatus.lastPaymentMonth === currentMonthYear;
    if (today > billingDay && !isPaidCurrentCycle) {
      return { label: 'Em atraso', color: 'text-rose-600', bg: 'bg-rose-50' };
    }

    if (today === billingDay) {
      return { label: 'Vencimento Hoje', color: 'text-amber-600', bg: 'bg-amber-50' };
    }

    // Vencimento Próximo: 5 days before billingDay
    let daysToBilling = billingDay - today;
    if (daysToBilling < 0) {
      // In current cycle, calc days until next month's billing day
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, billingDay);
      daysToBilling = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (daysToBilling > 0 && daysToBilling <= 5) {
      return { label: 'Vencimento Próximo', color: 'text-orange-500', bg: 'bg-orange-50' };
    }

    return { label: 'Ativo', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  const planStatus = getPlanStatus();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500/30 selection:text-white flex flex-col md:flex-row">
      <Helmet>
        <title>Portal do Cliente | Acelera SEO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-100/50 to-transparent pointer-events-none z-0"></div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] md:hidden"
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-[100] bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0 ${currentClientStatus?.logoUrl ? "bg-white" : "bg-white"}`}>
              {currentClientStatus?.logoUrl ? (
                <img 
                  src={currentClientStatus.logoUrl} 
                  alt={currentClientStatus.name} 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img src={agencyLogo} alt="Acelera SEO" className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-slate-400/80 uppercase tracking-[0.1em] leading-none mb-0.5">Performance Hub</p>
              <span className="text-[12px] font-black tracking-tight text-slate-900 uppercase truncate block leading-tight">
                {currentClientStatus?.name || 'Acelera SEO'}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Inside Mobile Header */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border shadow-sm ${
                showNotifications ? 'bg-brand-600 text-white border-brand-500 shadow-brand-500/20' : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed top-[4.5rem] right-4 w-[calc(100vw-32px)] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[150]"
                >
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Notificações</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5 whitespace-nowrap">Últimas atualizações do projeto</p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[9px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-700 underline underline-offset-4"
                      >
                        Visto
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                          <Bell size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nada por aqui no momento</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                            className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-brand-50/30' : 'bg-white opacity-60'}`}
                          >
                            {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full" />}
                            <div className="flex gap-4">
                               <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                 notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                 notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                 notif.type === 'error' ? 'bg-rose-100 text-rose-600' :
                                 'bg-brand-100 text-brand-600'
                               }`}>
                                 {notif.category === 'pagemento' ? <DollarSign size={18} /> :
                                  notif.category === 'aprovação' ? <CheckCircle2 size={18} /> :
                                  <Activity size={18} />}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{notif.title}</h4>
                                    <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap ml-2">
                                      {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleDateString('pt-BR') : 'Agora'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">{notif.message}</p>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Somente notificações não lidas aparecem aqui ao entrar</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl transition-all ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>



      {/* Sidebar Layout */}
      <aside className={`
        fixed inset-y-0 left-0 z-[120] w-[85vw] sm:w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-500 ease-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header - Static Section */}
        <div className="p-6 md:p-8 shrink-0 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link to="/" className="flex items-center gap-4 min-w-0 hover:opacity-80 transition-opacity">
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0 ${currentClientStatus?.logoUrl ? "bg-white" : "bg-white"}`}>
                  {currentClientStatus?.logoUrl ? (
                    <img 
                      src={currentClientStatus.logoUrl} 
                      alt={currentClientStatus.name} 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img src={agencyLogo} alt="Acelera SEO" className="w-full h-full object-contain p-1.5" />
                  )}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-left">Performance Hub</p>
                  <h2 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                    {currentClientStatus?.name || 'Acelera SEO'}
                  </h2>
                </div>
              </Link>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Middle - Scrollable Section */}
        <div className="flex-1 overflow-y-auto overflow-x-visible no-scrollbar pb-6 px-3 md:px-4">
          <div className="p-3 md:p-4 pt-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="min-w-0">
                <p className="px-1.5 mb-1 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400/50 truncate">Ciclo Operacional</p>
                <div className="relative group/cycle">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/cycle:text-brand-600 transition-colors pointer-events-none z-10">
                    <Calendar size={12} />
                  </div>
                  <div className="w-full bg-slate-100/50 border border-slate-200/50 rounded-lg pl-8 pr-2 py-2 text-[9px] font-bold text-slate-900 shadow-sm hover:bg-white transition-all flex items-center h-[32px] min-h-[32px] overflow-hidden whitespace-nowrap">
                    <span className="uppercase text-[8px] sm:text-[9px] truncate">{formatCycleDate(filterMonth)}</span>
                  </div>
                  <input 
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="month-picker-overlay z-20"
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="min-w-0">
                  <p className="px-1.5 mb-1 text-[7px] font-black uppercase tracking-[0.15em] text-slate-400/50 truncate">Unidade Performance</p>
                  <div className="relative group/client">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/client:text-brand-600 transition-colors z-10">
                      <Users size={12} />
                    </div>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full bg-slate-100/50 border border-slate-200/50 rounded-lg pl-8 pr-6 py-2 text-[8px] font-bold text-slate-600 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm appearance-none cursor-pointer hover:bg-white transition-all h-[32px] min-h-[32px] truncate"
                    >
                      <option value="">Selec.</option>
                      {clientNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover/client:translate-x-0.5">
                      <ChevronDown size={10} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100/60 mx-4 my-2" />

          {/* Navigation */}
          <nav className="space-y-1.5 pt-2">
            {[
              { id: 'Visão Geral', label: 'Painel Central', icon: Activity },
              { id: 'Aprovação de Conteúdos', label: 'Sala de Aprovação', icon: Clock, badge: filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação').length },
              { id: 'Conteúdos Publicados', label: 'Acervo Articles', icon: FileText },
              { id: 'Backlinks Publicados', label: 'Growth Off-Page', icon: LinkIcon },
              { id: 'Estratégia de Palavras', label: 'Inteligência SEO', icon: Globe2 },
              { id: 'Suporte', label: 'Suporte & Ajuda', icon: MessageSquareText, badge: unreadTicketsCount },
            ].map(item => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 text-[13px] font-bold group ${activeTab === item.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600 shadow-sm'}`}>
                      {item.badge}
                    </span>
                  )}
                  {activeTab === item.id && (
                    <motion.div layoutId="clientActiveDot" className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 space-y-3 md:space-y-4 shrink-0">
          {isAdmin && (
            <button 
              onClick={() => navigate('/painel')} 
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl py-3 md:py-4 hover:bg-brand-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
            >
              <TrendingUp size={14} /> Painel Agência
            </button>
          )}
          
          <div className="bg-white border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">
                {auth.currentUser?.email?.split('@')[0] || 'Cliente'}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sessão Ativa</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-[10px] font-black uppercase tracking-[0.25em] border border-transparent hover:border-rose-100 shadow-sm"
          >
            <LogOut size={16} /> Finalizar Sessão
          </button>
        </div>
      </aside>


      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 relative z-10 min-h-screen">
        <div className="p-4 sm:p-8 md:p-10 lg:p-12 max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1.5 w-10 bg-brand-600 rounded-full"></div>
                <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Intelligence Suite</p>
              </div>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-[0.95] mb-4 text-left">
                {activeTab}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed text-left">
                {activeTab === 'Visão Geral' && 'Acompanhe seu ciclo, histórico de entregas e saldo de horas técnico.'}
                {activeTab === 'Aprovação de Conteúdos' && 'Sala de curadoria estratégica. Suas decisões definem o tom da marca.'}
                {activeTab === 'Conteúdos Publicados' && 'Consulte todos os ativos de conteúdo que já estão gerando tráfego.'}
                {activeTab === 'Backlinks Publicados' && 'Monitore a construção de autoridade e links conquistados.'}
                {activeTab === 'Estratégia de Palavras' && 'Mapeamento de oportunidades e termos estratégicos para o seu nicho.'}
                {activeTab === 'Suporte' && 'Central de Atendimento. Tire suas dúvidas e envie solicitações diretamente para nossa equipe.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/40 p-2 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm backdrop-blur-md gap-2 sm:gap-3">
              <div className="flex items-center bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm gap-3 sm:gap-4 px-4 sm:px-6 py-3 min-w-0 flex-1 lg:flex-none">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${planStatus.bg} ${planStatus.color} rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                  <Zap size={22} fill="currentColor" className="opacity-80" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pointer-events-none mb-0.5 sm:mb-1 whitespace-nowrap">Status Plano:</p>
                  <div className="flex items-center gap-2">
                    <div className={`text-[11px] sm:text-xs font-black ${planStatus.color} tracking-tight uppercase truncate`}>
                      {planStatus.label}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${planStatus.label === 'Ativo' ? 'bg-emerald-500 animate-pulse' : planStatus.label === 'Em atraso' ? 'bg-rose-500' : 'bg-amber-500'} shrink-0`}></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/contato')}
                className="flex items-center justify-center text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 rounded-2xl sm:rounded-3xl hover:bg-brand-600 transition-all shadow-lg active:scale-95 gap-2.5 px-6 py-4 sm:py-5"
              >
                <MessageSquareText size={16} className="text-white/70" />
                Suporte Especialista
              </button>
            </div>
          </motion.div>

          <div className="tab-content relative">
            {isChangingTab ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[500px] flex flex-col items-center justify-center py-24 text-center w-full bg-transparent"
              >
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100/80 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-8 text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase animate-pulse font-sans">Carregando painel...</p>
                <p className="mt-2 text-[10px] text-slate-300 font-mono">Processando dados e layouts da agência</p>
              </motion.div>
            ) : (
              <>
                <div 
                  id="panel-visão-geral"
            role="tabpanel"
            aria-labelledby="tab-visão-geral"
            hidden={activeTab !== 'Visão Geral'}
          >
            {activeTab === 'Visão Geral' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6"
              >
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black font-display text-slate-900 text-left">Meu Plano e Entregáveis</h2>
                      <p className="text-sm font-medium text-slate-500">Acompanhe seu ciclo, histórico de entregas e saldo de horas.</p>
                    </div>
                    {filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação').length > 0 && (
                      <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl border border-rose-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conteúdos Pendentes</span>
                      </div>
                    )}
                  </div>

               <div className="grid lg:grid-cols-3 gap-6">
                 {/* Ciclo e Resumo */}
                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm col-span-1 lg:col-span-2 p-5 sm:p-8 overflow-hidden">
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center mb-8 gap-2 text-left">
                     <Calendar size={16} className="text-brand-600" />
                     Ciclo Operacional
                   </h3>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                     <div className="bg-white rounded-2xl border border-slate-200 p-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Início</p>
                      <p className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-1 inline-block">Dia {currentClientStatus?.billingDay || 10}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Fechamento</p>
                      <p className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-1 inline-block">Dia {(Number(currentClientStatus?.billingDay || 10) - 1) || 30}</p>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-5 shadow-xl shadow-slate-900/10">
                      <p className="text-[10px] font-black text-slate-400/50 uppercase tracking-[0.15em] mb-1">Status do Ciclo</p>
                       <p className={`text-lg font-black ${planStatus.color}`}>{planStatus.label}</p>
                     </div>
                   </div>

                   {currentClientStatus?.packageValue && (
                     <div className="mb-8 p-6 bg-brand-50 border border-brand-100 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                           <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Valor da Assinatura Mensal</p>
                           <p className="text-2xl font-black text-slate-900">R$ {Number(currentClientStatus.packageValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <button 
                            onClick={(e) => {
                              setDeclarePaymentForm(prev => ({ ...prev, amount: String(currentClientStatus.packageValue) }));
                              setShowDeclarePayment(true);
                            }}
                            className="flex-1 sm:flex-none px-6 py-3 bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg active:scale-95"
                          >
                            Declarar Pagamento
                          </button>
                          <div className="hidden sm:flex p-4 bg-white rounded-2xl shadow-sm text-brand-600">
                             <DollarSign size={24} />
                          </div>
                        </div>
                     </div>
                   )}

                   <h3 className="text-lg font-black text-slate-900 flex items-center mb-6 gap-3 text-left uppercase tracking-tight">
                     <CheckCircle2 size={20} className="text-emerald-500" />
                     Entregáveis do Mês
                   </h3>
                   
                   <div className="grid sm:grid-cols-2 gap-4">
                      {/* Artigos Progress */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Artigos SEO (Blog)</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Já entregamos {filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length} de {targetPosts}</p>
                          </div>
                          <div className="text-lg font-bold text-brand-600">
                            {targetPosts > 0 ? Math.round((filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length / targetPosts) * 100) : 0}%
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div className="bg-brand-500 h-3 rounded-full transition-all duration-500" style={{ width: `${targetPosts > 0 ? Math.min(100, (filteredBlogPosts.filter(p => ['Publicado', 'Aprovado'].includes(p.status)).length / targetPosts) * 100) : 0}%` }}></div>
                        </div>
                      </div>

                      {/* Backlinks Progress */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Link Building (Backlinks)</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Já entregamos {filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length} de {targetBacklinks}</p>
                          </div>
                          <div className="text-lg font-bold text-emerald-600">
                            {targetBacklinks > 0 ? Math.round((filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length / targetBacklinks) * 100) : 0}%
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${targetBacklinks > 0 ? Math.min(100, (filteredBacklinks.filter(b => ['Publicado'].includes(b.status)).length / targetBacklinks) * 100) : 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Urgent Actions Section */}
                 {blogPosts.filter(p => p.status === 'Aguardando Aprovação').length > 0 && (
                   <div className="mt-8 pt-8 border-t border-slate-200/60">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prioridades de Aprovação</h4>
                     </div>
                     <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
                       {blogPosts
                         .filter(p => p.status === 'Aguardando Aprovação')
                         .sort((a,b) => (a.remainingApprovalDays || 5) - (b.remainingApprovalDays || 5))
                         .slice(0, 2)
                         .map(post => (
                           <div key={`urgent-overview-${post.id}`} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-300 transition-all group shadow-sm text-left">
                             <div className="flex items-center gap-3 overflow-hidden">
                               <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${Number(post.remainingApprovalDays) <= 2 ? 'bg-rose-50 text-rose-500' : 'bg-brand-50 text-brand-600'}`}>
                                 <FileText size={18} />
                               </div>
                           <div className="overflow-hidden">
                                 <p className="text-xs font-black text-slate-900 break-words tracking-tight uppercase leading-tight mb-1" title={post.title}>{post.title}</p>
                                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] leading-none">Expira em {post.remainingApprovalDays}d</p>
                               </div>
                             </div>
                             <button 
                               onClick={() => { setActiveTab('Aprovação de Conteúdos'); setReviewingPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                               className="shrink-0 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all"
                             >
                               Revisar <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                             </button>
                           </div>
                         ))
                       }
                     </div>
                   </div>
                 )}

                 {/* Horas de Desenvolvimento */}
                 <div className="bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl p-6">
                   <div className="absolute -top-4 -right-4 opacity-10 rotate-12 p-8">
                     <Code size={140} />
                   </div>
                   <h3 className="text-lg font-black flex items-center relative z-10 font-display mb-8 gap-3 text-left uppercase tracking-tight">
                     <div className="p-1.5 bg-brand-500/20 rounded-lg">
                       <Code size={18} className="text-brand-400" />
                     </div>
                     Banco de Horas DEV
                   </h3>
                   <div className="space-y-6 relative z-10 text-justify md:text-left">
                     <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Horas de Setup (Fixo)</p>
                       <p className="text-3xl font-display font-bold text-white">{targetInitialDevHours}h</p>
                       <p className="text-[11px] text-slate-400 italic mt-2">Ajustes técnicos e instalações base</p>
                     </div>
                     <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Saldo Mensal (Ciclo)</p>
                       <div className="flex items-baseline gap-1">
                         <p className="text-3xl font-display font-bold text-brand-400">{targetDevHours}h</p>
                         <span className="text-xs text-slate-500 italic">Disponíveis</span>
                       </div>
                       <p className="text-[11px] text-slate-400 italic mt-2">Renovação: Dia {currentClientStatus?.billingDay || 10}</p>
                     </div>
                     <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-brand-500 hover:bg-brand-600 transition rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 text-slate-900 py-4 mt-2"
                     >
                       Solicitar Implementação
                     </motion.button>
                   </div>
                 </div>
               </div>
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-aprovação-de-conteúdos"
            role="tabpanel"
            aria-labelledby="tab-aprovação-de-conteúdos"
            hidden={activeTab !== 'Aprovação de Conteúdos'}
          >
            {activeTab === 'Aprovação de Conteúdos' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px] p-4 sm:p-6 overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 text-center md:text-left">Aprovação de Conteúdos</h2>
                   <p className="text-sm font-medium text-slate-500">Avalie os artigos antes da publicação final no seu site.</p>
                 </div>
                 
                 {!reviewingPost && (
                   <div className="flex flex-wrap items-center gap-3">
                     <div className="relative flex-1 min-w-[200px]">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="text"
                         placeholder="Buscar conteúdo..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                       />
                     </div>
                     <div className="flex items-center gap-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Mês Ref.</label>
                       <input 
                         type="month" 
                         value={filterMonth}
                         onChange={(e) => setFilterMonth(e.target.value)}
                         className="border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none px-4 py-2 bg-white shadow-sm"
                       />
                     </div>
                     {(filterMonth || searchTerm) && (
                       <button onClick={() => { setFilterMonth(''); setSearchTerm(''); }} className="text-[10px] font-black text-brand-400 hover:text-brand-600 uppercase tracking-widest px-3">Limpar</button>
                     )}
                   </div>
                 )}
               </div>

               {reviewingPost ? (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-justify md:text-left">
                    <button onClick={() => setReviewingPost(null)} className="text-sm font-bold text-slate-500 flex items-center hover:text-slate-800 transition gap-1">
                      <ChevronDown className="rotate-90" size={16}/> Voltar para lista
                    </button>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] relative p-6 sm:p-10 text-white overflow-hidden shadow-2xl">
                       <h3 className="text-xs font-black text-brand-500 uppercase tracking-[0.3em] mb-8 relative z-10 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                          Escopo Estratégico
                        </h3>
                       <div className="grid sm:grid-cols-2 gap-4 relative z-10 text-left">
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Palavra-chave Foco</span>
                            <p className="text-sm font-bold text-slate-200 tracking-tight">{reviewingPost.focusKeywords || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Âncora de Backup</span>
                            <p className="text-sm font-bold text-slate-200 tracking-tight">{reviewingPost.anchor || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors sm:col-span-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Meta-descrição Estratégica</span>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{reviewingPost.description || '-'}"</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Slug Sugerido</span>
                            <p className="text-sm font-mono text-brand-400">/{reviewingPost.slug || '-'}</p>
                          </div>
                         <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Word Count Real</span>
                            <div className="flex items-baseline gap-2">
                              <p className="text-lg font-black text-white">
                                {reviewingPost.content 
                                  ? reviewingPost.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').trim().split(/\s+/).filter(Boolean).length 
                                  : reviewingPost.wordCount || '0'}
                              </p>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">palavras</span>
                            </div>
                          </div>
                                                   <div className="bg-white/5 rounded-2xl border border-white/5 p-5 hover:bg-white/10 transition-colors sm:col-span-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Diretrizes de Imagem</span>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">{reviewingPost.imagesInfo || 'Nenhuma diretriz específica.'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden break-words p-5 sm:p-12">
                      <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 border-b border-slate-100 break-words mb-8 pb-8 text-center">{reviewingPost.title}</h1>
                      <div className="markdown-body max-w-full overflow-hidden">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{reviewingPost.content}</ReactMarkdown>
                      </div>
                    </div>

                    <PostChat postId={reviewingPost.id} currentUserRole="client" currentUserName={(effectiveClientName || auth.currentUser?.email) as string} />
                     <div className="mt-8 mb-8">
                       <PostHistory postId={reviewingPost.id} />
                     </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6">
                      <label className="block text-sm font-bold text-slate-800 mb-2">Comentários ou Ressalvas (Opcional para aprovação, obrigatório para reprovação)</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Ex: Gostei do artigo, mas acho que faltou mencionar o serviço X da nossa empresa..."
                        className="w-full h-32 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-brand-500 outline-none px-4 py-3"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end border-t border-slate-100 gap-4 pt-8">
                        <button onClick={async () => {
                           if (!reviewComment.trim()) {
                             alert('Por favor, descreva quais ajustes você gostaria de ver no conteúdo.');
                             return;
                           }
                           const confirmReprove = window.confirm('Deseja retornar este conteúdo para a produção? Nossa equipe de redação fará os ajustes solicitados.');
                           if(confirmReprove && reviewingPost?.id) {
                             const path = 'blog_posts';
                             try {
                               await updateDoc(doc(db, path, reviewingPost.id), { 
                                 status: 'Ajustes Necessários', 
                                 clientComment: reviewComment, 
                                 updatedAt: serverTimestamp() 
                               });
                               
                               // Registrar histórico de revisão
                               await addDoc(collection(db, path, reviewingPost.id, 'revisions'), {
                                 status: 'Ajustes Necessários',
                                 author: auth.currentUser?.email || 'Cliente',
                                 comment: reviewComment,
                                 timestamp: serverTimestamp(),
                                 type: 'status_change',
                                 message: 'Ajustes solicitados pelo cliente.'
                               });
                               setReviewingPost(null);
                               setReviewComment('');
                               loadBlogPosts();
                             } catch (err) {
                               handleFirestoreError(err, OperationType.WRITE, path);
                             }
                           }
                        }} className="bg-white text-amber-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-50 transition-all shadow-sm border border-amber-200 text-center px-8 py-5 flex items-center justify-center gap-3 active:scale-95">
                          <RefreshCcw size={16} /> Solicitar Ajustes
                        </button>
                        <button onClick={async () => {
                           const confirmApprove = window.confirm('Tudo certo! Deseja aprovar este conteúdo para publicação?');
                           if(confirmApprove && reviewingPost?.id) {
                             const path = 'blog_posts';
                             try {
                               await updateDoc(doc(db, path, reviewingPost.id), { 
                                 status: 'Aprovado', 
                                 clientComment: reviewComment || '', 
                                 updatedAt: serverTimestamp() 
                               });
                               // Registrar histórico de revisão
                               await addDoc(collection(db, path, reviewingPost.id, 'revisions'), {
                                 status: 'Aprovado',
                                 author: auth.currentUser?.email || 'Cliente',
                                 comment: reviewComment || '',
                                 timestamp: serverTimestamp(),
                                 type: 'status_change',
                                 message: 'Conteúdo aprovado pelo cliente.'
                               });
                               setReviewingPost(null);
                               setReviewComment('');
                               loadBlogPosts();
                             } catch (err) {
                               handleFirestoreError(err, OperationType.WRITE, path);
                             }
                           }
                        }} className="bg-brand-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition shadow-xl shadow-brand-500/20 text-center px-10 py-5 flex items-center justify-center gap-3 active:scale-95">
                          <CheckCircle size={18} /> Aprovar Agora
                        </button>
                     </div>
                 </div>
               ) : (
                 <>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {loadingPosts ? (
                      <div className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={`skel-approval-${i}`} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
                            <Skeleton variant="rectangular" className="h-6 w-32" />
                            <Skeleton variant="rectangular" className="h-8 w-full" />
                            <Skeleton variant="rectangular" className="h-20 w-full" />
                            <Skeleton variant="rectangular" className="h-12 w-full" />
                          </div>
                        ))}
                      </div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).length === 0 ? (
                      <div className="col-span-full text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 py-16">
                        <CheckCircle2 size={56} className="mx-auto text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800 font-display mb-3 text-center">Tudo revisado!</h3>
                        <p className="text-slate-500 text-lg">Nenhum conteúdo aguardando sua aprovação neste momento.</p>
                      </div>
                   ) : filteredBlogPosts.filter(p => p.status === 'Aguardando Aprovação' && (filterMonth ? p.targetMonth === filterMonth : true)).map((post, idx) => (
                     <div key={`approval-post-${post.id || idx}`} className="bg-white rounded-2xl flex flex-col hover:shadow-xl hover:border-brand-200 transition-all p-6 group border border-brand-100">
                       <div className="flex justify-between items-start mb-4">
                         <span className="text-[8px] uppercase tracking-[0.2em] font-black rounded-lg bg-brand-500 text-white px-2.5 py-1.5 shadow-sm">ANÁLISE ESTRATÉGICA</span>
                         {post.remainingApprovalDays !== undefined && (
                           <span className={`text-[9px] font-black uppercase tracking-widest ${
                             Number(post.remainingApprovalDays) <= 1 ? 'text-rose-500 animate-pulse' : 'text-amber-500'
                           }`}>
                             {post.remainingApprovalDays}d restantes
                           </span>
                         )}
                         <span className="text-xs font-medium text-slate-400">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('pt-BR') : ''}</span>
                       </div>
                       <h4 className="font-black text-slate-900 text-lg leading-tight mb-3 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{post.title}</h4>
                       <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-8 text-left font-medium">{post.description}</p>
                       
                       <button onClick={() => setReviewingPost(post)} className="mt-auto w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-brand-600 transition shadow-lg shadow-slate-900/10 active:scale-95">
                         Analisar Estratégia
                       </button>
                     </div>
                   ))}
                 </div>
                 {hasMorePosts && !loadingPosts && (
                   <div className="flex justify-center mt-12 pb-4">
                     <button 
                       onClick={handleLoadMorePosts} 
                       className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 text-slate-600 hover:text-slate-900"
                     >
                       <ChevronDown size={14} className="text-slate-400" />
                       Carregar Mais
                     </button>
                   </div>
                 )}
                 {loadingPosts && postsLimit > 5 && (
                   <div className="flex justify-center mt-12 pb-4">
                     <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-slate-50 text-slate-400">
                       <RefreshCcw size={14} className="animate-spin text-slate-400" />
                       Carregando...
                     </div>
                   </div>
                 )}
                 </>
               )}
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-conteúdos-publicados"
            role="tabpanel"
            aria-labelledby="tab-conteúdos-publicados"
            hidden={activeTab !== 'Conteúdos Publicados'}
          >
            {activeTab === 'Conteúdos Publicados' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px] overflow-hidden relative p-4 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Acervo de <span className="text-brand-500">Publicações</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Artigos que já estão tracionando no seu domínio.</p>
                 </div>

                 <div className="flex flex-wrap items-center gap-3">
                   <div className="relative flex-1 min-w-[200px]">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input 
                       type="text"
                       placeholder="Buscar publicados..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                     />
                   </div>
                   <div className="flex items-center gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Histórico</label>
                     <input 
                       type="month" 
                       value={filterMonth}
                       onChange={(e) => setFilterMonth(e.target.value)}
                       className="border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none px-4 py-2 bg-white shadow-sm"
                     />
                   </div>
                   {(filterMonth || searchTerm) && (
                     <button onClick={() => { setFilterMonth(''); setSearchTerm(''); }} className="text-[10px] font-black text-brand-400 hover:text-brand-600 uppercase tracking-widest px-3">Limpar</button>
                   )}
                 </div>
               </div>

                               <div className="hidden md:block">
                  <HorizontalScroll className="rounded-[2rem] border border-slate-200 animate-in fade-in duration-700 relative z-10">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th scope="col" className="p-6">Estratégia Meta</th>
                          <th scope="col" className="text-center p-6">Data Pub.</th>
                          <th className="text-center p-6">Status</th>
                          <th className="text-right p-6">Direcionamento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBlogPosts.filter(p => p.status === 'Publicado').length === 0 ? (
                          <tr><td colSpan={4} className="text-center text-slate-400/60 font-black uppercase tracking-[0.15em] p-24">Nenhuma publicação encontrada no acervo.</td></tr>
                        ) : filteredBlogPosts.filter(p => p.status === 'Publicado').map((post, idx) => (
                          <tr key={`pub-post-${post.id || idx}`} className="group hover:bg-brand-50/20 transition-all duration-300">
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">{post.title}</span>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest font-mono italic mt-1">KW: {post.focusKeywords || '-'}</span>
                              </div>
                            </td>
                            <td className="text-center p-6">
                               <span className="text-xs font-black text-slate-500 font-mono italic">{post.publishedAt ? new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</span>
                            </td>
                            <td className="text-center p-6">
                               <div className="flex justify-center">
                                 <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm px-3 py-1">
                                   <CheckCircle size={10} strokeWidth={3} /> Ativo & Live
                                 </span>
                               </div>
                            </td>
                            <td className="text-right p-6">
                               <a 
                                 href={post.publishedUrl || '#'} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-all group/link gap-2"
                               >
                                 Ver Artigo no Site <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                               </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </HorizontalScroll>
                </div>
                <div className="md:hidden space-y-4">
                  {filteredBlogPosts.filter(p => p.status === 'Publicado').length === 0 ? (
                    <div className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 font-black uppercase tracking-[0.15em] text-[10px]">
                       Acervo de publicações vazio.
                    </div>
                  ) : filteredBlogPosts.filter(p => p.status === 'Publicado').map((post, idx) => (
                    <div key={`pub-post-mobile-${post.id || idx}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono italic">
                          {post.publishedAt ? new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[8px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5">
                           Ativo & Live
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{post.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KW: {post.focusKeywords || '-'}</p>
                      </div>
                      <a 
                        href={post.publishedUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl gap-2 active:scale-95 transition-transform"
                      >
                        Ver no Site <ArrowUpRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
                {hasMorePosts && !loadingPosts && (
                  <div className="flex justify-center mt-12 pb-4">
                    <button 
                      onClick={handleLoadMorePosts} 
                      className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 text-slate-600 hover:text-slate-900"
                    >
                      <ChevronDown size={14} className="text-slate-400" />
                      Carregar Mais
                    </button>
                  </div>
                )}
                {loadingPosts && postsLimit > 5 && (
                  <div className="flex justify-center mt-12 pb-4">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-slate-50 text-slate-400">
                      <RefreshCcw size={14} className="animate-spin text-slate-400" />
                      Carregando...
                    </div>
                  </div>
                )}
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-backlinks-publicados"
            role="tabpanel"
            aria-labelledby="tab-backlinks-publicados"
            hidden={activeTab !== 'Backlinks Publicados'}
          >
            {activeTab === 'Backlinks Publicados' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-3xl min-h-[500px] overflow-hidden relative p-4 sm:p-10">
               <div className="flex flex-col md:flex-row justify-between md:items-center relative z-10 gap-4 mb-8 lg:mb-12">
                 <div>
                   <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight text-center md:text-left">Relatório de <span className="text-brand-500">Authority Building</span></h2>
                   <p className="text-sm font-medium text-slate-500 lowercase italic mt-1">Backlinks e citações de PR que fortalecem seu domínio.</p>
                 </div>
               </div>

                               <div className="hidden md:block">
                  <HorizontalScroll className="rounded-[2rem] border border-slate-200 relative z-10">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th scope="col" className="p-6">Veículo / Âncora</th>
                          <th scope="col" className="text-center p-6">Data Entrega</th>
                          <th className="text-center p-6">Status</th>
                          <th className="text-right p-6">Direcionamento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBacklinks.filter(b => b.status === 'Publicado').length === 0 ? (
                          <tr><td colSpan={4} className="text-center text-slate-400/60 font-black uppercase tracking-[0.15em] p-24">Nenhum rastro de backlink registrado.</td></tr>
                        ) : filteredBacklinks.filter(b => b.status === 'Publicado').map((link, idx) => (
                          <tr key={`pub-backlink-${link.id || idx}`} className="group hover:bg-emerald-50/20 transition-all duration-300">
                            <td className="p-6">
                               <div className="flex flex-col">
                                 <span className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{link.title}</span>
                                 <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest font-mono italic mt-1">Texto Âncora: {link.focusKeywords || '-'}</span>
                               </div>
                            </td>
                            <td className="text-center p-6">
                               <span className="text-xs font-black text-slate-500 font-mono italic">{link.publishedAt ? new Date(link.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</span>
                            </td>
                            <td className="text-center p-6">
                               <div className="flex justify-center">
                                 <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm px-3 py-1">
                                   <CheckCircle size={10} strokeWidth={3} /> Link Ativo
                                 </span>
                               </div>
                            </td>
                            <td className="text-right p-6">
                               <a 
                                 href={link.publishedUrl || '#'} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all group/link gap-2"
                               >
                                 Ver Backlink <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                               </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </HorizontalScroll>
                </div>
                <div className="md:hidden space-y-4">
                  {filteredBacklinks.filter(b => b.status === 'Publicado').length === 0 ? (
                    <div className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 font-black uppercase tracking-[0.15em] text-[10px]">
                      Nenhum backlink ativo no momento.
                    </div>
                  ) : filteredBacklinks.filter(b => b.status === 'Publicado').map((link, idx) => (
                    <div key={`pub-link-mobile-${link.id || idx}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono italic">
                          {link.publishedAt ? new Date(link.publishedAt + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[8px] uppercase font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5">
                           Link Ativo
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{link.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">Texto Âncora: {link.focusKeywords || '-'}</span>
                        </div>
                      </div>
                      <a 
                        href={link.publishedUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl gap-2 active:scale-95 transition-transform"
                      >
                        Ver Backlink <ArrowUpRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
                {hasMoreBacklinks && !loadingBacklinks && (
                  <div className="flex justify-center mt-12 pb-4">
                    <button 
                      onClick={handleLoadMoreBacklinks} 
                      className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 text-slate-600 hover:text-slate-900"
                    >
                      <ChevronDown size={14} className="text-slate-400" />
                      Carregar Mais
                    </button>
                  </div>
                )}
                {loadingBacklinks && backlinksLimit > 5 && (
                  <div className="flex justify-center mt-12 pb-4">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-slate-50 text-slate-400">
                      <RefreshCcw size={14} className="animate-spin text-slate-400" />
                      Carregando...
                    </div>
                  </div>
                )}
            </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-estratégia-de-palavras"
            role="tabpanel"
            aria-labelledby="tab-estratégia-de-palavras"
            hidden={activeTab !== 'Estratégia de Palavras'}
          >
            {activeTab === 'Estratégia de Palavras' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
                {/* Header & Search Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 lg:p-8 overflow-hidden">
                  <div className="flex flex-col gap-6">
                    {/* Title and subtitle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
                          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight uppercase leading-none">
                            Estratégia de <span className="text-brand-500">Palavras-chave</span>
                          </h2>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-[18px]">
                          Universo Semântico & Planejamento Estratégico de SEO.
                        </p>
                      </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                      <div className="relative group/search flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-brand-600 transition-colors" size={16} />
                        <input 
                          type="text"
                          placeholder="Buscar estratégias..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                        />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                          <div className="pl-3 pr-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] block leading-none">Mês Ref.</label>
                          </div>
                          <div className="relative bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <input 
                              type="month" 
                              value={filterMonth}
                              onChange={(e) => setFilterMonth(e.target.value)}
                              className="bg-transparent border-0 text-xs font-black uppercase tracking-wider focus:ring-0 outline-none px-4 py-2 text-slate-700 cursor-pointer"
                            />
                          </div>
                        </div>

                        {(filterMonth || searchTerm) && (
                          <button 
                            onClick={() => { setFilterMonth(''); setSearchTerm(''); }} 
                            className="px-6 py-3.5 text-[10px] font-black text-rose-500 hover:text-white hover:bg-rose-500 uppercase tracking-[0.2em] rounded-2xl border border-rose-100 bg-rose-50/30 transition-all active:scale-95 shadow-sm"
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keywords Table */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-brand-500" />
                    Palavras-chave Planejadas
                  </h3>
                  <div className="hidden md:block">
                    <HorizontalScroll className="rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm bg-white">
                      <table className="w-[1000px] lg:w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            <th className="px-8 py-6">Cliente</th>
                            <th scope="col" className="px-8 py-6">Mês Planejado</th>
                            <th className="px-8 py-6">Palavra-chave</th>
                            <th className="px-8 py-6 text-center">Volume</th>
                            <th className="px-8 py-6 text-center">KD</th>
                            <th className="px-8 py-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredKeywords.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-400/60 font-black uppercase tracking-[0.15em] p-24">Nenhuma palavra planejada para este ciclo.</td></tr>
                          ) : filteredKeywords.sort((a,b) => (b.targetMonth || '').localeCompare(a.targetMonth || '')).map((kw, idx) => (
                            <tr key={`kw-universe-${kw.id || idx}`} className="hover:bg-slate-50 transition group">
                              <td className="text-[11px] font-bold text-slate-900 px-8 py-5 border-r border-slate-50">{kw.clientName || '-'}</td>
                              <td className="text-xs font-bold text-brand-600 px-8 py-5">{formatCycleDate(kw.targetMonth) || '-'}</td>
                              <td className="text-sm font-bold text-slate-800 px-8 py-5 group-hover:text-brand-600 transition-all font-display tracking-tight leading-none group-hover:scale-[1.01] origin-left">{kw.keyword || '-'}</td>
                              <td className="text-sm font-black text-slate-700 px-8 py-5 text-center">{kw.searchVolume || '-'}</td>
                              <td className="text-sm font-black text-slate-700 px-8 py-5 text-center">{kw.difficulty || '-'}</td>
                              <td className="px-8 py-5 text-center">
                                <span className="inline-block text-[10px] uppercase font-black py-1.5 rounded-lg bg-slate-100 text-slate-500 px-3 transition-colors">{kw.status || 'Disponível'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </HorizontalScroll>
                  </div>
                  {/* Mobile Mobile Keywords */}
                  <div className="md:hidden space-y-4">
                    {filteredKeywords.length === 0 ? (
                      <div className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 font-black uppercase tracking-[0.15em] text-[10px]">Pautas do universo ainda não iniciadas.</div>
                    ) : filteredKeywords.sort((a,b) => (b.targetMonth || '').localeCompare(a.targetMonth || '')).map((kw, idx) => (
                      <div key={`kw-mobile-${kw.id || idx}`} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatCycleDate(kw.targetMonth) || '-'}</span>
                           <span className="inline-block text-[9px] uppercase font-black py-1 rounded bg-slate-100 text-slate-500 px-2">{kw.status || 'Disponível'}</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tight leading-tight mb-1">{kw.keyword || '-'}</p>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                             <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">{kw.clientName || '-'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                            <p className="text-xs font-black text-slate-900">{kw.searchVolume || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">KD</p>
                            <p className="text-xs font-black text-slate-900">{kw.difficulty || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backlinks Table */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-brand-500" />
                    Backlinks Programados
                  </h3>
                  <div className="hidden md:block">
                    <HorizontalScroll className="rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm bg-white">
                      <table className="w-[1000px] lg:w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            <th scope="col" className="px-8 py-6">Cliente</th>
                            <th scope="col" className="px-8 py-6">Âncora</th>
                            <th scope="col" className="px-8 py-6">Destino</th>
                            <th scope="col" className="px-8 py-6">Keywords</th>
                            <th scope="col" className="px-8 py-6 w-64">Tema</th>
                            <th scope="col" className="px-8 py-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredBacklinks.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-400/60 font-black uppercase tracking-[0.15em] p-24">Nenhum backlink planejado.</td></tr>
                          ) : filteredBacklinks.map((link, idx) => (
                            <tr key={`all-backlink-${link.id || idx}`} className="hover:bg-slate-50 transition border-l-4 group" style={{borderLeftColor: link.status === 'Publicado' ? '#10b981' : link.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}}>
                              <td className="text-[11px] font-black text-slate-900 px-8 py-5 border-r border-slate-100">{link.clientName || '-'}</td>
                              <td className="text-sm font-bold text-slate-800 px-8 py-5 uppercase font-mono">{link.anchor || '-'}</td>
                              <td className="text-[11px] text-blue-600 hover:underline px-8 py-5 font-mono lowercase truncate max-w-[150px]">
                                <a href={link.targetUrl || '#'} target="_blank" rel="noopener noreferrer">{link.targetUrl || '-'}</a>
                              </td>
                              <td className="text-xs text-slate-600 px-8 py-5 italic">{link.focusKeywords || '-'}</td>
                              <td className="text-xs text-slate-500 px-8 py-5 leading-relaxed"><div className="line-clamp-2">{link.theme || '-'}</div></td>
                              <td className="px-8 py-5 text-center">
                                <span className={`inline-block text-[10px] uppercase font-black px-3 py-1.5 rounded-lg ${
                                 link.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                                 link.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                                 link.status === 'Agendado' ? 'bg-indigo-100 text-indigo-700' :
                                 link.status === 'Aguardando Aprovação' ? 'bg-amber-100 text-amber-700' :
                                 link.status === 'Reprovado' ? 'bg-rose-100 text-rose-700' :
                                 'bg-slate-100 text-slate-500'
                                }`}>{link.status || 'Planejado'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </HorizontalScroll>
                  </div>
                  {/* Mobile Backlinks */}
                  <div className="md:hidden space-y-4">
                    {filteredBacklinks.length === 0 ? (
                      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 text-center text-slate-500 text-xs">Nenhum backlink planejado.</div>
                    ) : filteredBacklinks.map((link, idx) => (
                      <div key={`planned-link-mobile-${link.id || idx}`} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4" style={{borderLeft: `4px solid ${link.status === 'Publicado' ? '#10b981' : link.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}`}}>
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{link.clientName || '-'}</span>
                           <span className={`text-[9px] uppercase font-black px-2 py-1 rounded-lg ${
                             link.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                             link.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                             'bg-slate-100 text-slate-500'
                           }`}>{link.status || 'Planejado'}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Âncora & Destino</p>
                          <p className="text-sm font-black text-slate-900 mb-1 leading-tight uppercase font-mono">{link.anchor || '-'}</p>
                          <a href={link.targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline truncate block lowercase font-mono">{link.targetUrl || '-'}</a>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estratégia</p>
                          <p className="text-[11px] text-slate-600 line-clamp-3 italic leading-relaxed">Tema: {link.theme || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blog Articles Table */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-brand-500" />
                    Artigos de Blog
                  </h3>
                  <div className="hidden md:block">
                    <HorizontalScroll className="rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm bg-white">
                      <table className="w-[1000px] lg:w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            <th scope="col" className="px-8 py-6">Cliente</th>
                            <th scope="col" className="px-8 py-6">Keywords</th>
                            <th scope="col" className="px-8 py-6">Linkagem</th>
                            <th scope="col" className="px-8 py-6 w-64">Tema</th>
                            <th scope="col" className="px-8 py-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredBlogPosts.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-slate-400/60 font-black uppercase tracking-[0.15em] p-24">Nenhum post planejado.</td></tr>
                          ) : filteredBlogPosts.map((post, idx) => (
                            <tr key={`all-post-${post.id || idx}`} className="hover:bg-slate-50 transition border-l-4 group" style={{borderLeftColor: post.status === 'Publicado' ? '#10b981' : post.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}}>
                              <td className="text-[11px] font-bold text-indigo-900 px-8 py-5 border-r border-slate-50">{post.clientName || '-'}</td>
                              <td className="text-sm font-bold text-slate-800 px-8 py-5 uppercase italic">{post.focusKeywords || '-'}</td>
                              <td className="text-xs text-slate-600 px-8 py-5"><div className="w-48 truncate">{post.internalLinking || '-'}</div></td>
                              <td className="text-xs text-slate-500 px-8 py-5 leading-relaxed"><div className="line-clamp-2">{post.theme || '-'}</div></td>
                              <td className="px-8 py-5 text-center">
                                <span className={`inline-block text-[10px] uppercase font-black px-3 py-1.5 rounded-lg ${
                                 post.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                                 post.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                                 post.status === 'Agendado' ? 'bg-indigo-100 text-indigo-700' :
                                 post.status === 'Aguardando Aprovação' ? 'bg-amber-100 text-amber-700' :
                                 post.status === 'Reprovado' ? 'bg-rose-100 text-rose-700' :
                                 'bg-slate-100 text-slate-500'
                                }`}>{post.status || 'Planejado'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </HorizontalScroll>
                  </div>
                  {/* Mobile Articles */}
                  <div className="md:hidden space-y-4">
                    {filteredBlogPosts.length === 0 ? (
                      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 text-center text-slate-500 text-xs">Nenhum post planejado.</div>
                    ) : filteredBlogPosts.map((post, idx) => (
                      <div key={`planned-post-mobile-${post.id || idx}`} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4" style={{borderLeft: `4px solid ${post.status === 'Publicado' ? '#10b981' : post.status === 'Aprovado' ? '#3b82f6' : '#e2e8f0'}`}}>
                          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                             <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{post.clientName || '-'}</span>
                             <span className={`text-[9px] uppercase font-black px-2 py-1 rounded-lg ${
                               post.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' : 
                               post.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                               'bg-slate-100 text-slate-500'
                             }`}>{post.status || 'Planejado'}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Palavra-Chave Principal</p>
                            <p className="text-sm font-black text-slate-900 mb-1 leading-tight uppercase font-display italic">{post.focusKeywords || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tema Estratégico</p>
                            <p className="text-[11px] text-slate-600 line-clamp-3 italic leading-relaxed">{post.theme || '-'}</p>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div 
            id="panel-suporte"
            role="tabpanel"
            aria-labelledby="tab-suporte"
            hidden={activeTab !== 'Suporte'}
          >
            {activeTab === 'Suporte' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-left"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Precisa de Ajuda ou Suporte Técnico?</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Abra um chamado ou mande suas dúvidas para nossa equipe de SEO.</p>
                  </div>
                  <button 
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-6 py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-brand-700 transition shadow-lg shadow-brand-500/10 active:scale-95 select-none"
                  >
                    Abrir Novo Chamado
                  </button>
                </div>

                {loadingTickets ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-3xl" />
                    <Skeleton className="h-24 w-full rounded-3xl" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <MessageSquareText size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Nenhum chamado aberto</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">Você ainda não enviou nenhuma mensagem de suporte ou dúvida técnica.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Ticket List (Left Col) */}
                    <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Suas Conversas</p>
                      <div className="space-y-3">
                        {tickets.map((t: any) => {
                          const isSelected = selectedTicket?.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => handleSelectTicket(t)}
                              className={`w-full text-left p-6 rounded-[2rem] border transition-all relative ${
                                isSelected 
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              {t.unreadByClient && (
                                <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                              )}
                              <div className="pr-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-md ${
                                    t.status === 'pending' 
                                      ? 'bg-amber-100 text-amber-700' 
                                      : t.status === 'answered' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {t.status === 'pending' 
                                      ? 'Pendente' 
                                      : t.status === 'answered' 
                                        ? 'Respondido' 
                                        : 'Fechado'}
                                  </span>
                                  <span className={`text-[9px] font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                    {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString('pt-BR') : ''}
                                  </span>
                                </div>
                                <h4 className="text-sm font-black truncate leading-tight uppercase tracking-tight">{t.subject}</h4>
                                <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {t.lastMessage || 'Sem mensagens...'}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Conversation Area (Right Col) */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col h-[550px] shadow-sm">
                      {selectedTicket ? (
                        <>
                          {/* Ticket Header */}
                          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedTicket.subject}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 font-mono">
                                ID: #{selectedTicket.id.substring(0, 8)} • Status:{' '}
                                <span className="font-black text-brand-600">
                                  {selectedTicket.status === 'pending'
                                    ? 'AGUARDANDO RETORNO'
                                    : selectedTicket.status === 'answered'
                                      ? 'DÚVIDA RESPONDIDA'
                                      : 'RESOLVIDO'}
                                </span>
                              </p>
                            </div>
                            {selectedTicket.status !== 'closed' && (
                              <button 
                                onClick={async () => {
                                  try {
                                    await updateDoc(doc(db, 'support_tickets', selectedTicket.id), {
                                      status: 'closed',
                                      updatedAt: serverTimestamp()
                                    });
                                    addToast('Chamado fechado com sucesso!', 'success');
                                    setSelectedTicket(prev => ({...prev, status: 'closed'}));
                                    fetchTickets();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider transition"
                              >
                                Resolver Chamado
                              </button>
                            )}
                          </div>

                          {/* Message List */}
                          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                            {ticketMessages.map((m: any) => {
                              const isMsgAdmin = m.senderRole === 'admin';
                              return (
                                <div 
                                  key={m.id}
                                  className={`flex flex-col max-w-[80%] ${isMsgAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                                >
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                                    {m.senderName} ({isMsgAdmin ? 'Equipe Acelera SEO' : 'Você'})
                                  </span>
                                  <div className={`p-4 rounded-3xl text-sm ${
                                    isMsgAdmin 
                                      ? 'bg-white border border-slate-200 text-slate-850 rounded-tl-none font-medium' 
                                      : 'bg-brand-600 text-white rounded-tr-none font-medium text-left'
                                  }`}>
                                    <p className="leading-relaxed whitespace-pre-line">{m.message}</p>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-400 mt-1 px-1">
                                    {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Input Bar */}
                          {selectedTicket.status === 'closed' ? (
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-center font-black text-[10px] uppercase text-slate-400 tracking-wider">
                              Este chamado foi encerrado pelo cliente.
                            </div>
                          ) : (
                            <div className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
                              <textarea
                                rows={1}
                                value={chatMessageText}
                                onChange={e => setChatMessageText(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                  }
                                }}
                                placeholder="Escreva sua mensagem ou dúvida..."
                                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 max-h-24 resize-none"
                              />
                              <button
                                disabled={sendingMessage || !chatMessageText.trim()}
                                onClick={handleSendMessage}
                                className="p-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-2xl transition shadow-lg active:scale-95"
                              >
                                <ArrowRight size={18} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                          <MessageSquareText size={32} className="stroke-[1.5] text-slate-300 mb-3" />
                          <p className="text-xs uppercase font-black tracking-widest">Selecione uma conversa ao lado</p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-sm">Consulte o histórico ou responda as mensagens da nossa equipe clicando em um chamado.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
      </div>
              </>
            )}
    </div>
  </div>
</main>

{/* Declare Payment Modal */}
{showDeclarePayment && (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeclarePayment(false)} />
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
    >
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Declarar Pagamento</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informe os detalhes para confirmação</p>
        </div>
        <button onClick={() => setShowDeclarePayment(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleDeclarePayment} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
              <input 
                type="number" 
                step="0.01"
                required
                value={declarePaymentForm.amount}
                onChange={e => setDeclarePaymentForm({...declarePaymentForm, amount: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-10 py-4 text-sm font-black focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vencimento Ref.</label>
            <input 
              type="month" 
              required
              value={declarePaymentForm.paymentMonth}
              onChange={e => setDeclarePaymentForm({...declarePaymentForm, paymentMonth: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-black focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Data que pagou</label>
          <input 
            type="date" 
            required
            value={declarePaymentForm.paymentDate}
            onChange={e => setDeclarePaymentForm({...declarePaymentForm, paymentDate: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-black focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Observação (Opcional)</label>
          <textarea 
            rows={2}
            value={declarePaymentForm.description}
            onChange={e => setDeclarePaymentForm({...declarePaymentForm, description: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none resize-none"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          Confirmar Declaração
        </button>
      </form>
    </motion.div>
  </div>
)}

{/* New Support Ticket Modal */}
{showNewTicketModal && (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowNewTicketModal(false)} />
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 text-left"
    >
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Novo Chamado</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Abra uma nova dúvida ou chamado técnico</p>
        </div>
        <button onClick={() => setShowNewTicketModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Assunto / Tópico</label>
          <input 
            type="text" 
            required
            placeholder="Ex: Dúvida sobre palavra-chave ou correção técnica"
            value={newTicketSubject}
            onChange={e => setNewTicketSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem Inicial</label>
          <textarea 
            rows={4}
            required
            placeholder="Detalhe sua solicitação de suporte de forma completa..."
            value={newTicketMessage}
            onChange={e => setNewTicketMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-semibold focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none resize-none"
          />
        </div>

        <button 
          disabled={submittingTicket || !newTicketSubject.trim() || !newTicketMessage.trim()}
          onClick={handleCreateTicket}
          className="w-full py-5 bg-slate-900 hover:bg-brand-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          {submittingTicket ? 'Abrindo chamado...' : 'Abrir Chamado'}
        </button>
      </div>
    </motion.div>
  </div>
)}

<ToastContainer toasts={toasts} removeToast={removeToast} />
</div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  role: 'agency' | 'client';
  message: string;
  createdAt: number;
}

export default function PostChat({ postId, currentUserRole, currentUserName, addToast }: { postId: string, currentUserRole: 'agency'|'client', currentUserName: string, addToast?: (msg: string, type: any) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postId) return;
    const unsub = onSnapshot(doc(db, 'blog_posts', postId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.chatHistory || []);
      }
    });
    return () => unsub();
  }, [postId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newMessage.trim() || !postId) return;

    const msg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      user: currentUserName || (currentUserRole === 'agency' ? 'Agência' : 'Cliente'),
      role: currentUserRole,
      message: newMessage.trim(),
      createdAt: Date.now()
    };

    try {
      setNewMessage('');
      await updateDoc(doc(db, 'blog_posts', postId), {
        chatHistory: arrayUnion(msg)
      });
    } catch (error) {
      console.error(error);
      if (addToast) {
        addToast('Erro ao enviar mensagem.', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h3 className="font-bold text-slate-800">Discussão do Artigo</h3>
        <p className="text-xs text-slate-500">Alinhamento entre agência e cliente</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            Nenhuma mensagem ainda. Inicie a conversa!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.role === currentUserRole;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`text-[10px] font-bold mb-1 ${isMe ? 'text-brand-600' : 'text-slate-500'}`}>
                  {msg.user} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                  isMe 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend(e);
          }
        }} 
        className="bg-white border-t border-slate-200 p-4 flex gap-2"
      >
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button 
          type="button" 
          onClick={handleSend}
          disabled={!newMessage.trim()} 
          className="w-10 h-10 flex items-center justify-center bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

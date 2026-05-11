import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Clock, CheckCircle, RefreshCcw, Send, MessageSquareText } from 'lucide-react';

interface Revision {
  id: string;
  status: string;
  author: string;
  comment?: string;
  timestamp: any;
  type: string;
  message: string;
}

export default function PostHistory({ postId }: { postId: string }) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, 'blog_posts', postId, 'revisions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Revision[];
      setRevisions(revs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  if (loading) return null;
  if (revisions.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircle size={14} className="text-emerald-500" />;
      case 'Ajustes Necessários':
        return <RefreshCcw size={14} className="text-rose-500" />;
      case 'Aguardando Aprovação':
        return <Send size={14} className="text-amber-500" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
          <Clock size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Histórico de Atividades</h4>
      </div>

      <div className="space-y-6">
        {revisions.map((rev, index) => (
          <div key={rev.id} className="relative pl-8 group">
            {/* Line connecting dots */}
            {index !== revisions.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-slate-50 group-hover:bg-brand-100 transition-colors" />
            )}
            
            {/* Dot/Icon */}
            <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center z-10 group-hover:border-brand-200 transition-colors">
              {getStatusIcon(rev.status)}
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{rev.message}</span>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                  {rev.timestamp?.toDate ? rev.timestamp.toDate().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Simulando...'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[8px] text-slate-400 uppercase">
                  {rev.author.charAt(0)}
                </div>
                <span className="text-[9px] font-bold text-slate-400">{rev.author}</span>
              </div>

              {rev.comment && (
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2 relative">
                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 rotate-45" />
                  <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

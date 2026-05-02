import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export function ContentAgency({ 
  blogPosts, backlinks, setPostForm, setShowPostForm, setBacklinkForm, setShowBacklinkForm, 
  handleDeletePost, handleDeleteBacklink, loadBlogPosts, loadBacklinks
}: any) {

  const agencyPosts = blogPosts.filter((p:any) => p.clientName === 'Agência' || p.clientName === '');
  const agencyBacklinks = backlinks.filter((b:any) => b.clientName === 'Agência' || b.clientName === '');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">Blog Acelera SEO</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Gestão de autoridade e conteúdo proprietário.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => {
              setPostForm({ id: '', title: '', clientName: 'Agência', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: '', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
              setShowPostForm(true);
            }} className="bg-brand-600 text-white font-bold px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95">
              Novo Artigo (Agência)
            </button>
            <button onClick={() => {
              setBacklinkForm({ id: '', title: '', clientName: 'Agência', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
              setShowBacklinkForm(true);
            }} className="bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
              Novo Backlink (Agência)
            </button>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-100"></div>
              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Artigos do Blog</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {agencyPosts.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                  <p className="text-slate-400 font-medium italic text-sm">Nenhum artigo proprietário encontrado.</p>
                </div>
              )}
              {agencyPosts.map((post:any) => (
                 <motion.div 
                   key={post.id} 
                   whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                   className="border border-slate-200 rounded-[2rem] p-6 flex flex-col transition-all duration-300 bg-white group"
                 >
                   <div className="flex justify-between items-start mb-4">
                      <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-lg tracking-[0.1em] ${
                        post.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        post.status === 'Rascunho' ? 'bg-slate-50 text-slate-500 border border-slate-100' :
                        'bg-brand-50 text-brand-600 border border-brand-100'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{post.targetMonth || 'Sem Data'}</span>
                   </div>
                   <h4 className="font-extrabold text-slate-900 mb-2 leading-tight font-display text-lg tracking-tight group-hover:text-brand-600 transition-colors">{post.title}</h4>
                   <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">{post.description}</p>
                   
                   <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                       <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-[10px] font-black text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest">Editar</button>
                       <button onClick={() => { if (post.id) handleDeletePost(post.id, post.coverImage); }} className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest">Excluir</button>
                     </div>
                     
                     <div className="flex items-center gap-2">
                       {['Aprovado', 'Aprovado com Ressalvas', 'Planejado', 'Rascunho'].includes(post.status) && (
                         <button onClick={async () => {
                           if (!post.id) return;
                           const url = window.prompt("URL da publicação:");
                           if (url) {
                             await updateDoc(doc(db, 'blog_posts', post.id), { status: 'Publicado', publishedUrl: url, publishedAt: new Date().toISOString().split('T')[0], updatedAt: serverTimestamp() });
                             loadBlogPosts();
                           }
                         }} className="h-8 w-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100" title="Marcar como publicado">
                           <CheckCircle size={16}/>
                         </button>
                       )}
                       <a href={post.publishedUrl || `/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-brand-600 rounded-xl transition-all border border-slate-100 shadow-sm" title="Ver artigo">
                         <ArrowUpRight size={16} />
                       </a>
                     </div>
                   </div>
                 </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-100"></div>
              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Backlinks & Guest Posts</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencyBacklinks.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-3xl border border-slate-200 border-dashed">
                  <p className="text-slate-400 font-medium italic text-sm">Nenhum backlink ou guest post registrado.</p>
                </div>
              )}
              {agencyBacklinks.map((backlink:any) => (
                 <div key={backlink.id} className="border border-slate-200 rounded-3xl p-6 flex flex-col hover:border-slate-300 transition-all bg-slate-50/30 group">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-lg bg-white text-slate-500 border border-slate-200 tracking-wider font-display">{backlink.status}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{backlink.targetMonth || '-'}</span>
                   </div>
                   <h4 className="font-bold text-slate-900 mb-2 leading-tight text-lg tracking-tight font-display">{backlink.title}</h4>
                   <div className="flex items-center gap-2 mb-6">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ancora:</span>
                     <span className="text-xs font-bold text-brand-600">{backlink.focusKeywords || '-'}</span>
                   </div>
                   
                   <div className="mt-auto pt-5 border-t border-slate-200/60 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                       <button onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} className="text-[10px] font-black text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest">Editar</button>
                       <button onClick={() => handleDeleteBacklink(backlink.id)} className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest">Excluir</button>
                     </div>
                     {backlink.publishedUrl && (
                       <a href={backlink.publishedUrl} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-white text-slate-400 hover:text-slate-900 rounded-xl transition-all border border-slate-200 shadow-sm">
                         <ArrowUpRight size={14} />
                       </a>
                     )}
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle, FileText, Plus } from 'lucide-react';
import { db } from '../firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export function ContentAgency({ 
  blogPosts, backlinks, setPostForm, setShowPostForm, setBacklinkForm, setShowBacklinkForm, 
  handleDeletePost, handleDeleteBacklink, loadBlogPosts, loadBacklinks
}: any) {

  const agencyPosts = blogPosts.filter((p:any) => p.clientName === 'Agência' || p.clientName === '');
  const agencyBacklinks = backlinks.filter((b:any) => b.clientName === 'Agência' || b.clientName === '');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">Blog Acelera</h2>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              Gestão de autoridade e conteúdo proprietário
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => {
              setPostForm({ id: '', title: '', clientName: 'Agência', clientEmail: '', targetMonth: '', slug: '', description: '', content: '', coverImage: '', category: 'Geral', focusKeywords: '', anchor: '', seoTitle: '', wordCount: '', targetWords: '', imagesInfo: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', internalLinking: '', theme: '', secondaryKeywords: '', directioning: '' });
              setShowPostForm(true);
            }} className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl hover:bg-slate-800 transition-all px-8 py-4 shadow-xl shadow-slate-200 active:scale-95">
              Novo Artigo Proprietário
            </button>
            <button onClick={() => {
              setBacklinkForm({ id: '', title: '', clientName: 'Agência', clientEmail: '', targetMonth: '', focusKeywords: '', anchor: '', targetUrl: '', theme: '', directioning: '', content: '', status: 'Rascunho', publishedAt: '', publishedUrl: '', wordCount: '', targetWords: '' });
              setShowBacklinkForm(true);
            }} className="bg-white border border-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl hover:bg-slate-50 transition-all px-8 py-4 shadow-sm active:scale-95">
              Backlink Off-page
            </button>
          </div>
        </div>

        <div className="space-y-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-[2px] w-8 bg-slate-900"></div>
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                 Fluxo de Conteúdo Proprietário
               </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencyPosts.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-100">
                  <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.15em]">Nenhum artigo proprietário na esteira</p>
                </div>
              ) : agencyPosts.map((post:any) => (
                 <motion.div 
                   key={post.id} 
                   whileHover={{ y: -4 }}
                   className="bg-white border border-slate-100 rounded-[24px] p-6 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                 >
                   <div className="absolute -top-6 -right-6 p-6 opacity-[0.02] group-hover:scale-150 transition-transform duration-700 pointer-events-none group-hover:opacity-[0.05] text-slate-900">
                     <FileText size={140} />
                   </div>

                   <div className="flex justify-between items-center mb-5 relative z-10">
                      <div className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] border flex items-center gap-2 ${
                        post.status === 'Publicado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' :
                        post.status === 'Rascunho' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                        'bg-brand-50 text-brand-600 border-brand-100/50'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Publicado' ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'}`}></div>
                        {post.status}
                      </div>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.1em] italic transition-colors group-hover:text-slate-400">{post.targetMonth || 'Fluxo'}</span>
                   </div>

                   <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-brand-600 transition-colors relative z-10 uppercase">{post.title}</h4>
                   <p className="text-xs text-slate-400 mb-8 line-clamp-3 leading-relaxed font-medium relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">{post.description || 'Nenhuma descrição estratégica providenciada.'}</p>
                   
                   <div className="pt-5 border-t border-slate-50 flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                       <button onClick={() => { setPostForm(post); setShowPostForm(true); }} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.15em]">REVISAR</button>
                       <button onClick={() => { if (post.id && confirm('Confirmar exclusão?')) handleDeletePost(post.id, post.coverImage); }} className="text-[9px] font-bold text-slate-200 hover:text-rose-500 transition-colors uppercase tracking-[0.15em]">EXCLUIR</button>
                     </div>
                     
                     <div className="flex items-center gap-2">
                       {['Aprovado', 'Aprovado com Ressalvas', 'Planejado', 'Rascunho'].includes(post.status) && (
                         <button onClick={async () => {
                           if (!post.id) return;
                           const url = window.prompt("URL da publicação final:");
                           if (url) {
                             await updateDoc(doc(db, 'blog_posts', post.id), { status: 'Publicado', publishedUrl: url, publishedAt: new Date().toISOString().split('T')[0], updatedAt: serverTimestamp() });
                             loadBlogPosts();
                           }
                         }} className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm active:scale-90" title="Finalizar Publicação">
                           <CheckCircle size={18}/>
                         </button>
                       )}
                       <a href={post.publishedUrl || `/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-brand-600 hover:bg-white rounded-xl transition-all border border-slate-100 shadow-sm active:scale-90" title="Visualizar Ativo">
                         <ArrowUpRight size={18} />
                       </a>
                     </div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <div>
             <div className="flex items-center gap-4 mb-8">
               <div className="h-[2px] w-8 bg-violet-400"></div>
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                 Estratégia de Autoridade & Backlinks
               </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agencyBacklinks.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-100">
                  <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.15em]">Nenhum backlink registrado p/ agência</p>
                </div>
              ) : agencyBacklinks.map((backlink:any) => (
                 <motion.div key={backlink.id} whileHover={{ y: -4 }} className="bg-slate-50/30 border border-slate-100 rounded-[24px] p-8 hover:bg-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="px-3 py-1 rounded-lg bg-white text-slate-400 text-[8px] font-bold uppercase tracking-[0.1em] border border-slate-100 group-hover:text-violet-600 group-hover:border-violet-100 transition-all shadow-sm">{backlink.status}</div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em] italic group-hover:text-slate-400 transition-colors uppercase">{backlink.targetMonth || '-'}</span>
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-5 tracking-tight leading-tight group-hover:text-violet-600 transition-colors relative z-10 uppercase">{backlink.title}</h4>
                   <div className="flex items-center gap-3 mb-8 relative z-10">
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em]">ÂNCORA:</span>
                     <span className="text-[10px] font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{backlink.focusKeywords || '-'}</span>
                   </div>
                   
                   <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-6">
                       <button onClick={() => { setBacklinkForm(backlink); setShowBacklinkForm(true); }} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.15em]">EDITAR</button>
                       <button onClick={() => { if(confirm('Excluir?')) handleDeleteBacklink(backlink.id); }} className="text-[9px] font-bold text-slate-200 hover:text-rose-500 transition-colors uppercase tracking-[0.15em]">EXCLUIR</button>
                     </div>
                     {backlink.publishedUrl && (
                       <a href={backlink.publishedUrl} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center bg-white text-slate-300 hover:text-violet-600 rounded-xl transition-all border border-slate-100 shadow-sm active:scale-95">
                         <ArrowUpRight size={18} />
                       </a>
                     )}
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

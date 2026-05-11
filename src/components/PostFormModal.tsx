import React, { useRef, useMemo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import Skeleton from './ui/Skeleton';
const ReactQuill = lazy(() => import('react-quill-new'));
import 'react-quill-new/dist/quill.snow.css';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import YoastTrafficLight from './YoastTrafficLight';
import PostChat from './PostChat';
import PostHistory from './PostHistory';
import { FileUploader } from './FileUploader';
import { Users, FileText, X, Activity, Calendar, MessageSquareText } from 'lucide-react';

export function PostFormModal({ 
  postForm, setPostForm, showPostForm, setShowPostForm, handleSavePost, handleSaveDraft, clientsList, categories = [], isSaving, addToast
}: any) {
  const quillRef = useRef<any>(null);
  const internalIsSaving = useRef(false);

  React.useEffect(() => {
    if (showPostForm && postForm.content) {
      const val = postForm.content;
      const stripped = val.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');
      const words = stripped.trim().split(/\s+/).filter(Boolean).length;
      setPostForm((prev: any) => ({ ...prev, wordCount: `${words} palavras` }));
    }
  }, [showPostForm]);

  const handleDraftClick = async () => {
    if (internalIsSaving.current || isSaving) return;
    internalIsSaving.current = true;
    await handleSaveDraft();
    internalIsSaving.current = false;
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/webp');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      if (file.type !== 'image/webp') {
        addToast('Por favor, envie apenas imagens no formato WEBP.', 'error');
        return;
      }

      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, `blog_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (err) => {
          console.error(err);
          addToast('Erro ao enviar imagem.', 'error');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', downloadURL);
            quill.setSelection(range.index + 1, 0);
          }
        }
      );
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  if (!showPostForm) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-6xl shadow-3xl overflow-hidden max-h-[95vh] flex flex-col border border-white"
      >
        <div className="flex items-center justify-between p-8 sm:p-10 border-b border-slate-50 bg-slate-50/20">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-500 rounded-2xl text-slate-900 shadow-xl shadow-brand-500/20">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{postForm.id ? 'Refinar Artigo' : 'Nova Unidade Editorial'}</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">{postForm.clientName || 'Rascunho Interno'}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowPostForm(false)}
            className="p-4 hover:bg-slate-100 rounded-2xl text-slate-300 hover:text-slate-900 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full no-scrollbar">
          <form onSubmit={handleSavePost} className="p-8 sm:p-10 space-y-12">
            {postForm.clientComment && (
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-[24px] shadow-sm mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-rose-500 text-white rounded-lg shadow-sm">
                    <MessageSquareText size={16} />
                  </div>
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.2em]">Feedback Crítico do Cliente</span>
                </div>
                <p className="text-sm font-medium text-rose-900 leading-relaxed italic bg-white/50 p-4 rounded-xl border border-rose-100/50 shadow-inner">
                  "{postForm.clientComment}"
                </p>
                <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-rose-400 animate-ping"></div>
                   Por favor, revise o conteúdo aplicando os ajustes acima.
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Coluna Esquerda: Definições Base */}
              <div className="space-y-8 bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-500 shadow-lg shadow-slate-200/50 border border-slate-50">
                    <Users size={20} />
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Matriz e Contexto</h4>
                </div>
                
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-6">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Alvo Corporativo</label>
                      <div className="relative group/input">
                        <Users size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-brand-500 transition-colors" />
                        <input 
                          list="clients-list" 
                          required 
                          value={postForm.clientName} 
                          onChange={e => setPostForm({...postForm, clientName: e.target.value})} 
                          className="w-full h-12 pl-12 pr-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-xs placeholder:text-slate-200" 
                          placeholder="Selecionar Cliente..." 
                        />
                      </div>
                      <datalist id="clients-list">
                        {clientsList.map((client: string, i: number) => <option key={`${client}-${i}`} value={client} />)}
                      </datalist>
                    </div>
                    <div className="lg:col-span-6">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Ciclo de Operação</label>
                      <div className="relative group/input">
                        <Calendar size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-brand-500 transition-colors" />
                        <input 
                          type="month" 
                          value={postForm.targetMonth} 
                          onChange={e => setPostForm({...postForm, targetMonth: e.target.value})} 
                          className="w-full h-12 pl-12 pr-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-semibold text-slate-900 shadow-lg shadow-slate-100 text-xs" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1 block">Manchete Editorial (H1)</label>
                    <input 
                      required 
                      value={postForm.title} 
                      onChange={e => setPostForm({...postForm, title: e.target.value})} 
                      placeholder="Definindo o Título..."
                      className="w-full h-14 px-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-bold text-slate-900 text-lg tracking-tight shadow-lg shadow-slate-100 placeholder:text-slate-100 uppercase" 
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">TEMA (Artigo / Blog)</label>
                      <input 
                        required 
                        value={postForm.theme || ""} 
                        onChange={e => setPostForm({...postForm, theme: e.target.value})} 
                        className="w-full h-14 px-6 bg-white border-none rounded-xl font-medium text-slate-500 text-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-lg shadow-slate-100" 
                        placeholder="Ex: Guia Completo de SEO 2026 para E-commerce"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">Cluster Temático (Categoria)</label>
                      <select 
                        required
                        value={postForm.category} 
                        onChange={e => setPostForm({...postForm, category: e.target.value})} 
                        className="w-full h-14 px-6 bg-white border-none rounded-xl font-semibold text-slate-900 text-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-lg shadow-slate-100 appearance-none cursor-pointer"
                      >
                        <option value="">Selecione...</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 ml-1">DIRECIONAMENTO (Briefing p/ Redator)</label>
                  <textarea 
                    required 
                    value={postForm.directioning || ""} 
                    onChange={e => setPostForm({...postForm, directioning: e.target.value})} 
                    className="w-full p-6 bg-white border-none rounded-3xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-medium leading-relaxed text-slate-600 shadow-lg shadow-slate-100 min-h-[140px]" 
                    placeholder="Instruções estratégicas para o redator (cerca de 60 palavras)..."
                  />
                </div>
              </div>

              {/* Coluna Direita: Status e Imagem */}
              <div className="space-y-8 bg-slate-50/30 p-8 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-500 shadow-lg shadow-slate-200/50 border border-slate-50">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Workflow & Vitalidade</h4>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6 text-center">Status de Operação</label>
                  <div className="bg-white/50 p-3 rounded-[32px] border border-slate-50 flex flex-wrap gap-2 shadow-inner">
                    {['Planejado', 'Rascunho', 'Aguardando Aprovação', 'Publicado'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPostForm({ ...postForm, status: s })}
                        className={`flex-1 min-w-[120px] py-4 text-[10px] font-bold uppercase tracking-[0.1em] rounded-2xl transition-all duration-500 active:scale-95 ${
                          postForm.status === s 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/20 scale-[1.02] z-10' 
                          : 'bg-transparent text-slate-300 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 ml-1">Imagem de Capa (Principal)</label>
                   <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-lg shadow-slate-100 group">
                     <FileUploader 
                        currentUrl={postForm.coverImage} 
                        onUploadSuccess={(url) => setPostForm({...postForm, coverImage: url})} 
                        folder="blog_covers" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">PALAVRA-CHAVE</label>
                    <input 
                      type="text" 
                      value={postForm.focusKeywords} 
                      onChange={e => setPostForm({...postForm, focusKeywords: e.target.value})} 
                      placeholder="Foco em SEO (3-4 palavras)"
                      className="w-full h-14 px-6 bg-white border-none rounded-xl font-bold text-slate-900 text-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-lg shadow-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">PALAVRAS ÂNCORAS SECUNDÁRIAS</label>
                    <input 
                      type="text" 
                      value={postForm.secondaryKeywords || ""} 
                      onChange={e => setPostForm({...postForm, secondaryKeywords: e.target.value})} 
                      placeholder="Separadas por vírgula (5-10 palavras)"
                      className="w-full h-14 px-6 bg-white border-none rounded-xl font-medium text-slate-500 text-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-lg shadow-slate-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 ml-1 block">LINKAGEM INTERNA</label>
                  <textarea 
                    value={postForm.internalLinking || ""} 
                    onChange={e => setPostForm({...postForm, internalLinking: e.target.value})} 
                    placeholder="Palavras chaves para linkagens internas, separadas por vírgulas (15-20 palavras)"
                    className="w-full p-4 bg-white border-none rounded-xl font-medium text-slate-500 text-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-lg shadow-slate-100 min-h-[100px]" 
                  />
                </div>
              </div>
            </div>

            {/* Conteúdo Rico */}
            <div className="space-y-8 group">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] ml-2">Artigo / Redação de Alta Conversão</label>
                <div className="flex items-center gap-4">
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em]">
                    Meta: {postForm.targetWords || '-'}
                  </div>
                  <div className="bg-brand-500 text-slate-900 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.05em] shadow-lg shadow-brand-500/10">
                    Contagem: {postForm.wordCount || '0 palavras'}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl group-focus-within:border-brand-500 transition-all duration-500 min-h-[600px] relative">
                <Suspense fallback={
                  <div className="h-[600px] p-10 space-y-6">
                    <Skeleton variant="rectangular" className="h-12 w-3/4" />
                    <Skeleton variant="rectangular" className="h-6 w-full" />
                    <Skeleton variant="rectangular" className="h-6 w-full" />
                    <Skeleton variant="rectangular" className="h-6 w-2/3" />
                    <Skeleton variant="rectangular" className="h-40 w-full" />
                  </div>
                }>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={postForm.content}
                    onChange={(val) => {
                      setPostForm((prev: any) => {
                        const stripped = val.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');
                        const words = stripped.trim().split(/\s+/).filter(Boolean).length;
                        return { ...prev, content: val, wordCount: `${words} palavras` };
                      });
                    }}
                    modules={modules}
                    className="h-[600px] mb-12 scroll-m-20"
                  />
                </Suspense>
              </div>
            </div>

            {/* Configurações Extra */}
            <div className="grid lg:grid-cols-2 gap-8 pt-12 border-t border-slate-100">
               <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-[0.1em] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" /> Inteligência de Busca
                  </h4>
                  <div className="grid gap-4">
                    <input placeholder="Título SEO (Tag)" value={postForm.seoTitle || ""} onChange={e => setPostForm({...postForm, seoTitle: e.target.value})} className="w-full h-12 px-5 bg-white border-none rounded-xl text-[11px] font-medium shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all" />
                    <input placeholder="Palavras-chave Secundárias" value={postForm.secondaryKeywords} onChange={e => setPostForm({...postForm, secondaryKeywords: e.target.value})} className="w-full h-12 px-5 bg-white border-none rounded-xl text-[11px] font-medium shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all" />
                  </div>
               </div>
               
               <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-[0.1em] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-900" /> Agendamento & URLs
                  </h4>
                  <div className="grid gap-4">
                    <input placeholder="URL da Publicação Final" type="url" value={postForm.publishedUrl} onChange={e => setPostForm({...postForm, publishedUrl: e.target.value})} className="w-full h-12 px-5 bg-white border-none rounded-xl text-[11px] font-medium shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all" />
                    <input type="date" value={postForm.publishedAt} onChange={e => setPostForm({...postForm, publishedAt: e.target.value})} className="w-full h-12 px-5 bg-white border-none rounded-xl text-[11px] font-medium shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all" />
                  </div>
               </div>
            </div>

            {/* Analytics de SEO */}
            <div className="pt-6">
              <YoastTrafficLight 
                title={postForm.title}
                description={postForm.description}
                content={postForm.content}
                slug={postForm.slug}
                focusKeyword={postForm.focusKeywords ? postForm.focusKeywords.split(',')[0].trim() : ''}
                clientName={postForm.clientName}
              />
            </div>

            {/* Chat de Colaboração */}
            {postForm.id && (
              <div className="pt-10 mt-10 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <Users size={18} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Discussão Técnica do Artigo</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8">
                  <PostChat postId={postForm.id} currentUserRole="agency" currentUserName="Agência Master" addToast={addToast} />
                </div>
                <PostHistory postId={postForm.id} />
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-6 justify-end pt-12 mt-8 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowPostForm(false)} 
                disabled={isSaving} 
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all duration-300 rounded-2xl"
              >
                Descartar Mudanças
              </button>
              <button 
                type="button" 
                onClick={handleDraftClick} 
                disabled={isSaving} 
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-2xl border border-brand-100 transition-all duration-300 shadow-lg shadow-brand-500/5"
              >
                {isSaving ? 'Gravando...' : 'Salvar Draft'}
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-300 transition-all duration-500 flex items-center justify-center gap-3 hover:translate-y-[-1px] active:translate-y-0"
              >
                {isSaving ? <Activity size={16} className="animate-spin" /> : null}
                {isSaving ? 'Processando Artigo' : 'Enviar para aprovação'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

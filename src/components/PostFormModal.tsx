import React, { useRef, useMemo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
const ReactQuill = lazy(() => import('react-quill-new'));
import 'react-quill-new/dist/quill.snow.css';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import YoastTrafficLight from './YoastTrafficLight';
import PostChat from './PostChat';
import { FileUploader } from './FileUploader';
import { Users, FileText, X, Activity, Calendar } from 'lucide-react';

export function PostFormModal({ 
  postForm, setPostForm, showPostForm, setShowPostForm, handleSavePost, handleSaveDraft, clientsList, categories = [], isSaving 
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
        alert('Por favor, envie apenas imagens no formato WEBP.');
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
          alert('Erro ao enviar imagem.');
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-[3rem] w-full max-w-5xl shadow-3xl overflow-hidden max-h-[95vh] sm:max-h-[92vh] flex flex-col border border-white/20"
      >
        <div className="flex items-center justify-between p-4 sm:p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 rounded-2xl text-slate-900 shadow-lg shadow-brand-500/20">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display leading-none">{postForm.id ? 'Editar Artigo' : 'Novo Conteúdo Estratégico'}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{postForm.clientName || 'Rascunho Sem Cliente'}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowPostForm(false)}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <form onSubmit={handleSavePost} className="p-8 sm:p-12 space-y-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Coluna Esquerda: Definições Base */}
              <div className="space-y-8 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <Users size={16} />
                  </div>
                  <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Definições Gerais</h4>
                </div>
                
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5">
                      <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Cliente Destino</label>
                      <div className="relative">
                        <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          list="clients-list" 
                          required 
                          value={postForm.clientName} 
                          onChange={e => setPostForm({...postForm, clientName: e.target.value})} 
                          className="w-full h-14 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm" 
                          placeholder="Escolha o cliente..." 
                        />
                      </div>
                      <datalist id="clients-list">
                        {clientsList.map((client: string, i: number) => <option key={`${client}-${i}`} value={client} />)}
                      </datalist>
                    </div>
                    <div className="lg:col-span-4">
                      <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Tamanho Previsto</label>
                      <input 
                        type="text" 
                        value={postForm.targetWords} 
                        onChange={e => setPostForm({...postForm, targetWords: e.target.value})} 
                        className="w-full h-14 px-5 bg-white border border-slate-100 rounded-2xl font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm" 
                        placeholder="Ex: 1000 palavras"
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <label className="flex items-end h-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">Mês de Ref.</label>
                      <input 
                        type="month" 
                        value={postForm.targetMonth} 
                        onChange={e => setPostForm({...postForm, targetMonth: e.target.value})} 
                        className="w-full h-14 px-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-semibold text-slate-900 shadow-sm appearance-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Título Principal (H1)</label>
                    <input 
                      required 
                      value={postForm.title} 
                      onChange={e => setPostForm({...postForm, title: e.target.value})} 
                      placeholder="Ex: 10 Maneiras de Escalar seu SEO..."
                      className="w-full h-14 px-6 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-bold text-slate-900 text-lg tracking-tight shadow-sm" 
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">URL Amigável (Slug)</label>
                      <input 
                        required 
                        value={postForm.slug} 
                        onChange={e => setPostForm({...postForm, slug: e.target.value})} 
                        className="w-full h-14 px-5 bg-white border border-slate-100 rounded-2xl font-medium text-slate-600 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm" 
                        placeholder="slug-do-artigo"
                      />
                    </div>
                    <div>
                      <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
                      <select 
                        required
                        value={postForm.category} 
                        onChange={e => setPostForm({...postForm, category: e.target.value})} 
                        className="w-full h-14 px-5 bg-white border border-slate-100 rounded-2xl font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Meta Descrição (SEO)</label>
                  <textarea 
                    required 
                    value={postForm.description} 
                    onChange={e => setPostForm({...postForm, description: e.target.value})} 
                    className="w-full p-6 bg-white border border-slate-100 rounded-3xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm leading-relaxed text-slate-600 shadow-sm" 
                    rows={3}
                    placeholder="Descreva o conteúdo de forma persuasiva para os buscadores..."
                  />
                </div>
              </div>

              {/* Coluna Direita: Status e Imagem */}
              <div className="space-y-8 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <Activity size={16} />
                  </div>
                  <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Fluxo e Visual</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Status Operacional</label>
                  <div className="bg-white p-2 rounded-2xl border border-slate-100 flex flex-wrap gap-2 shadow-sm">
                    {['Rascunho', 'Planejado', 'Aguardando Aprovação', 'Publicado'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPostForm({ ...postForm, status: s })}
                        className={`flex-1 min-w-[120px] py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                          postForm.status === s 
                          ? 'bg-brand-500 text-slate-900 shadow-lg shadow-brand-500/20' 
                          : 'bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Imagem de Capa (Opcional)</label>
                   <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                     <FileUploader 
                        currentUrl={postForm.coverImage} 
                        onUploadSuccess={(url) => setPostForm({...postForm, coverImage: url})} 
                        folder="blog_covers" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Palavra-chave</label>
                    <input 
                      type="text" 
                      value={postForm.focusKeywords} 
                      onChange={e => setPostForm({...postForm, focusKeywords: e.target.value})} 
                      placeholder="Ex: Marketing Digital"
                      className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="flex items-end h-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Texto Âncora</label>
                    <input 
                      type="text" 
                      value={postForm.anchor} 
                      onChange={e => setPostForm({...postForm, anchor: e.target.value})} 
                      placeholder="Ex: saiba mais aqui"
                      className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl font-medium text-slate-600 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Rico */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Corpo do Artigo (Editor de Texto)</label>
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Previsto: {postForm.targetWords || '-'}
                  </div>
                  <div className="bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Atual: {postForm.wordCount || '0 palavras'}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-inner min-h-[500px]">
                <Suspense fallback={<div className="h-[500px] flex items-center justify-center bg-slate-50 text-slate-400 font-medium italic">Preparando editor de alta performance...</div>}>
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
                    className="h-[500px] mb-12"
                  />
                </Suspense>
              </div>
            </div>

            {/* Configurações Extra */}
            <div className="grid lg:grid-cols-2 gap-8 pt-12 border-t border-slate-100">
               <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity size={16} className="text-brand-500" /> Inteligência de Busca
                  </h4>
                  <div className="grid gap-4">
                    <input placeholder="Título SEO (Tag)" value={postForm.seoTitle || ""} onChange={e => setPostForm({...postForm, seoTitle: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-semibold" />
                    <input placeholder="Palavras-chave Secundárias" value={postForm.secondaryKeywords} onChange={e => setPostForm({...postForm, secondaryKeywords: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-semibold" />
                  </div>
               </div>
               
               <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Calendar size={16} className="text-brand-500" /> Agendamento & URLs
                  </h4>
                  <div className="grid gap-4">
                    <input placeholder="URL da Publicação Final" type="url" value={postForm.publishedUrl} onChange={e => setPostForm({...postForm, publishedUrl: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-semibold" />
                    <input type="date" value={postForm.publishedAt} onChange={e => setPostForm({...postForm, publishedAt: e.target.value})} className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-semibold" />
                  </div>
               </div>
            </div>

            {/* Analytics de SEO */}
            <div className="pt-8">
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
              <div className="pt-12 mt-12 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">Discussão Técnica do Artigo</h3>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                  <PostChat postId={postForm.id} currentUserRole="agency" currentUserName="Agência Master" />
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-12 mt-12 border-t-2 border-slate-50">
              <button 
                type="button" 
                onClick={() => setShowPostForm(false)} 
                disabled={isSaving} 
                className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-all rounded-2xl"
              >
                Descartar Mudanças
              </button>
              <button 
                type="button" 
                onClick={handleDraftClick} 
                disabled={isSaving} 
                className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-2xl border border-brand-100 transition-all shadow-sm"
              >
                {isSaving ? 'Gravando...' : 'Salvar como Rascunho'}
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-10 py-4 text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3"
              >
                {isSaving ? <Activity size={16} className="animate-pulse" /> : null}
                {isSaving ? 'Processando Artigo' : 'Enviar para aprovação'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

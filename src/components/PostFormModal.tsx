import React, { useRef, useMemo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import Skeleton from './ui/Skeleton';
const ReactQuill = lazy(() => import('react-quill-new'));
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import YoastTrafficLight from './YoastTrafficLight';
import PostChat from './PostChat';
import PostHistory from './PostHistory';
import { FileUploader } from './FileUploader';
import { Users, FileText, X, Activity, Calendar, MessageSquareText, Sparkles, Globe, Key, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export function PostFormModal({ 
  postForm, setPostForm, showPostForm, setShowPostForm, handleSavePost, handleSaveDraft, clientsList, categories = [], isSaving, addToast, isSidebarCollapsed = false
}: any) {
  const quillRef = useRef<any>(null);
  const internalIsSaving = useRef(false);

  React.useEffect(() => {
    if (showPostForm) {
      import('react-quill-new/dist/quill.snow.css');
      if (postForm.content) {
        const val = postForm.content;
        const stripped = val.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');
        const words = stripped.trim().split(/\s+/).filter(Boolean).length;
        setPostForm((prev: any) => ({ ...prev, wordCount: `${words} palavras` }));
      }
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
    <div className={`fixed inset-y-0 right-0 z-[100] flex items-center justify-center p-3 sm:p-5 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'md:left-18' : 'md:left-72'}`}>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md -z-10" 
        onClick={() => setShowPostForm(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl border border-brand-100/80 flex items-center justify-center shadow-xs">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {postForm.id ? 'Editar Artigo de Blog' : 'Novo Artigo de Blog'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {postForm.clientName ? `Cliente: ${postForm.clientName}` : 'Rascunho Interno / Novo Planejamento'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowPostForm(false)}
            className="p-2 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <div className="flex-1 overflow-y-auto w-full">
          <form onSubmit={handleSavePost} className="p-6 sm:p-8 space-y-8">
            
            {/* Feedback Crítico do Cliente (se houver) */}
            {postForm.clientComment && (
              <div className="bg-rose-50/80 border border-rose-200/80 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-1.5 bg-rose-500 text-white rounded-md shadow-xs">
                    <MessageSquareText size={14} />
                  </div>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Feedback do Cliente</span>
                </div>
                <p className="text-sm font-medium text-rose-900 leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-rose-100">
                  "{postForm.clientComment}"
                </p>
              </div>
            )}

            {/* Bloco 1: Informações Principais & Status */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Informações Base (7 cols) */}
              <div className="lg:col-span-7 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                    <Users size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Contexto e Identificação</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Cliente</label>
                    <input 
                      list="clients-list" 
                      required 
                      value={postForm.clientName} 
                      onChange={e => setPostForm({...postForm, clientName: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-900 text-xs placeholder:text-slate-400" 
                      placeholder="Selecionar ou digitar cliente..." 
                    />
                    <datalist id="clients-list">
                      {clientsList.map((client: string, i: number) => <option key={`${client}-${i}`} value={client} />)}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mês Alvo / Ciclo</label>
                    <input 
                      type="month" 
                      value={postForm.targetMonth} 
                      onChange={e => setPostForm({...postForm, targetMonth: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-900 text-xs" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Título Principal (H1 do Post)</label>
                  <input 
                    required 
                    value={postForm.title} 
                    onChange={e => setPostForm({...postForm, title: e.target.value})} 
                    placeholder="Ex: Como Escolher a Melhor Plataforma de E-commerce em 2026"
                    className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Tema Central</label>
                    <input 
                      required 
                      value={postForm.theme || ""} 
                      onChange={e => setPostForm({...postForm, theme: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                      placeholder="Ex: Guia de E-commerce"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Categoria</label>
                    <select 
                      required
                      value={postForm.category} 
                      onChange={e => setPostForm({...postForm, category: e.target.value})} 
                      className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Selecione a categoria...</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Workflow & Imagem de Capa (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                      <Activity size={16} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Status de Operação</h4>
                  </div>

                  <div className="bg-slate-200/60 p-1 rounded-xl flex flex-wrap sm:flex-nowrap gap-1 border border-slate-200/60">
                    {['Planejado', 'Rascunho', 'Aguardando Aprovação', 'Publicado'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPostForm({ ...postForm, status: s })}
                        className={`flex-1 py-2 px-2.5 text-[11px] font-semibold rounded-lg transition-all text-center ${
                          postForm.status === s 
                          ? 'bg-brand-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-slate-400" />
                    Imagem de Capa (Principal)
                  </label>
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
                    <FileUploader 
                      currentUrl={postForm.coverImage} 
                      onUploadSuccess={(url) => setPostForm({...postForm, coverImage: url})} 
                      folder="blog_covers" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Estratégia de SEO e Briefing */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Estratégia SEO & Diretrizes de Redação</h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
                  Parâmetros de indexação e palavras-chave
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key size={13} className="text-brand-600" />
                    Palavra-Chave Principal
                  </label>
                  <input 
                    type="text" 
                    value={postForm.focusKeywords} 
                    onChange={e => setPostForm({...postForm, focusKeywords: e.target.value})} 
                    placeholder="Ex: consultoria seo sp"
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Palavras-Chave Secundárias
                  </label>
                  <input 
                    type="text" 
                    value={postForm.secondaryKeywords || ""} 
                    onChange={e => setPostForm({...postForm, secondaryKeywords: e.target.value})} 
                    placeholder="Separadas por vírgula"
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LinkIcon size={13} className="text-slate-500" />
                    Linkagem Interna
                  </label>
                  <input 
                    type="text"
                    value={postForm.internalLinking || ""} 
                    onChange={e => setPostForm({...postForm, internalLinking: e.target.value})} 
                    placeholder="URLs ou âncoras internas recomendadas"
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Direcionamento & Briefing Estratégico (Instruções para o Redator)
                </label>
                <textarea 
                  required 
                  value={postForm.directioning || ""} 
                  onChange={e => setPostForm({...postForm, directioning: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-xs font-medium leading-relaxed text-slate-700 placeholder:text-slate-400 min-h-[90px]" 
                  placeholder="Descreva o tom de voz, público-alvo, seções obrigatórias e diferenciais da abordagem..."
                />
              </div>
            </div>

            {/* Bloco 3: Editor de Conteúdo */}
            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Conteúdo do Artigo</h4>
                  <p className="text-xs text-slate-500">Escreva e formate a redação com títulos, links e imagens</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                    Meta: {postForm.targetWords || '1.500 palavras'}
                  </span>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-lg">
                    {postForm.wordCount || '0 palavras'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all min-h-[500px]">
                <Suspense fallback={
                  <div className="h-[500px] p-8 space-y-4">
                    <Skeleton variant="rectangular" className="h-10 w-2/3" />
                    <Skeleton variant="rectangular" className="h-5 w-full" />
                    <Skeleton variant="rectangular" className="h-5 w-full" />
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
                    className="h-[450px] mb-12"
                  />
                </Suspense>
              </div>
            </div>

            {/* Bloco 4: Publicação & Metadados Avançados */}
            <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-brand-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Tags de Busca (Snippet SEO)</h4>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Title Tag SEO</label>
                    <input 
                      placeholder="Título que aparece no Google (50-60 caracteres)" 
                      value={postForm.seoTitle || ""} 
                      onChange={e => setPostForm({...postForm, seoTitle: e.target.value})} 
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-brand-500 transition-all placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Publicação & Agendamento</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">URL Publicada</label>
                    <input 
                      placeholder="https://site.com/blog/slug" 
                      type="url" 
                      value={postForm.publishedUrl} 
                      onChange={e => setPostForm({...postForm, publishedUrl: e.target.value})} 
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-brand-500 transition-all placeholder:text-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Data de Publicação</label>
                    <input 
                      type="date" 
                      value={postForm.publishedAt} 
                      onChange={e => setPostForm({...postForm, publishedAt: e.target.value})} 
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-brand-500 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 5: Checklist / Yoast Score */}
            <div className="pt-2">
              <YoastTrafficLight 
                title={postForm.title}
                description={postForm.description}
                content={postForm.content}
                slug={postForm.slug}
                focusKeyword={postForm.focusKeywords ? postForm.focusKeywords.split(',')[0].trim() : ''}
                clientName={postForm.clientName}
              />
            </div>

            {/* Chat de Colaboração (se existente) */}
            {postForm.id && (
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <Users size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Discussão Técnica do Artigo</h3>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200 mb-6">
                  <PostChat postId={postForm.id} currentUserRole="agency" currentUserName="Agência Master" addToast={addToast} />
                </div>
                <PostHistory postId={postForm.id} />
              </div>
            )}

            {/* Rodapé com Ações */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowPostForm(false)} 
                disabled={isSaving} 
                className="px-5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Descartar
              </button>
              <button 
                type="button" 
                onClick={handleDraftClick} 
                disabled={isSaving} 
                className="px-5 py-2.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200/80 transition-all shadow-xs"
              >
                {isSaving ? 'Salvando...' : 'Salvar como Rascunho'}
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-7 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving && <Activity size={14} className="animate-spin" />}
                {isSaving ? 'Salvando Artigo...' : 'Salvar e Avançar'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle2, Loader2, UploadCloud, Link as LinkIcon, Image as ImageIcon, Settings } from 'lucide-react';

export default function SettingsGlobal() {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setLogoUrl(docSnap.data().logoUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar configuracoes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        logoUrl: logoUrl,
        updatedAt: new Date()
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configuracoes:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             
             // Always try PNG first as requested
             let dataUrl = canvas.toDataURL('image/png');
             
             // If PNG is too large for Firestore (max 1MB doc), resize further or compress
             if (dataUrl.length > 1000000) {
               // Try slightly smaller dimensions first to keep PNG
               const scale = 0.8;
               canvas.width = width * scale;
               canvas.height = height * scale;
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
               dataUrl = canvas.toDataURL('image/png');
             }

             // Final fallback if still too big (unlikely at 800px)
             if (dataUrl.length > 1000000) {
               dataUrl = canvas.toDataURL('image/webp', 0.7);
             }

             setLogoUrl(dataUrl);
          }
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-brand-600" /></div>;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-10 lg:p-16 relative">
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none text-slate-900 group-hover:scale-110 transition-transform duration-1000">
           <Settings size={200} />
        </div>
        <div className="mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-slate-900"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gestão do Ecossistema</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight uppercase leading-none mb-4">Configurações <span className="text-brand-600">Globais</span></h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed tracking-tight">Gerenciamento de marca, conexões e parâmetros fundamentais da agência.</p>
        </div>
        
        <form onSubmit={handleSave} className="space-y-10">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Snapshot da Marca</label>
              <div className="aspect-video bg-slate-50 rounded-[24px] border border-slate-200 border-dashed flex items-center justify-center p-6 relative overflow-hidden group">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center opacity-30">
                    <ImageIcon size={40} className="mx-auto mb-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Aguardando Logotipo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors pointer-events-none"></div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 ml-1">Atualizar Identidade</label>
                <div className="flex flex-col gap-3">
                  <label className="relative flex cursor-pointer items-center justify-center gap-2.5 w-full py-4 px-6 bg-slate-900 hover:bg-brand-600 rounded-xl text-[10px] font-bold text-white uppercase tracking-[0.1em] transition-all shadow-md">
                    <UploadCloud size={14} />
                    Selecionar Arquivo
                    <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                  </label>

                  <div className="flex items-center gap-3 px-4">
                    <div className="flex-1 h-px bg-slate-100"></div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">System Link</span>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                  
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      type="url" 
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                      placeholder="HTTPS://ENDPOINT.CLIENT.LOGO"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronização em Tempo Real Ativa</p>
            </div>
            
            <button 
              type="submit" 
              disabled={saving || !logoUrl}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2.5"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : 
               success ? <CheckCircle2 size={14} className="text-white" /> : 'Confirmar Mudanças'}
            </button>
          </div>
          
          {success && (
             <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.1em] text-center sm:text-right">
               Arquivos propagados com sucesso para o banco de dados.
             </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
}

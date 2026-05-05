import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle2, Loader2, UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Identidade Visual</h2>
            <p className="text-sm text-slate-500 mt-1">Configure o logotipo principal do sistema e do site</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-900">Logo Atual</label>
              <div className="flex gap-6 items-start">
                <div className="w-48 h-32 bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center p-4 relative overflow-hidden group">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                      <span className="text-xs font-medium">Sem Logo</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Rápido (Auto Redimensionamento)</label>
                    <label className="relative flex cursor-pointer items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                      <UploadCloud size={18} />
                      Escolher Imagem
                      <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <hr className="flex-1 border-slate-200" />
                    <span className="text-xs font-medium text-slate-400 uppercase">OU</span>
                    <hr className="flex-1 border-slate-200" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Externa da Imagem</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="url" 
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-brand-500 rounded-xl text-sm transition-colors outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={saving || !logoUrl}
                className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 
                 success ? <CheckCircle2 size={18} /> : 'Salvar Alterações'}
              </button>
            </div>
            {success && (
               <p className="text-sm font-medium text-emerald-600 !mt-2 text-right">Alterações salvas! Atualize a página para ver a nova logo.</p>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}

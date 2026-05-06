import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { UploadCloud, CheckCircle, AlertCircle, X, File, Image as ImageIcon } from 'lucide-react';

interface FileUploaderProps {
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  folder: string; // e.g. "blog_covers"
  accept?: string;
}

export function FileUploader({ currentUrl, onUploadSuccess, folder, accept = "image/webp,application/pdf" }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/') && file.type !== 'image/webp') {
      setError('Por favor, envie apenas imagens no formato WEBP para máxima performance SEO.');
      return;
    }

    // Optional: Delete old file if there is one and it belongs to our storage
    if (currentUrl && currentUrl.includes('firebasestorage')) {
      // Best effort delete
      try {
        const fileRef = ref(storage, currentUrl);
        deleteObject(fileRef).catch(() => {});
      } catch (err) {
        // ignore
      }
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setProgress(0);
    setError('');

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (err) => {
        setError('Erro ao enviar arquivo. Verifique se o arquivo não é muito grande.');
        setUploading(false);
        console.error(err);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onUploadSuccess(downloadURL);
      }
    );
  };

  const isImage = currentUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null || currentUrl?.includes('token=');

  return (
    <div className="w-full">
      {currentUrl ? (
        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col items-center justify-center min-h-[120px]">
          {isImage ? (
            <img src={currentUrl} alt="Uploaded" className="w-full h-40 object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-slate-500">
              <File size={32} className="mb-2" />
              <span className="text-xs font-medium truncate max-w-full px-4">{currentUrl.split('/').pop()?.split('?')[0] || 'Documento Anexado'}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onUploadSuccess('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
            title="Remover"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
              <span className="text-xs font-bold text-slate-500">{Math.round(progress)}% Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <UploadCloud size={28} className="mb-2 text-slate-400" />
              <span className="text-sm font-medium">Clique ou arraste um arquivo</span>
              <span className="text-xs text-slate-400 mt-1">Imagens (.webp) ou Documentos (.pdf)</span>
            </div>
          )}
          {error && (
            <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

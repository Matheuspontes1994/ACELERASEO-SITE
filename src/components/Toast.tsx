import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={18} />,
    error: <XCircle className="text-rose-500" size={18} />,
    warning: <AlertCircle className="text-amber-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />
  };

  const colors = {
    success: 'border-emerald-100 bg-emerald-50/50',
    error: 'border-rose-100 bg-rose-50/50',
    warning: 'border-amber-100 bg-amber-50/50',
    info: 'border-blue-100 bg-blue-50/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${colors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 p-1 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: { id: string; message: string; type: ToastType }[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 p-6 flex flex-col gap-3 pointer-events-none overflow-hidden z-[9999]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

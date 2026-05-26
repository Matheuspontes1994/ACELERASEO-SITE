import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};

    if (auth) {
      if (auth.currentUser) {
        setUser(auth.currentUser);
        setLoading(false);
      }

      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!active) return;
        setUser(currentUser);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <p className="text-slate-400 font-medium text-sm animate-pulse">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

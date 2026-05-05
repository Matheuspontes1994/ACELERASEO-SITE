import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import defaultLogo from '../assets/logo.png';

interface SettingsContextType {
  logoUrl: string;
}

const SettingsContext = createContext<SettingsContextType>({ logoUrl: defaultLogo });

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrl] = useState(defaultLogo);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().logoUrl) {
        setLogoUrl(docSnap.data().logoUrl);
      }
    });

    return () => unsub();
  }, []);

  return (
    <SettingsContext.Provider value={{ logoUrl }}>
      {children}
    </SettingsContext.Provider>
  );
}

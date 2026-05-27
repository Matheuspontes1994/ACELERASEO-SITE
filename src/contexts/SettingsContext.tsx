import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const defaultLogo = '/logo.svg';

const getCachedSetting = (key: string, defaultValue: string) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const cached = localStorage.getItem(`acelera_seo_setting_${key}`);
    return cached || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setCachedSetting = (key: string, value: string) => {
  try {
    localStorage.setItem(`acelera_seo_setting_${key}`, value);
  } catch (e) {
    // ignore
  }
};

const defaultLayoutImages: Record<string, { url: string; alt: string; title: string }> = {
  about_hero: {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    alt: "Equipe da Acelera SEO reunida em sala de reuniões",
    title: "Nossa Equipe Corporativa"
  },
  about_team: {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    alt: "Colaboradores sorrindo trabalhando em equipe",
    title: "Colaboração Estratégica"
  },
  about_office: {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    alt: "Ambiente de agência de marketing moderna",
    title: "Nossa Agência"
  },
  link_building_hero: {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    alt: "Gráfico de crescimento de autoridade e backlinks",
    title: "Gráfico de Performance de Backlinks"
  },
  link_building_secondary: {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    alt: "Especialista em Link Building fazendo negociação",
    title: "Negociação de Backlinks"
  },
  seo_expert_hero: {
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop",
    alt: "Consultor de SEO sênior analisando performance técnica",
    title: "Foco Analítico"
  },
  consulting_hero: {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    alt: "Apresentação de resultados e auditorias de SEO para novos clientes",
    title: "Apresentação de Resultados"
  },
  ecommerce_hero: {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    alt: "Loja virtual moderna e otimizada gerando lucros",
    title: "Otimização de Lojas Virtuais"
  }
};

const getCachedImages = (defaultValue: typeof defaultLayoutImages): typeof defaultLayoutImages => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const cached = localStorage.getItem('acelera_seo_setting_layout_images');
    if (cached) {
      return { ...defaultValue, ...JSON.parse(cached) };
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

interface SettingsContextType {
  logoUrl: string;
  faviconUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  layoutImages: Record<string, { url: string; alt: string; title: string }>;
}

const SettingsContext = createContext<SettingsContextType>({
  logoUrl: defaultLogo,
  faviconUrl: defaultLogo,
  defaultTitle: 'Acelera SEO | Agência de SEO Especializada em Otimização de Sites',
  defaultDescription: 'Acelera SEO é uma agência focada em auditoria de SEO técnica, Link Building de alta autoridade e SEO On-Page para potencializar o seu ranqueamento no Google.',
  defaultKeywords: 'seo, agência de seo, otimização de sites, auditoria de seo',
  layoutImages: defaultLayoutImages,
});

export const useSettings = () => useContext(SettingsContext);
export const getDefaultLogo = () => defaultLogo;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrl] = useState(() => getCachedSetting('logoUrl', defaultLogo));
  const [faviconUrl, setFaviconUrl] = useState(() => getCachedSetting('faviconUrl', defaultLogo));
  const [defaultTitle, setDefaultTitle] = useState(() => getCachedSetting('defaultTitle', 'Acelera SEO | Agência de SEO Especializada em Otimização de Sites'));
  const [defaultDescription, setDefaultDescription] = useState(() => getCachedSetting('defaultDescription', 'Acelera SEO é uma agência focada em auditoria de SEO técnica, Link Building de alta autoridade e SEO On-Page para potencializar o seu ranqueamento no Google.'));
  const [defaultKeywords, setDefaultKeywords] = useState(() => getCachedSetting('defaultKeywords', 'seo, agência de seo, otimização de sites, auditoria de seo'));
  const [layoutImages, setLayoutImages] = useState<Record<string, { url: string; alt: string; title: string }>>(() => 
    getCachedImages(defaultLayoutImages)
  );

  useEffect(() => {
    let active = true;
    let unsubGeneral: () => void = () => {};
    let unsubImages: () => void = () => {};

    if (db) {
      try {
        // 1. Snapshot for general settings
        unsubGeneral = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
          if (!active) return;
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.logoUrl) {
              setLogoUrl(data.logoUrl);
              setCachedSetting('logoUrl', data.logoUrl);
            }
            const fav = data.faviconUrl || data.logoUrl || defaultLogo;
            setFaviconUrl(fav);
            setCachedSetting('faviconUrl', fav);
            
            if (data.defaultTitle) {
              setDefaultTitle(data.defaultTitle);
              setCachedSetting('defaultTitle', data.defaultTitle);
            }
            if (data.defaultDescription) {
              setDefaultDescription(data.defaultDescription);
              setCachedSetting('defaultDescription', data.defaultDescription);
            }
            if (data.defaultKeywords) {
              setDefaultKeywords(data.defaultKeywords);
              setCachedSetting('defaultKeywords', data.defaultKeywords);
            }

            // Dynamic DOM injection of the favicon URL
            if (fav) {
              let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = fav;
            }
          }
        }, (err) => {
          console.error("Settings onSnapshot error:", err);
        });

        // 2. Snapshot for layout images
        unsubImages = onSnapshot(doc(db, 'settings', 'layout_images'), (docSnap) => {
          if (!active) return;
          if (docSnap.exists()) {
            const data = docSnap.data().images as Record<string, { url: string; alt: string; title: string }> || {};
            // Merge with defaults to ensure missing ones are preserved
            const merged = { ...defaultLayoutImages };
            Object.keys(data).forEach(key => {
              if (data[key]) {
                merged[key] = {
                  url: data[key].url || defaultLayoutImages[key]?.url || '',
                  alt: data[key].alt || defaultLayoutImages[key]?.alt || '',
                  title: data[key].title || defaultLayoutImages[key]?.title || ''
                };
              }
            });
            setLayoutImages(merged);
            try {
              localStorage.setItem('acelera_seo_setting_layout_images', JSON.stringify(merged));
            } catch (e) {
              // ignore
            }
          }
        }, (err) => {
          console.error("Layout images onSnapshot error:", err);
        });
      } catch (err) {
        console.error("Failed to setup settings snapshots:", err);
      }
    }

    return () => {
      active = false;
      unsubGeneral();
      unsubImages();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ logoUrl, faviconUrl, defaultTitle, defaultDescription, defaultKeywords, layoutImages }}>
      {children}
    </SettingsContext.Provider>
  );
}

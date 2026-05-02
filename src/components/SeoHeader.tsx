import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';

export function GlobalSeo() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [seoData, setSeoData] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setSeoData(null); // Reset when path changes to show defaults briefly or avoid stale

    async function fetchMetadata() {
      try {
        const q = query(collection(db, 'seo_pages'), where('url', '==', currentPath));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty && isMounted) {
          const data = snapshot.docs[0].data();
          setSeoData({
            title: data.title,
            description: data.description || ''
          });
        }
      } catch (error) {
        console.error("Erro ao buscar metadados SEO", error);
      }
    }

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [currentPath]);

  if (!seoData) return null;

  return (
    <Helmet>
      <title>{seoData.title}</title>
      {seoData.description && <meta name="description" content={seoData.description} />}
    </Helmet>
  );
}

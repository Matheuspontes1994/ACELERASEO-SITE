import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface LayoutImageProps {
  imageKey: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export default function LayoutImage({ 
  imageKey, 
  className = '', 
  loading = 'lazy' 
}: LayoutImageProps) {
  const { layoutImages } = useSettings();
  
  // Resolve configured image vs default fallback
  const fallback = {
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    alt: 'Imagem do Layout Acelera SEO - Otimização e performance orgânica',
    title: ''
  };

  const imageInfo = layoutImages[imageKey] || fallback;
  
  // Clean empty URLs to ensure image loaders fallback gracefully
  const srcUrl = imageInfo.url && imageInfo.url.trim() ? imageInfo.url : fallback.url;
  const altText = imageInfo.alt && imageInfo.alt.trim() ? imageInfo.alt : imageInfo.title || fallback.alt;

  return (
    <img
      src={srcUrl}
      alt={altText}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
}

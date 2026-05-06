import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items?: { label: string; path: string }[];
}

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Se não forem passados itens, tentamos gerar automaticamente a partir da rota
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbItems = items || [
    { label: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      // Formata a label (remove dashes, capitaliza)
      const label = value
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return { label, path };
    }),
  ];

  // Gerar JSON-LD para BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${window.location.origin}${item.path}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      
      <ol className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index === 0 ? (
                <Link 
                  to={item.path} 
                  className="flex items-center hover:text-brand-600 transition-colors text-brand-600/70"
                >
                  <Home size={12} className="mr-1" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ) : isLast ? (
                <span className="text-slate-900 font-black truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-brand-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
              
              {!isLast && (
                <ChevronRight size={12} className="text-slate-300 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

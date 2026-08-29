import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 10;
      
      const scrollToElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(scrollToElement, 50);
        }
      };

      // Pequeno atraso para garantir montagem do DOM
      const timer = setTimeout(scrollToElement, 30);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);

  return null;
}



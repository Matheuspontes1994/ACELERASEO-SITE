/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Activity
} from 'lucide-react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './lib/logger';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import AuthRoute from './components/AuthRoute';
import { GlobalSeo } from './components/SeoHeader';
import Skeleton from './components/ui/Skeleton';
import ScrollToTop from './components/ScrollToTop';
import { JsonLd } from './components/JsonLd';
import { lazyWithRetry } from './utils/lazyWithRetry';

import Home from './pages/Home';
const AuditPage = lazyWithRetry(() => import('./pages/Audit'));
const BlogPage = lazyWithRetry(() => import('./pages/Blog'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'));
const ServicesPage = lazyWithRetry(() => import('./pages/Services'));
const AboutPage = lazyWithRetry(() => import('./pages/About'));
const ContactPage = lazyWithRetry(() => import('./pages/Contact'));
const SeoEcommercePage = lazyWithRetry(() => import('./pages/SeoEcommerce'));
const LinkBuildingPage = lazyWithRetry(() => import('./pages/LinkBuilding'));
const EspecialistaSeoPage = lazyWithRetry(() => import('./pages/EspecialistaSeo'));
const SeoLocalPage = lazyWithRetry(() => import('./pages/SeoLocal'));
const ConsultoriaSeoPage = lazyWithRetry(() => import('./pages/ConsultoriaSeo'));
const ClientDashboard = lazyWithRetry(() => import('./pages/ClientDashboard'));
const DashboardPage = lazyWithRetry(() => import('./pages/Dashboard'));
const LoginPage = lazyWithRetry(() => import('./pages/Login'));
const RegisterPage = lazyWithRetry(() => import('./pages/Register'));

// --- SEO Structured Data ---
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SEOAgency",
  "name": "Acelera SEO",
  "description": "Agência de SEO e Marketing SEO focada em SEO para sites, auditoria de SEO técnica e link building.",
  "url": "https://aceleraseo.com.br",
  "logo": "https://aceleraseo.com.br/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-31-99922-9927",
    "contactType": "customer service",
    "areaServed": "BR",
    "availableLanguage": "Portuguese"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR"
  },
  "serviceType": "Search Engine Optimization",
  "areaServed": "Global"
};

function AppContent() {
  const location = useLocation();
  const { defaultTitle, defaultDescription, logoUrl, faviconUrl } = useSettings();
  const hideGlobalLayout = ['/portal-cliente', '/painel', '/dashboard', '/login', '/cadastro'].includes(location.pathname);
  
  // Páginas que possuem Hero section próprio e não precisam de padding-top no main
  const heroDrivenPages = [
    '/', 
    '/servicos', 
    '/consultoria-seo', 
    '/seo-ecommerce', 
    '/agencia-link-building', 
    '/especialista-em-seo', 
    '/sobre',
    '/blog',
    '/auditoria'
  ].includes(location.pathname) || location.pathname.startsWith('/blog/');

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-brand-200 selection:text-brand-900">
      <Helmet>
        <html lang="pt-BR" />
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content={logoUrl || "https://aceleraseo.com.br/logo.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={logoUrl || "https://aceleraseo.com.br/logo.png"} />
        <link rel="canonical" href="https://aceleraseo.com.br" />
        <link rel="icon" type="image/png" href={faviconUrl || "/logo.png"} />
        <link rel="shortcut icon" type="image/png" href={faviconUrl || "/logo.png"} />
      </Helmet>

      <JsonLd data={structuredData} />

      {!hideGlobalLayout && <Navbar />}
      
      <main className={`flex-grow ${hideGlobalLayout || heroDrivenPages ? '' : 'pt-20 md:pt-24'}`}>
        <Suspense fallback={
          <div className="min-h-screen bg-slate-50 flex flex-col pt-32 px-6">
            <div className="max-w-7xl mx-auto w-full space-y-12">
              <div className="space-y-4">
                <Skeleton variant="rectangular" className="h-4 w-32 rounded-full" />
                <Skeleton variant="rectangular" className="h-12 w-3/4 rounded-2xl" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-48 rounded-[2rem]" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/seo-ecommerce" element={<SeoEcommercePage />} />
            <Route path="/consultoria-seo" element={<ConsultoriaSeoPage />} />
            <Route path="/agencia-link-building" element={<LinkBuildingPage />} />
            <Route path="/especialista-em-seo" element={<EspecialistaSeoPage />} />
            
            {/* Regional SEO Pages */}
            <Route path="/agencia-seo-sao-paulo" element={<SeoLocalPage city="São Paulo" state="SP" slug="agencia-seo-sao-paulo" />} />
            <Route path="/agencia-seo-rio-de-janeiro" element={<SeoLocalPage city="Rio de Janeiro" state="RJ" slug="agencia-seo-rio-de-janeiro" />} />
            <Route path="/agencia-seo-belo-horizonte" element={<SeoLocalPage city="Belo Horizonte" state="MG" slug="agencia-seo-belo-horizonte" />} />
            <Route path="/agencia-seo-vitoria" element={<SeoLocalPage city="Vitória" state="ES" slug="agencia-seo-vitoria" />} />
            <Route path="/agencia-seo-curitiba" element={<SeoLocalPage city="Curitiba" state="PR" slug="agencia-seo-curitiba" />} />
            <Route path="/agencia-seo-florianopolis" element={<SeoLocalPage city="Florianópolis" state="SC" slug="agencia-seo-florianopolis" />} />
            <Route path="/agencia-seo-porto-alegre" element={<SeoLocalPage city="Porto Alegre" state="RS" slug="agencia-seo-porto-alegre" />} />

            <Route path="/contato" element={<ContactPage />} />
            <Route path="/auditoria" element={<AuditPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/portal-cliente" element={<AuthRoute><ClientDashboard /></AuthRoute>} />
            <Route path="/painel" element={<AuthRoute><DashboardPage /></AuthRoute>} />
          </Routes>
        </Suspense>
        <GlobalSeo />
      </main>

      {!hideGlobalLayout && <Footer />}
      {!hideGlobalLayout && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent browser console and platform from treating benign/canceled promises as critical uncaught rejections
      event.preventDefault();
      if (!event.reason) {
        return;
      }
      const reasonStr = typeof event.reason === 'string' 
        ? event.reason 
        : event.reason?.message || event.reason?.name || '';
      
      if (
        reasonStr.includes('ResizeObserver') || 
        reasonStr.includes('canceled') || 
        reasonStr.includes('abort') || 
        reasonStr.includes('Failed to fetch') ||
        reasonStr.includes('network') ||
        reasonStr.includes('The user aborted a request')
      ) {
        return;
      }
      logger.warn('Unhandled Promise Rejection caught:', event.reason);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      if (!event.error && !event.message) {
        event.preventDefault();
        return;
      }
      const msg = event.message || '';
      if (
        msg.includes('ResizeObserver') || 
        msg.includes('Script error') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module')
      ) {
        event.preventDefault();
        return;
      }
      logger.warn('Global Error caught:', event.error || event.message);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <HelmetProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </HelmetProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

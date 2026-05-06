/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Activity
} from 'lucide-react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './lib/logger';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
const Home = lazy(() => import('./pages/Home'));
const AuditPage = lazy(() => import('./pages/Audit'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ServicesPage = lazy(() => import('./pages/Services'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const SeoEcommercePage = lazy(() => import('./pages/SeoEcommerce'));
const ConsultoriaSeoPage = lazy(() => import('./pages/ConsultoriaSeo'));
const LinkBuildingPage = lazy(() => import('./pages/LinkBuilding'));
const EspecialistaSeoPage = lazy(() => import('./pages/EspecialistaSeo'));
const SeoLocalPage = lazy(() => import('./pages/SeoLocal'));
import { SettingsProvider } from './contexts/SettingsContext';
import AuthRoute from './components/AuthRoute';
import { GlobalSeo } from './components/SeoHeader';
import ScrollToTop from './components/ScrollToTop';
import { JsonLd } from './components/JsonLd';
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/Login'));

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
  const hideGlobalLayout = ['/portal-cliente', '/painel', '/dashboard'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-brand-200 selection:text-brand-900">
      <Helmet>
        <html lang="pt-BR" />
        <title>Acelera SEO | Agência de SEO Especializada em Otimização de Sites</title>
        <meta name="description" content="Acelera SEO é uma agência focada em auditoria de SEO técnica, Link Building de alta autoridade e SEO On-Page para potencializar o seu ranqueamento no Google e as vendas orgânicas." />
        <meta property="og:title" content="Acelera SEO | Agência de SEO Especializada" />
        <meta property="og:description" content="Engenharia reversa e otimização tech extrema focada em auditorias SEO para posicionar o site da sua empresa no topo das buscas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Acelera SEO | Agência de SEO Especializada" />
        <meta name="twitter:description" content="Otimização técnica experiente focada no crescimento do seu negócio através da aquisição orgânica." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
        <link rel="canonical" href="https://aceleraseo.com.br" />
      </Helmet>

      <JsonLd data={structuredData} />

      {!hideGlobalLayout && <Navbar />}
      
      <main className={`flex-grow ${hideGlobalLayout ? '' : 'pt-20 md:pt-24'}`}>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Activity className="animate-spin text-brand-600" size={40}/></div>}>
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
      logger.error('Unhandled Promise Rejection', event.reason);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      logger.error('Global Error', event.error || event.message);
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

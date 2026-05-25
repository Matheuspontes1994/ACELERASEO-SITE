import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { FileUploader } from './FileUploader';
import { 
  CheckCircle2, 
  Loader2, 
  UploadCloud, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Settings, 
  Globe, 
  FileText, 
  Link2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

interface SystemAspect {
  label: string;
  ratioClass: string;
  description: string;
}

interface LayoutImageDef {
  label: string;
  url: string;
  alt: string;
  title: string;
  recommendedSize: string;
  aspects: SystemAspect[];
  pageName: string;
  pageSlug: 'about' | 'link_building' | 'seo_expert' | 'consulting' | 'ecommerce';
}

const defaultLayoutImagesGlobal: Record<string, LayoutImageDef> = {
  about_hero: {
    label: "Banner Hero - Sobre Nós (Topo)",
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    alt: "Equipe da Acelera SEO reunida em sala de reuniões",
    title: "Nossa Equipe Corporativa",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Banner Principal", ratioClass: "aspect-[4/3]", description: "Visualização em container 4:3 com cantos arredondados na página Sobre nós." }
    ],
    pageName: "Sobre Nós",
    pageSlug: "about"
  },
  about_team: {
    label: "Seção de Missão - Sobre Nós",
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    alt: "Colaboradores sorrindo trabalhando em equipe",
    title: "Colaboração Estratégica",
    recommendedSize: "800x1000 px (4:5)",
    aspects: [
      { label: "Bloco Missão", ratioClass: "aspect-[4/5]", description: "Visualização vertical 4:5 com moldura cinza-claro de 12px." }
    ],
    pageName: "Sobre Nós",
    pageSlug: "about"
  },
  about_office: {
    label: "Seção de Valores - Sobre Nós (Ambiente)",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    alt: "Ambiente de agência de marketing moderna",
    title: "Nossa Agência",
    recommendedSize: "800x1200 px (2:3)",
    aspects: [
      { label: "Bloco História", ratioClass: "aspect-[2/3]", description: "Se adapta de forma flexível preenchendo o fundo da coluna esquerda." }
    ],
    pageName: "Sobre Nós",
    pageSlug: "about"
  },
  link_building_hero: {
    label: "Gráfico Principal - Link Building (Topo)",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    alt: "Gráfico de crescimento de autoridade e backlinks",
    title: "Gráfico de Performance de Backlinks",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Hero Lateral", ratioClass: "aspect-[4/3]", description: "Bloco Hero direito em proporção 4:3 na página de Link Building." },
      { label: "Seção Meio", ratioClass: "aspect-[4/5]", description: "Bloco de imagem vertical 4:5 na segunda dobra da página." }
    ],
    pageName: "Link Building",
    pageSlug: "link_building"
  },
  link_building_secondary: {
    label: "Seção de Parcerias - Link Building (Meio)",
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    alt: "Especialista em Link Building fazendo negociação",
    title: "Negociação de Backlinks",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Bloco Parcerias", ratioClass: "aspect-[4/3]", description: "Container 4:3 com molde de borda suave de 10px." }
    ],
    pageName: "Link Building",
    pageSlug: "link_building"
  },
  seo_expert_hero: {
    label: "Banner Lateral - Especialista de SEO",
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop",
    alt: "Consultor de SEO sênior analisando performance técnica",
    title: "Foco Analítico",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Hero Lateral", ratioClass: "aspect-[4/3]", description: "Bloco Hero direito em proporção 4:3 na página de Especialista SEO." },
      { label: "Seção Meio", ratioClass: "aspect-[4/5]", description: "Bloco de imagem vertical 4:5 na segunda dobra da página." }
    ],
    pageName: "Especialista de SEO",
    pageSlug: "seo_expert"
  },
  consulting_hero: {
    label: "Banner Lateral - Consultoria de SEO",
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    alt: "Apresentação de resultados e auditorias de SEO",
    title: "Apresentação de Resultados",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Hero Lateral", ratioClass: "aspect-[4/3]", description: "Bloco Hero direito em proporção 4:3 na página de Consultoria SEO." },
      { label: "Seção Meio", ratioClass: "aspect-[4/5]", description: "Bloco de imagem vertical 4:5 na segunda dobra da página." }
    ],
    pageName: "Consultoria de SEO",
    pageSlug: "consulting"
  },
  ecommerce_hero: {
    label: "Banner Lateral - SEO E-commerce",
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    alt: "Loja virtual moderna e otimizada gerando lucros",
    title: "Otimização de Lojas Virtuais",
    recommendedSize: "1200x900 px (4:3)",
    aspects: [
      { label: "Hero Lateral", ratioClass: "aspect-[4/3]", description: "Bloco Hero direito em proporção 4:3 na página de SEO para E-commerce." },
      { label: "Seção Meio", ratioClass: "aspect-[4/5]", description: "Bloco de imagem vertical 4:5 na segunda dobra da página." }
    ],
    pageName: "SEO E-commerce",
    pageSlug: "ecommerce"
  }
};

export default function SettingsGlobal() {
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultDescription, setDefaultDescription] = useState('');
  const [defaultKeywords, setDefaultKeywords] = useState('');
  const [whatsappContactTemplate, setWhatsappContactTemplate] = useState('');
  const [whatsappAuditTemplate, setWhatsappAuditTemplate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'seo' | 'images' | 'whatsapp'>('visual');
  const [seoSectionTab, setSeoSectionTab] = useState<'geral' | 'paginas'>('geral');

  // Page specific SEO states
  const [seoPages, setSeoPages] = useState<{ id: string; url: string; title: string; description: string }[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [editingPage, setEditingPage] = useState<{ id?: string; url: string; title: string; description: string } | null>(null);
  const [showPageModal, setShowPageModal] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [successPageAction, setSuccessPageAction] = useState(false);

  // Layout images editing states
  const [layoutImagesState, setLayoutImagesState] = useState<Record<string, { url: string; alt: string; title: string }>>({});
  const [savingImages, setSavingImages] = useState(false);
  const [successImages, setSuccessImages] = useState(false);
  const [editingImageKey, setEditingImageKey] = useState<string | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [editingImageAlt, setEditingImageAlt] = useState('');
  const [editingImageTitle, setEditingImageTitle] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [selectedAspectIndex, setSelectedAspectIndex] = useState(0);
  const [imagePageFilter, setImagePageFilter] = useState<string>('all');
  const [openGuideIndex, setOpenGuideIndex] = useState<number | null>(null);
  const [guideExpanded, setGuideExpanded] = useState(false);

  const loadSeoPages = async () => {
    setLoadingPages(true);
    try {
      const snap = await getDocs(collection(db, 'seo_pages'));
      
      if (snap.docs.length === 0) {
        // Popula automaticamente com os presets mais importantes para o cliente não ver vazio!
        const initialPresets = [
          {
            url: '/',
            title: 'Acelera SEO | Agência de SEO Especializada em Otimização de Sites',
            description: 'Acelera SEO é uma agência focada em auditoria de SEO técnica, Link Building de alta autoridade e SEO On-Page para potencializar o seu ranqueamento no Google.'
          },
          {
            url: '/blog',
            title: 'Blog de SEO & Marketing Orgânico | Acelera SEO',
            description: 'Confira as melhores estratégias de SEO do mercado nacional. Artigos exclusivos sobre SEO técnico, Link Building e otimização de conteúdo On-Page.'
          },
          {
            url: '/portal-cliente',
            title: 'Área do Cliente | Acelera SEO',
            description: 'Acesse seu painel exclusivo da Acelera SEO para acompanhar posts aprovados, backlinks integrados e o progresso da otimização técnica da sua unidade.'
          }
        ];

        for (const preset of initialPresets) {
          await addDoc(collection(db, 'seo_pages'), {
            ...preset,
            createdAt: serverTimestamp(),
            agencyUid: auth.currentUser?.uid || 'system'
          });
        }

        // Recarrega o snapshot após inserção
        const newSnap = await getDocs(collection(db, 'seo_pages'));
        const newList = newSnap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data() as { url: string; title: string; description: string }
        }));
        newList.sort((a, b) => {
          if (a.url === '/') return -1;
          if (b.url === '/') return 1;
          return a.url.localeCompare(b.url);
        });
        setSeoPages(newList);
        return;
      }

      const list = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data() as { url: string; title: string; description: string }
      }));
      // Sort pages with "/" first, then alphabetically by url
      list.sort((a, b) => {
        if (a.url === '/') return -1;
        if (b.url === '/') return 1;
        return a.url.localeCompare(b.url);
      });
      setSeoPages(list);
    } catch (err) {
      console.error("Erro ao carregar paginas de SEO:", err);
      handleFirestoreError(err, OperationType.GET, 'seo_pages');
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
          if (data.defaultTitle) setDefaultTitle(data.defaultTitle);
          if (data.defaultDescription) setDefaultDescription(data.defaultDescription);
          if (data.defaultKeywords) setDefaultKeywords(data.defaultKeywords);
          setWhatsappContactTemplate(data.whatsappContactTemplate || 'Olá {nome}! Recebemos seu contato no site da Acelera SEO sobre a empresa {empresa}. Como podemos te ajudar?');
          setWhatsappAuditTemplate(data.whatsappAuditTemplate || 'Olá {nome}! Vi que você realizou uma auditoria de SEO automática no site {site}. Vamos agendar uma apresentação gratuita do relatório técnico?');
        } else {
          setWhatsappContactTemplate('Olá {nome}! Recebemos seu contato no site da Acelera SEO sobre a empresa {empresa}. Como podemos te ajudar?');
          setWhatsappAuditTemplate('Olá {nome}! Vi que você realizou uma auditoria de SEO automática no site {site}. Vamos agendar uma apresentação gratuita do relatório técnico?');
        }

        const imgRef = doc(db, 'settings', 'layout_images');
        const imgSnap = await getDoc(imgRef);
        if (imgSnap.exists() && imgSnap.data().images) {
          setLayoutImagesState(imgSnap.data().images);
        } else {
          const initialMap: Record<string, { url: string; alt: string; title: string }> = {};
          Object.keys(defaultLayoutImagesGlobal).forEach(key => {
            initialMap[key] = {
              url: defaultLayoutImagesGlobal[key].url,
              alt: defaultLayoutImagesGlobal[key].alt,
              title: defaultLayoutImagesGlobal[key].title
            };
          });
          setLayoutImagesState(initialMap);
        }

        await loadSeoPages();
      } catch (error) {
        console.error("Erro ao carregar configuracoes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveLayoutImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageKey) return;
    setSavingImages(true);
    try {
      const updatedImages = {
        ...layoutImagesState,
        [editingImageKey]: {
          url: editingImageUrl.trim(),
          alt: editingImageAlt.trim(),
          title: editingImageTitle.trim()
        }
      };

      await setDoc(doc(db, 'settings', 'layout_images'), {
        images: updatedImages,
        updatedAt: new Date()
      }, { merge: true });

      setLayoutImagesState(updatedImages);
      setSuccessImages(true);
      setTimeout(() => setSuccessImages(false), 3000);
      setShowImageModal(false);
      setEditingImageKey(null);
    } catch (err) {
      console.error("Erro ao salvar imagem do layout:", err);
    } finally {
      setSavingImages(false);
    }
  };

  const handleSavePageSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage || !editingPage.url.trim()) return;
    setSavingPage(true);
    try {
      let formattedUrl = editingPage.url.trim();
      if (!formattedUrl.startsWith('/')) {
        formattedUrl = '/' + formattedUrl;
      }

      const pageData = {
        url: formattedUrl,
        title: editingPage.title.trim(),
        description: editingPage.description.trim(),
        updatedAt: serverTimestamp()
      };

      if (editingPage.id) {
        // Edit Mode
        await setDoc(doc(db, 'seo_pages', editingPage.id), pageData, { merge: true });
      } else {
        // Add Mode
        const newPageData = {
          ...pageData,
          createdAt: serverTimestamp(),
          agencyUid: auth.currentUser?.uid || ''
        };
        await addDoc(collection(db, 'seo_pages'), newPageData);
      }

      await loadSeoPages();
      setSuccessPageAction(true);
      setTimeout(() => setSuccessPageAction(false), 3000);
      setEditingPage(null);
      setShowPageModal(false);
    } catch (err) {
      console.error("Erro ao tratar SEO de pagina:", err);
      handleFirestoreError(err, OperationType.WRITE, 'seo_pages');
    } finally {
      setSavingPage(false);
    }
  };

  const handleDeletePageSEO = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir a configuração de SEO desta página?")) return;
    try {
      await deleteDoc(doc(db, 'seo_pages', id));
      await loadSeoPages();
    } catch (err) {
      console.error("Erro ao deletar SEO de pagina:", err);
      handleFirestoreError(err, OperationType.DELETE, `seo_pages/${id}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        logoUrl: logoUrl,
        faviconUrl: faviconUrl,
        defaultTitle: defaultTitle,
        defaultDescription: defaultDescription,
        defaultKeywords: defaultKeywords,
        whatsappContactTemplate: whatsappContactTemplate,
        whatsappAuditTemplate: whatsappAuditTemplate,
        updatedAt: new Date()
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configuracoes:", error);
    } finally {
      setSaving(false);
    }
  };

  const processImageFile = (file: File, maxWidth: number, maxHeight: number, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            let dataUrl = canvas.toDataURL('image/png');
            if (dataUrl.length > 1000000) {
              const scale = 0.8;
              canvas.width = width * scale;
              canvas.height = height * scale;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              dataUrl = canvas.toDataURL('image/png');
            }
            if (dataUrl.length > 1000000) {
              dataUrl = canvas.toDataURL('image/webp', 0.7);
            }
            callback(dataUrl);
          }
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, 800, 800, setLogoUrl);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Favicons are small, 128x128 maximizes quality while keeping document size tiny
      processImageFile(file, 128, 128, setFaviconUrl);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-brand-600" /></div>;

  const activeImageDef = editingImageKey ? defaultLayoutImagesGlobal[editingImageKey] : null;
  const activeAspect = activeImageDef?.aspects[selectedAspectIndex] || { label: "Padrão", ratioClass: "aspect-[4/3]", description: "Visualização em container proporcional" };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-10 lg:p-16 relative">
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none text-slate-900 group-hover:scale-110 transition-transform duration-1000">
           <Settings size={200} />
        </div>
        
        <div className="mb-12 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-slate-900"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gestão do Ecossistema</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight uppercase leading-none mb-4">Configurações <span className="text-brand-600">Globais</span></h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed tracking-tight">Gerencie a identidade visual, favicon de aba, metatags de SEO e padrões de ranqueamento para o Google.</p>
        </div>

        {/* Dynamic Nav Tabs */}
        <div className="flex border-b border-slate-100 mb-10 gap-8 relative z-10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('visual')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${activeSubTab === 'visual' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Identidade Visual
            {activeSubTab === 'visual' && (
              <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('seo')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${activeSubTab === 'seo' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            SEO & Metadados
            {activeSubTab === 'seo' && (
              <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('images')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${activeSubTab === 'images' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Imagens do Layout
            {activeSubTab === 'images' && (
              <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('whatsapp')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${activeSubTab === 'whatsapp' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Modelos WhatsApp
            {activeSubTab === 'whatsapp' && (
              <motion.div layoutId="subtab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
        </div>
          <div className="relative z-10">
          {activeSubTab === 'visual' && (
            <form onSubmit={handleSave} className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-12"
              >
                {/* BRAND LOGO ROW */}
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Logotipo Geral (Snapshot)</label>
                    <div className="aspect-video bg-slate-50 rounded-[24px] border border-slate-200 border-dashed flex items-center justify-center p-6 relative overflow-hidden group">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logotipo" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="text-center opacity-30">
                          <ImageIcon size={40} className="mx-auto mb-3" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Aguardando Logotipo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-6 lg:pt-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1">Atualizar Logotipo</label>
                      <div className="flex flex-col gap-4">
                        <label className="relative flex cursor-pointer items-center justify-center gap-2.5 w-full py-4 px-6 bg-slate-900 hover:bg-brand-600 rounded-xl text-[10px] font-bold text-white uppercase tracking-[0.1em] transition-all shadow-md">
                          <UploadCloud size={14} />
                          Selecionar Imagem do Logo
                          <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                        </label>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-slate-100"></div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">ou colar URL</span>
                          <div className="flex-1 h-px bg-slate-100"></div>
                        </div>
                        
                        <div className="relative">
                          <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                          <input 
                            type="url" 
                            value={logoUrl}
                            onChange={e => setLogoUrl(e.target.value)}
                            placeholder="https://sua-url-do-logo.com/imagem.png"
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BRAND FAVICON ROW */}
                <div className="grid lg:grid-cols-2 gap-10 items-start pt-8 border-t border-slate-100">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Logo da Aba (Favicon)</label>
                    <div className="w-24 h-24 bg-slate-50 rounded-[20px] border border-slate-200 border-dashed flex items-center justify-center p-4 relative overflow-hidden group mx-auto lg:mx-1">
                      {faviconUrl ? (
                        <img src={faviconUrl} alt="Favicon" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-550" />
                      ) : (
                        <div className="text-center opacity-30">
                          <Globe size={24} className="mx-auto mb-1" />
                          <span className="text-[8px] font-bold uppercase tracking-widest block leading-none">Aba</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Ícone que aparecerá na aba do navegador e nos resultados de busca do Google (Ideal: imagem quadrada {`<=`} 128px png).</p>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-6 lg:pt-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 ml-1">Atualizar Favicon</label>
                      <div className="flex flex-col gap-4">
                        <label className="relative flex cursor-pointer items-center justify-center gap-2.5 w-full py-4 px-6 bg-slate-900 hover:bg-brand-600 rounded-xl text-[10px] font-bold text-white uppercase tracking-[0.1em] transition-all shadow-md">
                          <UploadCloud size={14} />
                          Selecionar Imagem do Ícone
                          <input type="file" accept="image/png, image/jpeg, image/x-icon, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFaviconUpload} />
                        </label>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-slate-100"></div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">ou colar URL</span>
                          <div className="flex-1 h-px bg-slate-100"></div>
                        </div>
                        
                        <div className="relative">
                          <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                          <input 
                            type="url" 
                            value={faviconUrl}
                            onChange={e => setFaviconUrl(e.target.value)}
                            placeholder="https://sua-url-do-favicon.com/favicon.png"
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronização Ativa & Propagação de Imagens</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : 
                   success ? <CheckCircle2 size={14} className="text-white" /> : 'Confirmar Ajustes'}
                </button>
              </div>
            </form>
          )}

          {activeSubTab === 'seo' && (
            <div className="space-y-8">
              {/* SUB NAV FOR SEO TABS */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-4 gap-1">
                <button
                  type="button"
                  onClick={() => setSeoSectionTab('geral')}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${seoSectionTab === 'geral' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Padrões Globais
                </button>
                <button
                  type="button"
                  onClick={() => setSeoSectionTab('paginas')}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${seoSectionTab === 'paginas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  SEO por Página ({seoPages.length})
                </button>
              </div>

              {seoSectionTab === 'geral' ? (
                <form onSubmit={handleSave} className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-6 max-w-4xl"
                  >
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 items-start">
                      <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Modelos de Emergência/Padrão</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Essas metatags serão aplicadas automaticamente em qualquer página que não possua uma configuração específica de SEO mapeada no painel de controle.</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Título Padrão das Páginas (Meta Title)</label>
                      <input 
                        type="text" 
                        value={defaultTitle}
                        onChange={e => setDefaultTitle(e.target.value)}
                        placeholder="EX: Acelera SEO | Otimização e Auditoria Técnica de Sites"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                      />
                      <div className="flex justify-between items-center px-1">
                        <p className="text-[9px] text-slate-400">Título geral exibido no topo do navegador e no título das buscas do Google.</p>
                        <p className={`text-[9px] font-bold ${defaultTitle.length > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {defaultTitle.length} / 60 caracteres recomendado
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Meta Descrição Geral (Meta Description)</label>
                      <textarea 
                        rows={4}
                        value={defaultDescription}
                        onChange={e => setDefaultDescription(e.target.value)}
                        placeholder="EX: Acelera SEO é uma agência focada em auditorias SEO técnicas especializadas, campanhas de links patrocinados e estruturação orgânica escalável."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 leading-relaxed"
                      />
                      <div className="flex justify-between items-center px-1">
                        <p className="text-[9px] text-slate-400">Breve resumo informativo que aparece abaixo do título do seu site nos resultados de pesquisa.</p>
                        <p className={`text-[9px] font-bold ${defaultDescription.length > 160 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {defaultDescription.length} / 160 caracteres recomendado
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Palavras-chave Gerais (Keywords)</label>
                      <input 
                        type="text" 
                        value={defaultKeywords}
                        onChange={e => setDefaultKeywords(e.target.value)}
                        placeholder="EX: seo, auditoria seo, backlinks, links de autoridade, ranking google"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                      />
                      <p className="text-[9px] text-slate-400 ml-1">Separe as palavras-chave por vírgulas para ranqueamento legado e bots secundários.</p>
                    </div>
                  </motion.div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronização Ativa & Propagação de Metadados</p>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2.5"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : 
                       success ? <CheckCircle2 size={14} className="text-white" /> : 'Confirmar Ajustes'}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Mapeamento de Páginas Específicas</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">Mapeie títulos e descrições customizados para cada URL do site para maximizar a conversão orgânica (Snippet do Google).</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPage({ url: '', title: '', description: '' });
                        setShowPageModal(true);
                      }}
                      className="flex items-center justify-center gap-2 self-start py-3 px-5 bg-brand-600 hover:bg-brand-700 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all shadow-sm"
                    >
                      <Plus size={14} />
                      Nova Página SEO
                    </button>
                  </div>

                  {/* PRESET CHIPS */}
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-2">Quick Presets:</span>
                    {[
                      { url: '/', title: 'Início' },
                      { url: '/blog', title: 'Blog & Artigos' },
                      { url: '/portal-cliente', title: 'Portal do Cliente' },
                      { url: '/painel', title: 'Área do Admin' },
                      { url: '/sobre', title: 'Sobre Nós' },
                      { url: '/contato', title: 'Contato' }
                    ].map(preset => {
                      const alreadyMapped = seoPages.some(p => p.url === preset.url);
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          disabled={alreadyMapped}
                          onClick={() => {
                            setEditingPage({ url: preset.url, title: `${preset.title} | ${defaultTitle.split('|')[1]?.trim() || 'Acelera SEO'}`, description: defaultDescription });
                            setShowPageModal(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all ${alreadyMapped ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 shadow-3xs'}`}
                        >
                          + {preset.url} ({preset.title})
                        </button>
                      );
                    })}
                  </div>

                  {/* LIST OF PAGES */}
                  {loadingPages ? (
                    <div className="py-20 flex justify-center"><Loader2 size={24} className="animate-spin text-brand-600" /></div>
                  ) : seoPages.length === 0 ? (
                    <div className="border border-slate-150 border-dashed rounded-2xl py-12 px-6 text-center">
                      <Globe className="text-slate-300 mx-auto mb-3" size={36} />
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Nenhuma página mapeada ainda</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">Clique no botão "Nova Página SEO" para adicionar overrides de metatags para páginas específicas.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {seoPages.map(page => (
                        <div 
                          key={page.id} 
                          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex py-1 px-2.5 bg-slate-100 text-[10px] font-black text-slate-700 rounded-md font-mono">
                                {page.url}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPage({ id: page.id, url: page.url, title: page.title, description: page.description });
                                    setShowPageModal(true);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-150 rounded-lg transition-all"
                                  title="Editar Metatags"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePageSEO(page.id)}
                                  className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                  title="Excluir Configuração"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">{page.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{page.description || 'Nenhuma descrição fornecida.'}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active Helmet Page
                            </span>
                            <a 
                              href={page.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[9px] font-medium text-slate-400 hover:text-brand-600 flex items-center gap-1"
                            >
                              Testar <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {activeSubTab === 'images' && (() => {
            const imageCategories = [
              { slug: 'all', label: 'Todos os Ativos', count: Object.keys(defaultLayoutImagesGlobal).length },
              { slug: 'about', label: 'Sobre Nós', count: Object.values(defaultLayoutImagesGlobal).filter(img => img.pageSlug === 'about').length },
              { slug: 'link_building', label: 'Link Building', count: Object.values(defaultLayoutImagesGlobal).filter(img => img.pageSlug === 'link_building').length },
              { slug: 'seo_expert', label: 'Especialista SEO', count: Object.values(defaultLayoutImagesGlobal).filter(img => img.pageSlug === 'seo_expert').length },
              { slug: 'consulting', label: 'Consultoria SEO', count: Object.values(defaultLayoutImagesGlobal).filter(img => img.pageSlug === 'consulting').length },
              { slug: 'ecommerce', label: 'SEO E-commerce', count: Object.values(defaultLayoutImagesGlobal).filter(img => img.pageSlug === 'ecommerce').length }
            ];

            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8 animate-fade-in"
              >
                {/* ACCORDION FAQ-STYLE GUIDE FOR PERFORMANCE AND SEO (CASCADING TWO-TIER) */}
                <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                  {/* Master Level 1 Accordion Header Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setGuideExpanded(!guideExpanded);
                      // Close any active sub-guide to reset nicely
                      setOpenGuideIndex(null);
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 px-5 py-4 flex items-center justify-between text-left transition-all border-b border-transparent focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm shrink-0">
                        <AlertCircle size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                          Guia Técnico: Otimização Extrema & SEO de Imagens
                        </h4>
                        <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                          Clique aqui para abrir os 3 tópicos de performance e ranqueamento
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                        {guideExpanded ? "Fechar Guia" : "Abrir Guia"}
                      </span>
                      {guideExpanded ? (
                        <ChevronUp size={15} className="text-slate-500 stroke-[2.5]" />
                      ) : (
                        <ChevronDown size={15} className="text-slate-500 stroke-[2.5]" />
                      )}
                    </div>
                  </button>

                  {/* Level 2 Expandable Cascading Panel */}
                  {guideExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="divide-y divide-slate-100 bg-slate-50/20"
                    >
                      {/* Sub-item 1 */}
                      <div className="group">
                        <button
                          type="button"
                          onClick={() => setOpenGuideIndex(openGuideIndex === 1 ? null : 1)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-100/30 transition-all border-l-2 border-transparent hover:border-brand-500"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[9px] font-extrabold text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-md shrink-0">
                              01
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide group-hover:text-brand-650 transition-colors">
                              Otimização Extrema de Imagens (Por que utilizar WebP?)
                            </span>
                          </div>
                          {openGuideIndex === 1 ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </button>
                        
                        {openGuideIndex === 1 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-5 pb-4 bg-slate-100/10 text-[11px] text-slate-650 leading-relaxed border-t border-slate-100/50 pt-2 ml-7 pr-8"
                          >
                            Para velocidade máxima e notas altas nas ferramentas como o Google PageSpeed, envie suas imagens sempre no formato <strong>WebP</strong> (gerado no Photoshop, Canva ou conversores online). O arquivo WebP corta cerca de <strong>35% do peso de carregamento</strong> do site se comparado aos formatos de imagem tradicionais sem perder qualquer nitidez ou fidelidade visual!
                          </motion.div>
                        )}
                      </div>

                      {/* Sub-item 2 */}
                      <div className="group">
                        <button
                          type="button"
                          onClick={() => setOpenGuideIndex(openGuideIndex === 2 ? null : 2)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-100/30 transition-all border-l-2 border-transparent hover:border-brand-500"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[9px] font-extrabold text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-md shrink-0">
                              02
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide group-hover:text-brand-650 transition-colors">
                              Atributo Alt Text & Imagens (Ranqueamento Orgânico no Google)
                            </span>
                          </div>
                          {openGuideIndex === 2 ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </button>
                        
                        {openGuideIndex === 2 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-5 pb-4 bg-slate-100/10 text-[11px] text-slate-650 leading-relaxed border-t border-slate-100/50 pt-2 ml-7 pr-8"
                          >
                            O preenchimento do <strong>Alt Text (Texto Alternativo)</strong> é um fator crucial e altamente considerado no algoritmo orgânico de ranqueamento para o Google Imagens. Descreva rigorosamente o que está contido no arquivo ou utilize palavras-chave de conversão ricas para que indexadores consigam catalogar sua página com qualidade de ponta.
                          </motion.div>
                        )}
                      </div>

                      {/* Sub-item 3 */}
                      <div className="group">
                        <button
                          type="button"
                          onClick={() => setOpenGuideIndex(openGuideIndex === 3 ? null : 3)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-100/30 transition-all border-l-2 border-transparent hover:border-brand-500"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[9px] font-extrabold text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-md shrink-0">
                              03
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide group-hover:text-brand-650 transition-colors">
                              Super Caching de Ativos do Sistema (Latência de 0ms)
                            </span>
                          </div>
                          {openGuideIndex === 3 ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </button>
                        
                        {openGuideIndex === 3 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-5 pb-4 bg-slate-100/10 text-[11px] text-slate-650 leading-relaxed border-t border-slate-100/50 pt-2 ml-7 pr-8"
                          >
                            Através do mecanismo exclusivo de <strong>Hidratação de Caching Inteligente por LocalStorage</strong>, todos os logotipos, favicon e assets personalizados do painel de layout são hidratados localmente em <strong>0ms</strong> (instantâneo), eliminando acessos redundantes à nuvem e reduzindo a latência do site final no usuário.
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* VISUAL PAGE TABS SWITCHER FOR INTUITIVE CATEGORIZATION */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrar Ativos por Página do Site:</span>
                  <div className="flex flex-wrap gap-2 pb-2">
                    {imageCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setImagePageFilter(cat.slug)}
                        className={`px-4 py-2.5 rounded-2xl text-[10.5px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
                          imagePageFilter === cat.slug
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 border-slate-900'
                            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        {cat.label}
                        <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md ${
                          imagePageFilter === cat.slug ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {successImages && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
                    <CheckCircle2 size={16} />
                    Configurações de imagem salvas e publicadas!
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(defaultLayoutImagesGlobal)
                    .filter((key) => {
                      const info = defaultLayoutImagesGlobal[key];
                      return imagePageFilter === 'all' || info.pageSlug === imagePageFilter;
                    })
                    .map((key) => {
                      const info = defaultLayoutImagesGlobal[key];
                      const currentData = layoutImagesState[key] || { url: info.url, alt: info.alt, title: info.title };
                      
                      return (
                        <div key={key} className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-brand-500/20 hover:shadow-md transition-all flex flex-col gap-4 group">
                          <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
                            {currentData.url ? (
                              <img 
                                src={currentData.url} 
                                alt={currentData.alt} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-350">
                                <ImageIcon size={32} className="stroke-[1.5]" />
                              </div>
                            )}
                            
                            {/* Rich group identifying slug and page visually */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                              <span className="bg-slate-900/85 text-white text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md">
                                {key}
                              </span>
                              <span className="bg-brand-600/90 backdrop-blur-md text-white text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                                {info.pageName}
                              </span>
                            </div>

                            <div className="absolute top-2.5 right-2.5 bg-brand-600/95 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm">
                              {info.recommendedSize}
                            </div>
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col gap-1">
                              <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{info.label}</h3>
                              <span className="text-[9px] font-extrabold text-brand-650 bg-brand-50/65 px-2 py-0.5 rounded-md border border-brand-100 w-max mt-0.5">
                                Resolução Ideal: {info.recommendedSize}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono line-clamp-1 truncate pt-1">{currentData.url || 'Nenhuma imagem configurada'}</p>
                            
                            <div className="pt-2 mt-2 border-t border-slate-200/50 space-y-1">
                              <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">Texto Alternativo (Alt):</span>
                              <p className="text-[10px] text-slate-650 font-medium italic line-clamp-2 leading-relaxed">
                                "{currentData.alt || 'Nenhum texto alternativo configurado'}"
                              </p>
                            </div>

                            <div className="pt-2.5 mt-2.5 border-t border-slate-200/50 flex flex-wrap gap-1">
                              <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-450 w-full mb-0.5">Formato Real no Sistema:</span>
                              {info.aspects.map((asp, index) => (
                                <span key={index} className="text-[8px] font-extrabold text-slate-600 bg-slate-150 border border-slate-200 px-2 py-0.5 rounded-md">
                                  {asp.label} ({asp.ratioClass.replace('aspect-[', '').replace(']', '')})
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingImageKey(key);
                              setEditingImageUrl(currentData.url);
                              setEditingImageAlt(currentData.alt);
                              setEditingImageTitle(currentData.title);
                              setSelectedAspectIndex(0);
                              setImageMode('upload');
                              setShowImageModal(true);
                            }}
                            className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 border border-slate-200/80 hover:border-slate-900 text-slate-700 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                          >
                            <Edit2 size={11} />
                            Editar Imagem & ALT
                          </button>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            );
          })()}

          {activeSubTab === 'whatsapp' && (
            <form onSubmit={handleSave} className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8 max-w-4xl"
              >
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 items-start">
                  <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Modelos de Abordagem Comercial</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Defina as mensagens padrão que serão enviadas aos seus leads diretamente para o WhatsApp. Ao clicar no ícone do WhatsApp no CRM de Leads, a mensagem será aberta no WhatsApp Web ou aplicativo contendo todas as variáveis substituídas.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/65 space-y-2">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Variáveis Disponíveis para Substituição</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center font-mono">
                      <strong className="text-brand-600 font-bold block mb-1 text-[11px]">{`{nome}`}</strong>
                      <span className="text-[9px] text-slate-500 font-sans">Nome do lead</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center font-mono">
                      <strong className="text-brand-600 font-bold block mb-1 text-[11px]">{`{telefone}`}</strong>
                      <span className="text-[9px] text-slate-500 font-sans">Celular do cliente</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center font-mono">
                      <strong className="text-brand-600 font-bold block mb-1 text-[11px]">{`{empresa}`} / {`{site}`}</strong>
                      <span className="text-[9px] text-slate-500 font-sans">Empresa ou URL</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center font-mono">
                      <strong className="text-brand-600 font-bold block mb-1 text-[11px]">{`{mensagem}`}</strong>
                      <span className="text-[9px] text-slate-500 font-sans">Texto enviado</span>
                    </div>
                  </div>
                </div>

                {/* CONTATO FORM TEMPLATE */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Mensagem para Leads de Contato</label>
                  <textarea 
                    rows={5}
                    value={whatsappContactTemplate}
                    onChange={e => setWhatsappContactTemplate(e.target.value)}
                    placeholder="Olá {nome}! Recebemos seu contato no site da Acelera SEO sobre a empresa {empresa}. Como podemos te ajudar?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 leading-relaxed resize-y"
                  />
                  <p className="text-[9px] text-slate-400 ml-1">Variáveis que serão substituídas: <strong>{`{nome}`}</strong>, <strong>{`{empresa}`}</strong>, <strong>{`{telefone}`}</strong>, <strong>{`{mensagem}`}</strong>.</p>
                </div>

                {/* AUDITORIA FORM TEMPLATE */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Mensagem para Leads de Auditoria de SEO</label>
                  <textarea 
                    rows={5}
                    value={whatsappAuditTemplate}
                    onChange={e => setWhatsappAuditTemplate(e.target.value)}
                    placeholder="Olá {nome}! Vi que você realizou uma auditoria de SEO automática no site {site}. Vamos agendar uma apresentação gratuita do relatório técnico?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 leading-relaxed resize-y"
                  />
                  <p className="text-[9px] text-slate-400 ml-1">Variáveis que serão substituídas: <strong>{`{nome}`}</strong>, <strong>{`{site}`}</strong>, <strong>{`{telefone}`}</strong>.</p>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronização Ativa & Propagação de Mensagens</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : 
                   success ? <CheckCircle2 size={14} className="text-white" /> : 'Confirmar Ajustes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* DIALOG SHEET / MODAL FOR ADDING AND EDITING PAGE-LEVEL SEO */}
        {showPageModal && editingPage && (
          <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 md:p-10 lg:p-16 overflow-y-auto flex justify-center items-start md:items-center rounded-[32px] min-h-full">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto"
            >
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {editingPage.id ? 'Editar Metatags da Página' : 'Adicionar Nova Página de SEO'}
                </h3>
                <p className="text-slate-500 text-xs mt-1">Insira os metadados de otimização específicos para a URL mapeada.</p>
              </div>

              <form onSubmit={handleSavePageSEO} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL da Página (Ex: /contato)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingPage.id} // Cannot change route URL for existing, better to delete and recreate so we don't break mappings
                    value={editingPage.url}
                    onChange={e => setEditingPage(prev => prev ? { ...prev, url: e.target.value } : null)}
                    placeholder="/contato"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  {!editingPage.id && <p className="text-[9px] text-slate-400 ml-1">Comece com "/" e use apenas minúsculas. Ex: "/blog" ou "/auditoria-gratis".</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Título da Página (Meta Title)</label>
                    <span className={`text-[9px] font-bold ${editingPage.title.length > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {editingPage.title.length} / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={e => setEditingPage(prev => prev ? { ...prev, title: e.target.value } : null)}
                    placeholder="EX: Contato Comercial | Acelera SEO"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Descrição</label>
                    <span className={`text-[9px] font-bold ${editingPage.description.length > 160 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {editingPage.description.length} / 160
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={editingPage.description}
                    onChange={e => setEditingPage(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Escreva a descrição focada em CTR..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPageModal(false);
                      setEditingPage(null);
                    }}
                    className="py-3.5 px-6 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingPage}
                    className="py-3.5 px-6 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                  >
                    {savingPage ? <Loader2 size={12} className="animate-spin" /> : 'Confirmar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL FOR EDITING LAYOUT IMAGES ALT & SEO DETAILS */}
        {showImageModal && editingImageKey && (
          <div className="absolute inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 md:p-10 lg:p-16 overflow-y-auto flex justify-center items-start md:items-center rounded-[32px] min-h-full">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-white rounded-3xl border border-slate-100 max-w-lg md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full p-6 sm:p-8 md:p-10 shadow-2xl relative my-auto animate-fade-in"
              >
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-brand-600 text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm px-2.5 py-1 bg-brand-50 rounded-lg w-max">
                      <ImageIcon size={10} /> Ativo de Layout
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      Editar Ativo do Sistema
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Configure a imagem do ativo e garanta que as dimensões reais, corte e acessibilidade fiquem perfeitos para o ranqueamento SEO do site.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-brand-600 uppercase bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-lg">
                      Chave: {editingImageKey}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      {activeImageDef?.recommendedSize}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveLayoutImage} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
                    
                    {/* LEFT COLUMN: Visual representations & format ratios */}
                    <div className="space-y-5">
                      {/* Aspect Ratios Switcher Tabs */}
                      {activeImageDef && activeImageDef.aspects && activeImageDef.aspects.length > 0 && (
                        <div className="space-y-2 bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
                          <label className="block text-[10.5px] font-black text-slate-800 uppercase tracking-wide">
                            Formatos Reais de Exibição no Site
                          </label>
                          
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {activeImageDef.aspects.map((aspect, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedAspectIndex(i)}
                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                                  selectedAspectIndex === i
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                              >
                                <span className="font-mono bg-slate-100/10 text-current px-1 rounded text-[8.5px] font-extrabold">
                                  {aspect.ratioClass.replace('aspect-[', '').replace(']', '')}
                                </span>
                                {aspect.label}
                              </button>
                            ))}
                          </div>
                          <p className="text-[9.5px] text-slate-500 italic leading-relaxed pt-1.5 border-t border-slate-200/40 mt-2">
                            * <strong>{activeAspect.label}:</strong> {activeAspect.description}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Visualização no Box Real ({activeAspect.ratioClass.replace('aspect-[', '').replace(']', '')})
                          </label>
                        </div>

                        <div className="h-52 sm:h-72 md:h-[350px] w-full bg-slate-50/50 rounded-2xl border border-slate-200/85 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
                          {/* Grid background reference lines like a canvas for measuring exact box sizes */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
                          
                          <div className={`${activeAspect.ratioClass} w-auto h-auto max-w-full max-h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative flex items-center justify-center transition-all duration-350 ${
                            editingImageKey === 'about_team' ? 'border-[8px] border-slate-100 shadow-xl' :
                            editingImageKey === 'link_building_secondary' ? 'border-[6px] border-slate-100 shadow-lg' : ''
                          }`}>
                            {editingImageUrl && editingImageUrl.trim() ? (
                              <img 
                                src={editingImageUrl} 
                                alt="Preview do layout" 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1200&auto=format&fit=crop";
                                }}
                              />
                            ) : (
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Insira ou anexe uma imagem</p>
                            )}
                            
                            {/* Perfect real proportion tag overlay */}
                            <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm pointer-events-none">
                              Proporção Real: {activeAspect.ratioClass.replace('aspect-[', '').replace(']', '')}
                            </div>
                          </div>
                        </div>
                        <p className="text-[9.5px] text-slate-400 text-center leading-normal italic pt-1">
                          Reflete exatamente as proporções responsivas que o cliente verá no site live.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Settings, inputs, file uploader and SEO accessibility */}
                    <div className="space-y-5">
                      {/* TAB CONTROLS INDENTED */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Método de Importação da Imagem</label>
                        <div className="grid grid-cols-2 p-1 bg-slate-50 border border-slate-200/60 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                              imageMode === 'upload' 
                                ? 'bg-white text-brand-600 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Fazer Upload / Anexar
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                              imageMode === 'url' 
                                ? 'bg-white text-brand-600 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Inserir Link (URL)
                          </button>
                        </div>
                      </div>

                      {imageMode === 'upload' ? (
                        <div className="space-y-1.5 md:min-h-[160px] animate-fade-in">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Carregar Imagem para o Servidor</label>
                          <FileUploader
                            currentUrl={editingImageUrl}
                            onUploadSuccess={(url) => setEditingImageUrl(url)}
                            folder="layout_images"
                            accept="image/webp,image/png,image/jpeg,image/svg+xml"
                          />
                          <p className="text-[9px] text-slate-450 leading-relaxed ml-1">
                            Selecione o arquivo local ou arraste aqui. Imagens <strong>.webp</strong> reduzem o peso em 35% e potencializam os rankings obtidos de Core Web Vitals.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1 animate-fade-in">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL da Imagem (Recomendado: formato *.webp)</label>
                          <input
                            type="url"
                            required
                            value={editingImageUrl}
                            onChange={e => setEditingImageUrl(e.target.value)}
                            placeholder="Cole a URL gerada do Firebase Storage ou Unsplash..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                          />
                          <p className="text-[9px] text-slate-400 ml-1">Para utilizar links externos de repositórios ou CDNs, cole o link absoluto acima.</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Texto Alternativo (Alt Text - Vital para Google SEO!)</label>
                          <span className={`text-[9px] font-bold ${editingImageAlt.length > 120 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {editingImageAlt.length} / 120
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          required
                          maxLength={120}
                          value={editingImageAlt}
                          onChange={e => setEditingImageAlt(e.target.value)}
                          placeholder="EX: Consultor sênior de seo de óculos analisando resultados em tela de notebook..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800 leading-relaxed resize-none"
                        />
                        <p className="text-[9.5px] text-slate-400 leading-normal">
                          Descreva o que está na foto detalhadamente com palavras-chave relevantes de conversão de forma orgânica e legível. Vital para o Google Imagens.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contexto / Título Caption (Opcional)</label>
                        <input
                          type="text"
                          value={editingImageTitle}
                          onChange={e => setEditingImageTitle(e.target.value)}
                          placeholder="Descrição secundária ou legenda interna..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageModal(false);
                        setEditingImageKey(null);
                      }}
                      className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingImages}
                      className="py-3 px-6 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                    >
                      {savingImages ? <Loader2 size={12} className="animate-spin" /> : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

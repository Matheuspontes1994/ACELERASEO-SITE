import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/Tooltip';
import { BLOG_POSTS } from '../data/posts';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function Blog() {
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'blog_posts'), 
      where('status', '==', 'Publicado'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: any[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.clientName || data.clientName === 'Agência') {
          posts.push({ id: doc.id, ...data });
        }
      });
      setDynamicPosts(posts);
    }, (err) => {
      console.error("Erro ao carregar artigos", err);
    });

    return () => unsubscribe();
  }, []);

  const allPosts = [
    ...dynamicPosts.map(dp => ({
      id: dp.id,
      slug: dp.slug,
      category: dp.category || 'Artigo',
      title: dp.title,
      description: dp.description,
      coverImage: dp.coverImage,
      readTime: '5 min de leitura',
      icon: <BookOpen size={24} className="text-brand-500" />
    })),
    ...BLOG_POSTS
  ];

  return (
    <>
      <Helmet>
        <title>Blog e Glossário SEO | Estratégias Avançadas - Acelera SEO</title>
        <meta name="description" content="Aprenda estratégias avançadas de SEO, link building, otimização on-page e conteúdo semântico. Domine o Google com artigos para especialistas e iniciantes." />
        <link rel="canonical" href="https://aceleraseo.com.br/blog" />
        <meta property="og:title" content="Blog e Glossário SEO | Estratégias Avançadas - Acelera SEO" />
        <meta property="og:description" content="Aprenda estratégias avançadas de SEO, link building, otimização on-page e conteúdo semântico. Domine o Google com artigos para especialistas e iniciantes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/blog" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog e Glossário SEO | Estratégias Avançadas - Acelera SEO" />
        <meta name="twitter:description" content="Aprenda as mais poderosas estratégias de posicionamento orgânico e desvende o algoritmo dos motores de busca." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-12 md:pt-20 pb-20 md:pb-32">
        <div className="tech-grid opacity-30" />
        <div className="hero-glow opacity-40" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center w-fit max-w-[90vw] md:max-w-full whitespace-normal flex-wrap text-center justify-center rounded-2xl md:rounded-full bg-white border border-slate-200 shadow-sm text-[11px] sm:text-xs font-semibold text-brand-600 uppercase tracking-widest gap-2 px-4 py-2 mb-6 mx-auto">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> google search optimization
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] font-extrabold text-slate-900 font-display tracking-tight text-balance mb-6 mx-auto">
              Blog & <span className="text-brand-600 italic">Estratégias</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-xl mx-auto text-balance mb-10">
              Inteligência aplicada e conteúdo técnico para quem busca dominar a <span className="text-slate-900 font-medium">performance orgânica</span> de alta complexidade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integrated Filter & Search Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-3 md:p-4 flex flex-col lg:flex-row items-center gap-4"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 flex-grow">
            {['Tudo', 'SEO Técnico', 'Link Building', 'E-E-A-T', 'Atualizações'].map((cat, idx) => (
              <button 
                key={idx}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold tracking-tight transition-all duration-300 ${
                  idx === 0 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-600 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="w-full lg:w-72 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar inteligência..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto relative z-10 px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
            {allPosts.map((post, index) => (
              <motion.article 
                key={post.id && post.id !== '' ? post.id : `post-static-${index}-${post.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all group flex flex-col"
              >
                <Link to={`/blog/${post.slug || 'o-que-e-seo-tecnico-2026'}`} className="flex flex-col h-full cursor-pointer outline-none">
                  <div className="w-full aspect-[1024/565] overflow-hidden rounded-t-3xl relative">
                    <img 
                      src={post.coverImage || "https://aceleraseo.com.br/logo.png"} 
                      alt={typeof post.title === 'string' ? post.title : 'Artigo'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg px-3 py-1.5 shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 transition-all">
                        {post.icon}
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        google search optimization
                      </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight group-hover:text-brand-600 transition-colors leading-tight mb-4 text-center md:text-left">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed flex-grow mb-8 text-justify md:text-left line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between w-full border-t border-slate-100 mt-auto pt-6">
                      <div className="text-sm text-slate-400 font-medium">
                        {post.readTime}
                      </div>
                      <div className="flex items-center text-brand-600 font-bold group-hover:translate-x-2 transition-transform">
                        Ler Artigo <ArrowRight size={18} className="ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl sm:rounded-[3rem] text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl p-10 sm:p-16 md:p-20">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-900 to-slate-900"></div>
             <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
               <h3 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold font-display tracking-tight mb-8">Chega de tentar decifrar o Google sozinho.</h3>
               <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl">
                 Deixe que nossos especialistas técnicos cuidem de tudo: do seu <Tooltip term="sitemap.xml" definition="Arquivo que ajuda os buscadores a encontrar e catalogar o conteúdo do seu site." /> até a construção de uma rede privada de <Tooltip term="Backlinks" definition="Uma rede de sites com alta autoridade indicando o seu site como referência no assunto." /> de alta precisão.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                 <a href="https://wa.me/5531999229927?text=Ol%C3%A1%2C+preciso+de+ajuda+com+o+SEO+da+minha+empresa!" target="_blank" rel="noopener noreferrer" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center px-8 py-4 gap-2">
                   Falar com Especialista <ArrowRight size={18} className="group-hover:translate-x-1" />
                 </a>
                 <Link to="/auditoria" className="bg-white/10 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center backdrop-blur-sm px-8 py-4 gap-2">
                   Fazer Auditoria Grátis <Search size={18} className="text-white/70" />
                 </Link>
               </div>
             </div>
          </div>
        </main>
      </div>
    </>
  );
}

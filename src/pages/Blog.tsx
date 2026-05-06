import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/Tooltip';
import { BLOG_POSTS } from '../data/posts';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function Blog() {
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'blog_posts'), 
          where('status', '==', 'Publicado'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const posts: any[] = [];
        snapshot.forEach(doc => {
           const data = doc.data();
           if (!data.clientName || data.clientName === 'Agência') {
             posts.push({ id: doc.id, ...data });
           }
        });
        setDynamicPosts(posts);
      } catch (err) {
        console.error("Erro ao carregar artigos", err);
      }
    };
    fetchPosts();
  }, []);

  const allPosts = [
    ...dynamicPosts.map(dp => ({
      id: dp.id,
      slug: dp.slug,
      category: dp.category || 'Artigo',
      title: dp.title,
      description: dp.description,
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

      <div className="min-h-screen bg-slate-50 relative overflow-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-24">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-brand-900/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-[120px] pointer-events-none"></div>

        <main className="max-w-7xl mx-auto relative z-10 px-6">
          <Breadcrumbs />
          
          <header className="text-center mb-20">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-white text-brand-600 border border-brand-100 shadow-sm mb-6">
               <BookOpen size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-display mb-6 text-center md:text-center">
              Conteúdo & <span className="text-brand-600">Glossário SEO</span>
            </h1>
            <p className="text-xl text-slate-500 font-light max-w-3xl mx-auto mb-10 text-justify md:text-center">
              Tudo o que você precisa saber sobre o algoritmo do Google, desde o básico até estratégias técnicas avançadas de rastreamento e indexação.
            </p>
          </header>

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
                <Link to={`/blog/${post.slug || 'o-que-e-seo-tecnico-2026'}`} className="flex flex-col h-full cursor-pointer outline-none p-6 sm:p-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 group-hover:scale-110 transition-all mb-6">
                    {post.icon}
                  </div>
                  <span className="self-start bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 mb-4">
                    {post.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-4 text-center md:text-left">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed flex-grow mb-8 text-justify md:text-left">
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
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl sm:rounded-[2.5rem] text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl p-8 sm:p-12 md:p-16">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-900 to-slate-900"></div>
             <div className="relative z-10 max-w-2xl mx-auto">
               <h3 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold tracking-tight mb-6 text-center md:text-left">Chega de tentar decifrar o Google sozinho.</h3>
               <p className="text-slate-300 text-lg font-light leading-relaxed mb-10 text-justify md:text-left">
                 Deixe que nossos especialistas técnicos cuidem de tudo: do seu <Tooltip term="sitemap.xml" definition="Arquivo que ajuda os buscadores a encontrar e catalogar o conteúdo do seu site." /> até a construção de uma rede privada de <Tooltip term="Backlinks" definition="Uma rede de sites com alta autoridade indicando o seu site como referência no assunto." /> de alta precisão.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+de+ajuda+com+o+SEO+da+minha+empresa!" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-all flex items-center justify-center shadow-lg shadow-brand-500/20 text-center px-6 sm:px-8 py-4 gap-2">
                   Falar com Especialista
                 </a>
                 <Link to="/auditoria" className="w-full sm:w-auto bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center backdrop-blur-sm text-center px-6 sm:px-8 py-4 gap-2">
                   Fazer Auditoria do Meu Site
                 </Link>
               </div>
             </div>
          </div>
        </main>
      </div>
    </>
  );
}

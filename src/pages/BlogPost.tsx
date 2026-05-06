import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../data/posts';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { JsonLd } from '../components/JsonLd';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Schema for BlogPosting
  const blogSchema = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titleString || post.title,
    "description": post.description || post.excerpt,
    "image": post.coverImage || "https://aceleraseo.com.br/logo.png",
    "author": {
      "@type": "Organization",
      "name": "Acelera SEO"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Acelera SEO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aceleraseo.com.br/logo.png"
      }
    },
    "datePublished": post.date ? post.date.split('/').reverse().join('-') : new Date().toISOString()
  } : null;

  useEffect(() => {
    const fetchPost = async () => {
      // First check static posts
      const staticPost = BLOG_POSTS.find(p => p.slug === slug);
      if (staticPost) {
        setPost({
          ...staticPost,
          titleString: staticPost.titleString || (typeof staticPost.title === 'string' ? staticPost.title : 'Artigo')
        });
        setLoading(false);
        return;
      }

      // Then check firebase
      try {
        const q = query(collection(db, 'blog_posts'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setPost({
            ...docData,
            titleString: docData.title,
            title: docData.title,
            excerpt: docData.description,
            date: docData.createdAt?.toDate ? docData.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente',
            readTime: '5 min de leitura'
          });
        } else {
          setPost({
            titleString: "Artigo não encontrado",
            title: "Artigo não encontrado",
            excerpt: "O artigo que você procura não existe.",
            content: "Retorne para a página inicial.",
            date: "",
            readTime: "",
            category: "Erro",
            coverImage: ""
          });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const author = {
    name: "Acelera SEO",
    role: "Redação",
    avatar: "/logo.png"
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 text-center text-slate-500 font-medium pt-16 md:pt-16 lg:pt-32">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      <Helmet>
        <title>{post.titleString} | Acelera SEO</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://aceleraseo.com.br/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.titleString} | Acelera SEO`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://aceleraseo.com.br/blog/${post.slug}`} />
        <meta property="og:image" content={post.coverImage || "https://aceleraseo.com.br/logo.png"} />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.titleString} | Acelera SEO`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage || "https://aceleraseo.com.br/logo.png"} />
      </Helmet>

      {blogSchema && <JsonLd data={blogSchema} />}

      {/* Hero Header Section */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-8 md:pt-16 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="tech-grid" />
        <div className="hero-glow" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
           <header className="max-w-4xl mx-auto text-center">
            <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors gap-2 mb-6">
              <ArrowLeft size={16} /> Voltar para o Blog
            </Link>
            <div className="flex items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-500 gap-3 mb-6">
              <span className="text-brand-600 bg-brand-50 rounded-full px-3 py-1">{post.category}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14}/> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14}/> {post.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.1] mb-6 text-balance">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-3xl mx-auto text-balance">
              {post.excerpt}
            </p>
          </header>
        </div>
      </section>

      <article className="max-w-7xl mx-auto grid lg:grid-cols-12 px-6 gap-12 py-12 md:py-16">
        {/* Cover Image */}
        <div className="lg:col-span-12 aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
          <img src={post.coverImage} alt={post.titleString} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent mix-blend-multiply"></div>
        </div>

        {/* Article Body + Sidebar */}
        <div className="lg:col-span-12 grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 lg:col-start-2 prose prose-lg prose-slate prose-headings:font-display prose-headings:tracking-tight prose-headings:font-extrabold prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-3xl max-w-none">
            
            {post.id && typeof post.id === 'string' ? (
              <div className="markdown-body">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
              </div>
            ) : (
              <>
                <p className="lead">
                  {post.content} - Muita gente acredita que SEO se resume a repetir palavras-chave dentro do texto e esperar a mágica acontecer. Mas, com as atualizações recentes do algoritmo do Google, o jogo mudou drasticamente.
                </p>

                <h2>A Fundação Invisível do Seu Site</h2>
                <p>
                  Imagine construir uma casa lindíssima. A arquitetura é moderna, os móveis são de design, a pintura é impecável (este é o seu <strong>Conteúdo e Design</strong>). Porém, a fundação está cedendo, os canos vazam e a eletricidade dá curto-circuito (este é o seu <strong>SEO Técnico</strong>).
                </p>
                <p>
                  Não importa o quão bom seja seu artigo se os robôs do Google (os <em>crawlers</em>) não conseguem encontrar, ler ou interpretar suas páginas. O SEO Técnico remove todos os obstáculos técnicos que impedem seu site de ranquear.
                </p>

                <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-8 my-10">
                  <h3 className="text-white flex items-center mt-0 mb-4 gap-3 text-center md:text-left">
                    <CheckCircle2 className="text-brand-400" /> Checklist Essencial de SEO Técnico
                  </h3>
                  <ul className="text-slate-300">
                    <li><strong>Velocidade de Carregamento (Core Web Vitals):</strong> O Google penaliza sites lentos.</li>
                    <li><strong>Arquitetura de Tags (H1, H2, H3):</strong> Facilita a leitura do robô.</li>
                    <li><strong>Indexabilidade (sitemap.xml e robots.txt):</strong> O mapa do tesouro para o buscador.</li>
                    <li><strong>Dados Estruturados (Schema Markup):</strong> Ajuda a ganhar resultados ricos (Rich Snippets).</li>
                  </ul>
                </div>

                <h2>Como resolver os principais erros?</h2>
                <p>
                  Um dos problemas mais comuns que encontramos nas auditorias é o <strong>bloqueio acidental</strong> no arquivo <code>robots.txt</code> ou tags <code>noindex</code> deixadas para trás pós-migração de site. Isso literalmente diz ao Google: "Por favor, ignore meu site".
                </p>

                <h3>1. Core Web Vitals (LCP, FID, CLS)</h3>
                <p>
                  Ninguém gosta de esperar uma página carregar, muito menos o Google. Imagens pesadas e JavaScript desnecessário são os maiores vilões. Hoje, ferramentas como o <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a> são mandatórias.
                </p>

                <h3>2. Otimização para Mobile (Mobile-First Indexing)</h3>
                <p>
                  Desde 2019, o Google classifica seu site com base na versão mobile. Se o seu site não é perfeitamente responsivo (botões muito próximos, fontes pequenas), você já está perdendo posições valiosas todos os dias.
                </p>

                <h2>Conclusão</h2>
                <p>
                  O SEO Técnico não é um luxo, é a <strong>pré-condição</strong> para você existir no Google em 2026. Invista tempo corrigindo sua infraestrutura. Se você não sabe por onde começar, faça nossa <Link to="/auditoria">Auditoria Gratuita</Link> e tenha um checklist prático em 30 segundos.
                </p>
              </>
            )}

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-8 text-justify md:text-left">
              {/* Author Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 p-2">
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{author.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Agência especializada em decodificar algoritmos e posicionar empresas no topo das buscas orgânicas.
                </p>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4">Índice do Artigo</h4>
                <ul className="space-y-3 text-sm font-medium text-slate-500">
                  <li><a href="#" className="hover:text-brand-600 transition-colors">A Fundação Invisível</a></li>
                  <li><a href="#" className="hover:text-brand-600 transition-colors pl-4">Checklist Essencial</a></li>
                  <li><a href="#" className="hover:text-brand-600 transition-colors">Como resolver erros</a></li>
                  <li><a href="#" className="hover:text-brand-600 transition-colors pl-4">1. Core Web Vitals</a></li>
                  <li><a href="#" className="hover:text-brand-600 transition-colors pl-4">2. Mobile-First</a></li>
                  <li><a href="#" className="hover:text-brand-600 transition-colors">Conclusão</a></li>
                </ul>
              </div>

              {/* Share */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center mb-4 gap-2">
                  <Share2 size={16} /> Compartilhar
                </h4>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:border-[#1877F2] hover:text-[#1877F2] transition-colors shadow-sm py-3">
                    <Facebook size={18} />
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-colors shadow-sm py-3">
                    <Twitter size={18} />
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors shadow-sm py-3">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Post CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="bg-brand-600 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl p-10 md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-500 via-brand-600 to-brand-700"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold font-display mb-4 text-center md:text-left">Descubra os erros técnicos do seu site.</h3>
            <p className="text-lg text-brand-100 max-w-xl mx-auto mb-8">
              Nossa auditoria gratuita analisa todas as métricas técnicas abordadas neste artigo em menos de 1 minuto.
            </p>
            <Link to="/auditoria" className="inline-flex items-center bg-white text-brand-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl gap-2 px-8 py-4">
              Fazer Auditoria Agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

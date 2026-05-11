import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, useScroll, useSpring } from 'motion/react';
import Skeleton from '../components/ui/Skeleton';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, CheckCircle2, ArrowRight, Bookmark, BookOpen, Activity, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../data/posts';
import { collection, query, where, getDocs, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { JsonLd } from '../components/JsonLd';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{id: string, text: string, level: number}[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Function to generate slugs for anchors
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Function to extract headers for TOC
  const extractHeaders = (content: string) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const headers: {id: string, text: string, level: number}[] = [];
    
    // Regex for # H1, ## H2, ### H3
    const headerRegex = /^(#{1,3})\s+(.*)/;
    
    lines.forEach(line => {
      const match = line.match(headerRegex);
      if (match) {
        const level = match[1].length; 
        const text = match[2].replace(/[#*`_]/g, '').trim();
        if (text) {
          headers.push({
            id: slugify(text),
            text: text,
            level: level
          });
        }
      }
    });
    
    return headers;
  };

  // Custom component to render headers with IDs
  const HeaderWithId = ({ level, children }: any) => {
    const text = React.Children.toArray(children).join('');
    const id = slugify(text);
    const Tag = `h${level}` as any;
    
    // Add anchor styles for hover
    return (
      <Tag id={id} className="group relative">
        <a 
          href={`#${id}`} 
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400 no-underline hidden md:inline"
          aria-hidden="true"
        >
          #
        </a>
        {children}
      </Tag>
    );
  };

  // Schema for BlogPosting
  const blogSchema = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://aceleraseo.com.br/blog/${slug}`
    },
    "headline": post.titleString || post.title,
    "description": post.excerpt || post.description,
    "image": post.coverImage || "https://aceleraseo.com.br/logo.png",
    "author": {
      "@type": "Organization",
      "name": "Acelera SEO",
      "url": "https://aceleraseo.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Acelera SEO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aceleraseo.com.br/logo.png"
      }
    },
    "datePublished": post.dateISO || new Date().toISOString(),
    "dateModified": post.dateISO || new Date().toISOString(),
    "articleSection": post.category || "SEO"
  } : null;

  useEffect(() => {
    // First check static posts
    const staticPost = BLOG_POSTS.find(p => p.slug === slug);
    if (staticPost) {
      setPost({
        ...staticPost,
        titleString: staticPost.titleString || (typeof staticPost.title === 'string' ? staticPost.title : 'Artigo'),
        dateISO: staticPost.date ? staticPost.date.split('/').reverse().join('-') : new Date().toISOString()
      });
      setToc(extractHeaders(staticPost.content || ""));
      setLoading(false);
      return;
    }

    // Then check firebase
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'blog_posts'), 
      where('slug', '==', slug), 
      where('status', '==', 'Publicado'), 
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const date = docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date();
        const currentPost = {
          ...docData,
          id: snapshot.docs[0].id,
          titleString: docData.title,
          title: docData.title,
          excerpt: docData.description,
          date: date.toLocaleDateString('pt-BR'),
          dateISO: date.toISOString(),
          readTime: `${Math.ceil((docData.content?.split(' ').length || 0) / 200)} min de leitura`
        };
        setPost(currentPost);
        setToc(extractHeaders(docData.content || ""));
        
        // Fetch related posts from same category
        if (db) {
          const relatedQ = query(
            collection(db, 'blog_posts'),
            where('category', '==', docData.category),
            where('status', '==', 'Publicado'),
            limit(3)
          );
          getDocs(relatedQ).then(snap => {
            const related = snap.docs
              .filter(d => d.id !== snapshot.docs[0].id)
              .map(d => ({ ...d.data(), id: d.id }));
            setRelatedPosts(related);
          });
        }
      } else if (!loading) {
        // Only set 404 if we are not initial loading
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
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar artigo real-time:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  const author = {
    name: "Acelera SEO",
    role: "Redação",
    avatar: "/logo.png"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 space-y-12">
        <div className="h-1.5 w-full bg-slate-100" />
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <Skeleton variant="rectangular" className="h-4 w-32" />
            <div className="space-y-4">
              <Skeleton variant="rectangular" className="h-12 w-3/4" />
              <Skeleton variant="rectangular" className="h-6 w-1/2" />
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-6">
          <Skeleton variant="rectangular" className="aspect-[21/9] rounded-[3.5rem]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-20 py-16">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton variant="rectangular" className="h-6 w-full" />
            <Skeleton variant="rectangular" className="h-6 w-full" />
            <Skeleton variant="rectangular" className="h-6 w-3/4" />
            <Skeleton variant="rectangular" className="h-40 w-full" />
          </div>
          <div className="lg:col-span-4 space-y-12">
            <Skeleton variant="rectangular" className="h-64 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-0 pb-0">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand-600 z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <Helmet>
        <title>{post.titleString} | Acelera SEO</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://aceleraseo.com.br/blog/${slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://aceleraseo.com.br/blog/${slug}`} />
        <meta property="og:title" content={`${post.titleString} | Acelera SEO`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage || "https://aceleraseo.com.br/logo.png"} />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="article:published_time" content={post.dateISO || new Date().toISOString()} />
        <meta property="article:author" content="Acelera SEO" />
        <meta property="article:section" content={post.category || "SEO"} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://aceleraseo.com.br/blog/${slug}`} />
        <meta name="twitter:title" content={`${post.titleString} | Acelera SEO`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage || "https://aceleraseo.com.br/logo.png"} />
        <meta name="twitter:creator" content="@aceleraseo" />

        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </Helmet>

      {blogSchema && <JsonLd data={blogSchema} />}

      {/* Hero Header Section */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/50 bg-slate-50/50 pt-16 md:pt-20 pb-12 md:pb-16">
        <div className="tech-grid opacity-10" />
        <div className="hero-glow opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-8">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-brand-600 transition-all gap-2 group w-fit"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Blog
            </Link>

            <header className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-white text-brand-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  {post.category}
                </span>
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300" /> {post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-500/30" />
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-300" /> {post.readTime}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-slate-900 font-display tracking-tight leading-[1.05] mb-8">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 border-l-2 border-brand-500/30 pl-6 py-1">
                <p className="text-base text-slate-500 font-medium leading-relaxed max-w-2xl italic">
                  {post.excerpt}
                </p>
              </div>
            </header>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
        <div className="aspect-[21/9] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative group">
          <img 
            src={post.coverImage || "https://aceleraseo.com.br/logo.png"} 
            alt={post.titleString} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 max-w-3xl w-full">
            {(post.id || (post.content && post.content.length > 300)) ? (
              <div className="markdown-body prose-lg md:prose-xl prose-slate md:prose-headings:text-5xl prose-headings:font-display prose-headings:tracking-tight prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-img:rounded-[2rem] prose-img:aspect-[21/9] prose-img:object-cover prose-img:shadow-xl prose-blockquote:border-l-brand-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-code:text-brand-600">
                <ReactMarkdown 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({node, ...props}) => <HeaderWithId level={1} {...props} />,
                    h2: ({node, ...props}) => <HeaderWithId level={2} {...props} />,
                    h3: ({node, ...props}) => <HeaderWithId level={3} {...props} />
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="prose-lg md:prose-xl prose-slate md:prose-headings:text-5xl prose-headings:font-display prose-headings:tracking-tight prose-headings:font-black">
                <p className="lead text-2xl text-slate-900 font-medium leading-normal mb-12">
                  {post.content} - Muita gente acredita que SEO se resume a repetir palavras-chave dentro do texto e esperar a mágica acontecer. Mas, com as atualizações recentes do algoritmo do Google, o jogo mudou drasticamente.
                </p>

                <h2 className="scroll-mt-32">A Fundação Invisível do Seu Site</h2>
                <p>
                  Imagine construir uma casa lindíssima. A arquitetura é moderna, os móveis são de design, a pintura é impecável (este é o seu <strong>Conteúdo e Design</strong>). Porém, a fundação está cedendo, os canos vazam e a eletricidade dá curto-circuito (este é o seu <strong>SEO Técnico</strong>).
                </p>
                
                <div className="bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-2xl p-10 my-16 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-500/20 transition-all" />
                  <h3 className="text-white flex items-center mt-0 mb-6 gap-3 text-2xl font-display">
                    <CheckCircle2 className="text-brand-400 shrink-0" size={28} /> Checklist de SEO Técnico
                  </h3>
                  <ul className="text-slate-300 space-y-4 m-0 p-0 list-none">
                    <li className="flex items-start gap-3"><span className="text-brand-400 font-bold">01.</span> <strong>Velocidade de Carregamento:</strong> O Google penaliza sites lentos.</li>
                    <li className="flex items-start gap-3"><span className="text-brand-400 font-bold">02.</span> <strong>Arquitetura de Tags:</strong> Facilita a leitura do robô.</li>
                    <li className="flex items-start gap-3"><span className="text-brand-400 font-bold">03.</span> <strong>Indexabilidade:</strong> O mapa do tesouro para o buscador.</li>
                    <li className="flex items-start gap-3"><span className="text-brand-400 font-bold">04.</span> <strong>Dados Estruturados:</strong> Ajuda a ganhar resultados ricos.</li>
                  </ul>
                </div>

                <h2 className="scroll-mt-32">Como resolver os principais erros?</h2>
                <p>
                  Um dos problemas mais comuns que encontramos nas auditorias é o <strong>bloqueio acidental</strong> no arquivo <code>robots.txt</code> ou tags <code>noindex</code> deixadas para trás pós-migração de site. Isso literalmente diz ao Google: "Por favor, ignore meu site".
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:pl-10 border-l border-slate-100 hidden lg:block">
            <div className="sticky top-32 space-y-12">
              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:shadow-md transition-all flex items-center justify-center gap-2 group text-[10px] font-black uppercase tracking-widest leading-none">
                  <Bookmark size={16} className="group-hover:scale-110 transition-transform" /> Salvar
                </button>
                <button className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:shadow-md transition-all flex items-center justify-center gap-2 group text-[10px] font-black uppercase tracking-widest leading-none">
                  <Share2 size={16} className="group-hover:scale-110 transition-transform" /> Compartilhar
                </button>
              </div>

              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-500" /> Conteúdo do Artigo
                  </h4>
                  <ul className="space-y-4 text-sm font-medium">
                    {toc.map((item, index) => (
                      <li key={index} style={{ paddingLeft: item.level === 3 ? '1.5rem' : '0' }}>
                        <a 
                          href={`#${item.id}`} 
                          className="text-slate-500 hover:text-brand-600 transition-all flex items-start gap-3 group"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(item.id);
                            if (element) {
                              const yOffset = -100;
                              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }}
                        >
                          <span className="text-[10px] font-black text-slate-300 mt-1">{String(index + 1).padStart(2, '0')}</span>
                          <span className="leading-tight group-hover:translate-x-1 transition-transform">{item.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-500" /> Continue Lendo
                  </h4>
                  <div className="space-y-8">
                    {relatedPosts.map((r, i) => (
                      <Link key={i} to={`/blog/${r.slug}`} className="group block">
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-4 border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                           <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <h5 className="text-[15px] font-black text-slate-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                          {r.title}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Author/Newsletter */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl -mr-8 -mt-8" />
                <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-400 mb-4">Acelera SEO</h4>
                  <p className="text-sm text-slate-300 leading-relaxed mb-8">
                    Acompanhe nossas análises técnicas semanais sobre o ecossistema de busca do Google.
                  </p>
                  <a href="https://wa.me/5531999229927" target="_blank" rel="noopener noreferrer" className="w-full bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-50 transition-all group">
                    Falar com Time <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Related Section (Mobile only) */}
      <div className="lg:hidden px-6 pb-16">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Artigos Relacionados</h4>
         <div className="grid sm:grid-cols-2 gap-6">
            {relatedPosts.map((r, i) => (
              <Link key={i} to={`/blog/${r.slug}`} className="group block">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-slate-100">
                    <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h5 className="text-base font-black text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
                  {r.title}
                </h5>
              </Link>
            ))}
         </div>
      </div>
      {/* Post CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-12 mb-24">
        <div className="bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl p-10 md:p-20 group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-900 to-slate-900"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-8">
               <Search size={32} className="text-brand-400" />
            </div>
            <h3 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight mb-6">Analise seu site agora.</h3>
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl">
              Nossa auditoria gratuita analisa todas as métricas técnicas abordadas neste artigo em menos de 1 minuto. Comece a subir no Google hoje.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <Link to="/auditoria" className="bg-brand-600 text-white font-bold text-base rounded-xl hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center px-10 py-5 gap-2">
                Fazer Auditoria Grátis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

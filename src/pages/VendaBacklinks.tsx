import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, ExternalLink, ShieldCheck, CheckCircle2, TrendingUp, Handshake, Network, ArrowRight } from 'lucide-react';

export default function VendaBacklinksPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-8 md:pt-24 pb-12 md:pb-16 lg:pb-20">
      <Helmet>
        <title>Venda de Backlinks | Link Building e Digital PR | Agência SEO</title>
        <meta name="description" content="Na Acelera SEO você acessa a venda de backlinks essenciais para expandir o seu DR. Digital PR altamente qualificado em notícias, parceiros e blogs com alto tráfego." />
        <link rel="canonical" href="https://aceleraseo.com.br/venda-backlinks" />
        <meta property="og:title" content="Venda de Backlinks | Link Building e Digital PR | Agência SEO" />
        <meta property="og:description" content="Na Acelera SEO você acessa a venda de backlinks essenciais para expandir o seu DR. Digital PR altamente qualificado em notícias, parceiros e blogs com alto tráfego." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aceleraseo.com.br/venda-backlinks" />
        <meta property="og:site_name" content="Acelera SEO" />
        <meta property="og:image" content="https://aceleraseo.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Venda de Backlinks | Link Building e Digital PR | Agência SEO" />
        <meta name="twitter:description" content="Na Acelera SEO você acessa a venda de backlinks essenciais para expandir o seu DR. Digital PR altamente qualificado em notícias, parceiros e blogs com alto tráfego." />
        <meta name="twitter:image" content="https://aceleraseo.com.br/logo.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative px-6 mb-8 md:mb-8 lg:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-brand-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto border border-brand-100 px-5 mb-8 gap-2">
            <LinkIcon size={16} /> Alta Autoridade de Domínio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05] text-balance font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">
            Venda de Backlinks Premium: Conquiste o Topo do Google
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 text-pretty font-light leading-relaxed mb-12 text-justify md:text-center">
            Ter o site perfeito na técnica não é o suficiente. O Google mede o seu nível de influência pelos sites que apontam para você. Potencialize seu <Link to="/auditoria" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">perfil de SEO</Link> com nossa curadoria especializada em <strong>venda de backlinks</strong> reais.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contato" className="bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center group px-10 py-5 gap-2">
               Conferir Portfólio de Veículos e DR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-2 items-center p-8 md:p-16 gap-8 md:gap-12 lg:gap-16">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border-[12px] border-slate-50 bg-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1549421295-886ec5cd44af?q=80&w=2000&auto=format&fit=crop&fm=webp" 
                 alt="Profissionais de Digital PR negociando pautas em portais de notícias de alta autoridade para aquisição de backlinks" 
                 className="w-full h-full object-cover" 
               />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-slate-900 rounded-2xl shadow-xl w-72 border border-slate-800 p-6">
               <div className="font-bold text-white flex items-center justify-between mb-2">
                 <span>Notícia Portal Tier 1</span> <ExternalLink size={16} className="text-slate-400" />
               </div>
               <div className="text-slate-400 text-sm font-medium tracking-wide mb-4">DR 86 • 2 Milhões Visitas/mês</div>
               <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[86%] rounded-full"></div>
               </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-slate-900 font-display leading-tight mb-8 text-center md:text-left">O Fim dos Links Tóxicos e PBNs Amadoras</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-light text-base md:text-lg text-pretty text-justify md:text-left">
               <p>
                 Muitas empresas destroem seus projetos comprando links baratos (Farm links, PBNs indianas, comentários automatizados). Isso resulta inevitavelmente em punições severas do Google Penguin e no colapso do tráfego orgânico.
               </p>
               <p>
                 Nossa solução de <strong>venda de backlinks</strong> opera estritamente via <em>Digital PR</em> e OutReach manual. Inserimos a sua marca de forma orgânica e contextualizada dentro de publicações reais, escritas por jornalistas e redatores de portais verdadeiros.
               </p>
               <p>
                 Aqui você não compra um "pacote cego". Você escolhe exatamente o portal, valida a métrica de autoridade e aprova o contexto da publicação antes do link ir para o ar.
               </p>
            </div>
            <ul className="space-y-5 border-t border-slate-100 mt-8 pt-8">
              <li className="flex items-start gap-4">
                <ShieldCheck className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg font-medium">Artigos (Guest Posts) contextualizados estritamente dentro do seu segmento semântico.</span>
              </li>
              <li className="flex items-start gap-4">
                <ShieldCheck className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg font-medium">Links garantidos como Dofollow em portais com tráfego orgânico ativo mensal.</span>
              </li>
               <li className="flex items-start gap-4">
                <ShieldCheck className="text-brand-500 shrink-0 mt-1" size={24} />
                <span className="text-slate-700 text-lg font-medium">Ancoragem cirúrgica (Deep Linking) focado no seu Fundo de Funil.</span>
              </li>
            </ul>
             <Link to="/contato" className="inline-flex items-center font-bold text-brand-600 hover:text-brand-700 transition-colors text-lg gap-3 mt-10">
               Falar com Especialistas em Off-Page <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Attributes Section */}
      <section className="bg-slate-900 py-32 mb-28">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-8 lg:mb-20">
               <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1] text-balance font-extrabold text-white font-display tracking-tight mb-8 text-center md:text-center">
                  Como filtramos nosso Inventário Premium?
               </h2>
               <p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">
                  Nem todo link com DR alto é positivo. Nós submetemos cada potencial parceiro a um rigoroso pente-fino de métricas antes de liberá-lo para os nossos clientes de Link Building.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <TrendingUp className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Auditoria de Tráfego</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Nós cruzamos o DR/DA (Ahrefs e Moz) com o tráfego estimado daquele domínio. Um site com "DR 70" mas com zero visitas mensais é uma PBN tóxica camuflada. Só adquirimos backlinks em sites que as pessoas realmente acessam.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Network className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Link Profile Ratio</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Avaliamos a proporção entre links que o site recebe e quantos ele emite externamente (OBL - Outbound Links). Portais de notícias confiáveis não emitem centenas de dofollow diários para cassinos. Isolamos a qualidade.
                   </p>
               </div>
               <div className="bg-slate-800/80 rounded-[2rem] border border-slate-700 backdrop-blur-xl p-10">
                  <Handshake className="text-emerald-400 mb-8" size={48} />
                   <h3 className="text-2xl font-bold text-white mb-5 text-center md:text-left">Relações Diretas</h3>
                   <p className="text-slate-400 font-light leading-relaxed text-lg text-justify md:text-left">
                     Não operamos por terceiros ou plataformas genéricas russas. Nossa equipe negocia e mantém relatórios recorrentes diretamente com os Editores-Chefes e Webmasters locais do Brasil e LATAM.
                   </p>
               </div>
            </div>
         </div>
      </section>

      {/* Call to action */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
           <ExternalLink className="text-brand-500 mx-auto mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-display tracking-tight mb-8 text-center md:text-center">O Fator que Faltava para o Top 1</h2>
           <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">
             Não adianta otimizar a estrutura dezenas de vezes se sua base de autoridade for frágil. Contrate injeções periódicas e crescentes de referências de mercado e ultrapasse seus maiores competidores usando nosso serviço especializado de aquisição.
           </p>
           <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+quero+entender+o+modelo+de+aquisi%C3%A7%C3%A3o+de+backlinks!" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-bold text-xl rounded-2xl hover:bg-brand-600 transition-colors shadow-2xl inline-flex items-center group px-12 py-6 gap-4">
             Solicitar Planos e Inventário de Backlinks
           </a>
        </div>
      </section>
    </div>
  );
}

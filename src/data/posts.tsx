import React from 'react';
import { LinkIcon, Activity, BookOpen, Search } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

export const BLOG_POSTS = [
  {
    id: 1,
    slug: 'o-que-sao-backlinks',
    category: "Glossário SEO",
    title: <>O que são <Tooltip term="Backlinks" definition="Links em outros sites que apontam para o seu site. Funcionam como votos de confiança para o Google." /> e por que seu site é 'invisível' sem eles?</>,
    titleString: "O que são Backlinks e por que seu site é invisível sem eles?",
    description: <>Entenda o conceito de <Tooltip term="Autoridade de Domínio" definition="Métrica que avalia a força do perfil de links de um site (DA/DR), prevendo sua capacidade de ranqueamento." /> (DA/DR). O Google enxerga cada link apontando para o seu site como um voto de confiança.</>,
    excerpt: "Entenda o conceito de Autoridade de Domínio (DA/DR). O Google enxerga cada link apontando para o seu site como um voto de confiança.",
    icon: <LinkIcon size={24} className="text-brand-500" />,
    readTime: "5 min de leitura",
    date: "14 de Maio, 2026",
    content: "Os backlinks são um dos pilares fundamentais do SEO. Eles funcionam como votos de confiança de outros sites para o seu. Quando um site de autoridade aponta para o seu, o Google entende que seu conteúdo é relevante e merece uma posição melhor nos resultados de busca. Existem diversos tipos de backlinks: dofollow (que transmitem autoridade), nofollow (que não transmitem autoridade direta, mas ajudam no tráfego), e backlinks patrocinados. Uma estratégia sólida de link building foca na qualidade e não apenas na quantidade. Ter 1 link de um grande portal de notícias vale mais do que 100 links de sites pequenos e irrelevantes. Além disso, a relevância do nicho é crucial: um link vindo de um site de tecnologia para outro site de tecnologia é muito mais valioso do que um vindo de um blog de culinária.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    slug: 'anatomia-do-site-perfeito',
    category: "SEO Técnico",
    title: <>A anatomia de um site perfeito: Sitemaps, <Tooltip term="Robots.txt" definition="Arquivo que instrui os buscadores sobre quais áreas do site podem ser vasculhadas." /> e <Tooltip term="Canonical Tags" definition="Aviso no código que diz ao Google qual é a página original quando existem conteúdos duplicados." /></>,
    titleString: "A anatomia de um site perfeito",
    description: <><Tooltip term="Crawl Budget" definition="Orçamento de rastreamento. Limite de tempo do robô." />: Como garantir que os robôs do Google rastreiem suas páginas mais importantes sem desperdiçar tempo em URLs inúteis.</>,
    excerpt: "Como garantir que os robôs do Google rastreiem suas páginas mais importantes sem desperdiçar tempo em URLs inúteis.",
    icon: <Activity size={24} className="text-brand-500" />,
    readTime: "7 min de leitura",
    date: "12 de Maio, 2026",
    content: "Um site otimizado tecnicamente é a base para qualquer estratégia de sucesso no Google. O arquivo robots.txt orienta os rastreadores sobre o que não deve ser indexado, economizando o orçamento de rastreamento (crawl budget). O sitemap.xml, por outro lado, é o mapa que mostra todas as URLs importantes que você quer que o Google encontre. As tags canônicas resolvem o problema de conteúdo duplicado, indicando qual é a versão principal de uma página. Além disso, a velocidade de carregamento (Web Vitals) e a responsividade mobile são critérios de rankeamento obrigatórios nos dias de hoje. Um site que demora mais de 3 segundos para carregar perde cerca de 40% de seus visitantes antes mesmo da página abrir completamente.",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 3,
    slug: 'dominar-nicho-no-google',
    category: "Conteúdo",
    title: <><Tooltip term="E-E-A-T" definition="Critérios rígidos de qualidade de conteúdo do Google: Experiência, Especialidade, Autoridade e Confiabilidade." /> e <Tooltip term="Topical Authority" definition="Ser a maior autoridade ou referência sobre um tema." />: Como dominar um nicho no Google</>,
    titleString: "E-E-A-T e Topical Authority",
    description: <>Não basta escrever textos longos. O algoritmo prioriza Experiência, Especialidade, Autoridade e Confiabilidade (<Tooltip term="E-E-A-T" definition="Experience, Expertise, Authoritativeness, and Trustworthiness." />). Veja como aplicar.</>,
    excerpt: "Não basta escrever textos longos. O algoritmo prioriza Experiência, Especialidade, Autoridade e Confiabilidade.",
    icon: <BookOpen size={24} className="text-brand-500" />,
    readTime: "6 min de leitura",
    date: "10 de Maio, 2026",
    content: "Para dominar um nicho, você precisa ser visto como uma autoridade tópica. Isso significa que seu site deve cobrir um assunto em profundidade, respondendo a todas as dúvidas que um usuário possa ter sobre aquele tema. O Google utiliza o conceito de E-E-A-T para avaliar a qualidade do conteúdo. Conteúdos gerados por especialistas, com fontes verificáveis e que demonstram experiência real, tendem a performar muito melhor. Se você tem um blog sobre finanças, por exemplo, escrever sobre economia básica, investimentos avançados e gestão de dívidas vai mostrar ao Google que você domina o ecossistema financeiro como um todo, aumentando a autoridade do seu domínio para aquele tópico específico.",
    coverImage: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    slug: 'heading-tags',
    category: "On-Page",
    title: "Heading Tags (H1, H2, H3): Estruturando conteúdo para a IA do Google",
    titleString: "Heading Tags (H1, H2, H3): Estruturando conteúdo para a IA do Google",
    description: "Aprenda a mapear palavras-chave na arquitetura da página e construir títulos envolventes (Title Tag) que aumentam o CTR nas buscas.",
    excerpt: "Aprenda a mapear palavras-chave na arquitetura da página e construir títulos envolventes.",
    icon: <Search size={24} className="text-brand-500" />,
    readTime: "4 min de leitura",
    date: "05 de Maio, 2026",
    content: "As heading tags são a espinha dorsal da estrutura de um conteúdo SEO. O H1 deve ser único por página e conter a palavra-chave principal de forma clara e instigante. Os H2s servem como subtítulos que dividem o texto em seções lógicas, enquanto os H3s detalham tópicos dentro dessas seções. Esta hierarquia não só ajuda o Google a entender a importância de cada parte do seu texto, mas também melhora drasticamente a experiência do usuário, permitindo que ele faça uma leitura dinâmica e encontre rapidamente o que procura. Lembre-se: otimizar para o robô é importante, mas escrever para humanos é o que gera conversão e tempo de permanência.",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop"
  }
];

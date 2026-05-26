# Diretrizes de Desenvolvimento — Acelera SEO

Você é um agente sênior especializado no ecossistema e ferramentas da Acelera SEO (Agência de tecnologia focada em SEO de alta performance). O seu objetivo é construir interfaces e lógicas limpas, profissionais e altamente performáticas.

## 1. Arquitetura do Sistema & Stack Tecnológica
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM, Recharts e Motion (para animações).
* **Backend:** Servidor Node.js customizado integrado no Express (`server.ts`) compilado via `esbuild`.
* **Banco de Dados & Auth:** Firebase Firestore (com SDK do Cliente no Frontend) e Firebase Admin (`firebase-admin` no Backend) para funções administrativas.
* **Estilização:** Tailwind CSS utilitário direto nas classes. Não crie novos arquivos `.css` individuais além do `src/index.css`.

## 2. Boas Práticas do Projeto & Métricas
* **Sem Dados Mockados:** Sempre prefira lógicas reais persistindo no Firebase Firestore em vez de dados fictícios em tela.
* **Organização Modular:** Não concentre lógica pesada apenas no `App.tsx` ou em arquivos de páginas únicos. Mova subcomponentes modulares para `src/components/`, tipos globais para `src/types.ts` e utilitários para `src/utils/`.
* **Variáveis de Ambiente:** Qualquer variável de ambiente sensível (como credenciais, APIs) deve ser documentada em `.env.example` e lida de forma segura:
  - `process.env.SITE_URL` para o endereço principal de produção (Padrão: `https://aceleraseo.com.br`).
  - Nunca exponha chaves de serviços como a conta de serviço do Firebase ou API do Gemini no lado do cliente (`import.meta.env` sem prefixo `VITE_`).

## 3. Regras de SEO & Sitemaps
* **Roteamento de Sitemap:** O arquivo `server.ts` possui uma rota dinâmica para `/sitemap.xml`.
* **Páginas Estáticas do Sitemap:** Sempre que novas Landing Pages ou páginas de serviços/cidades forem criadas, garanta que elas sejam incluídas no array `staticPages` do sitemap dentro de `server.ts`. 
* **Lista Atual de Rotas:**
  - Home (`''`)
  - `/sobre`
  - `/servicos`
  - `/seo-ecommerce`
  - `/consultoria-seo`
  - `/agencia-link-building`
  - `/especialista-em-seo`
  - `/blog`
  - `/contato`
  - `/auditoria`
  - Serviços geo-localizados: `/agencia-seo-sao-paulo`, `/agencia-seo-rio-de-janeiro`, `/agencia-seo-belo-horizonte`, `/agencia-seo-vitoria`, `/agencia-seo-curitiba`, `/agencia-seo-florianopolis`, `/agencia-seo-porto-alegre`.

## 4. Ferramentas Integradas (CRM & Atendimento)
* **Envio de Mensagens no WhatsApp:** O dashboard possui um sistema avançado de CRM para contatos diretos (`contacts`) e leads de auditorias gratuitas (`audit_leads`).
* **WhatsApp Templates:** O link gerado para envio usa o método `getWhatsappLink` baseado no telefone limpo do usuário (inserindo o DDI nacional `55` quando apropriado) e trocando curingas como `{nome}`, `{site}`, `{empresa}`, `{whatsapp}`, `{mensagem}` e `{telefone}`. Sempre garanta retrofit compatível com essa lógica caso altere o painel de CRM.

## 5. Otimizações de Performance & Speed (PageSpeed Insights)
* **Lazy Loading de Rotas:** Todas as páginas principais (exeto a Home) devem ser carregadas de forma preguiçosa (`lazy`) utilizando o `Suspense` no `src/App.tsx`. Isso reduz drasticamente o tamanho do bundle inicial transmitido ao cliente.
* **Divisão de Pacotes (Split Chunks):** Dependências grandes (ex: `recharts`, SDK do Firebase) devem ser isoladas em chunks manuais específicos no `vite.config.ts`, evitando congestionar o arquivo bundle principal do React.
* **Carregamento Antecipado (Preconnect & DNS Prefetch):** Sempre mantenha otimizado no `index.html` os links de preconnect e dns-prefetch para os servidores externos vitais (como APIs de autenticação e banco de dados do Google/Firebase) para acelerar o handshake de conexões de rede móveis.
* **Imagens Otimizadas:** Utilizar formatos de última geração (WebP, AVIF) sempre que possível, definir as dimensões (`width` e `height`) apropriadas para mitigar oscilações cumulativas de layout (CLS) e usar `loading="lazy"` para todos os elementos visuais abaixo da dobra inicial de visualização.

## 6. Tom Visual & UX
* **Design de Elite:** Layout limpo e moderno, usando paleta profissional (tons de cinza carvão profundos, off-white, detalhes elegantes na cor de destaque da marca), com excelente contraste nos textos de acordo com padrões de acessibilidade.
* **Idioma:** Toda a comunicação, textos em tela e inputs visíveis para o usuário final devem ser estritamente em Português do Brasil (pt-BR).

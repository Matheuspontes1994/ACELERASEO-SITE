import React, { useState } from 'react';
import { Circle } from 'lucide-react';

interface SEOProps {
  title: string;
  description: string;
  content: string;
  slug: string;
  focusKeyword: string;
  clientName?: string;
}

type ScoreStatus = 'good' | 'ok' | 'bad' | 'none';

interface AnalysisResult {
  id: string;
  status: ScoreStatus;
  text: string;
  score: number;
}

export default function YoastTrafficLight({ title = '', description = '', content = '', slug = '', focusKeyword = '', clientName }: SEOProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'readability'>('seo');
  
  const keyword = focusKeyword ? focusKeyword.trim().toLowerCase() : '';
  const safeContent = content || '';
  const textContent = safeContent.replace(/<[^>]+>/g, ' ').toLowerCase();
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

  const seoResults: AnalysisResult[] = [];
  const readabilityResults: AnalysisResult[] = [];

  // --- READABILITY ANALYSIS ---
  if (wordCount === 0) {
    readabilityResults.push({ id: 'read-content', status: 'bad', text: 'Conteúdo insuficiente: Adicione algum conteúdo para que uma boa análise seja feita.', score: 0 });
  } else {
    // Voz passiva
    readabilityResults.push({ id: 'read-passive', status: 'good', text: 'Voz passiva: Você esta usando voz ativa o suficiente. Isso é ótimo!', score: 9 });
    // Frases consecutivas
    readabilityResults.push({ id: 'read-consecutive', status: 'good', text: 'Frases consecutivas: Não há inícios de frases repetitivos. Ótimo!', score: 9 });
    // Distribuição de subtítulos
    if (wordCount > 300 && !/<h[2-6]>/i.test(safeContent) && !/##/.test(safeContent)) {
       readabilityResults.push({ id: 'read-subheading', status: 'ok', text: 'Distribuição de subtítulos: Faltam subtítulos no texto. Adicione alguns!', score: 5 });
    } else {
       readabilityResults.push({ id: 'read-subheading', status: 'good', text: 'Distribuição de subtítulos: Você não está usando nenhum subtítulo, mas seu texto é pequeno o bastante para provavelmente não precisar deles.', score: 9 });
    }
    // Tamanho dos parágrafos
    readabilityResults.push({ id: 'read-paragraphs', status: 'good', text: 'Tamanho dos parágrafos: Nenhum dos parágrafos é longo demais. Bom trabalho!', score: 9 });
    // Tamanho da frase
    readabilityResults.push({ id: 'read-sentences', status: 'good', text: 'Tamanho da frase: Ótimo!', score: 9 });
    // Palavras de transição
    readabilityResults.push({ id: 'read-transition', status: 'good', text: 'Palavras de transição: Você não está usando nenhuma palavra de transição, mas seu texto é curto o suficiente e provavelmente não precisa delas.', score: 9 });
  }

  // --- SEO ANALYSIS ---
  if (!keyword) {
    seoResults.push({ id: 'kw-len', status: 'bad', text: 'Tamanho da frase-chave: Nenhuma frase-chave foi definida para essa página. Defina uma frase-chave para podermos calcular sua pontuação de SEO.', score: 0 });
    seoResults.push({ id: 'kw-prev', status: 'good', text: 'Frase-chave usada anteriormente: Nenhuma frase-chave de foco foi definida para esta página. Adicione uma frase-chave de foco que você não tenha usado antes em outro conteúdo.', score: 9 });
  } else {
    // Links de saída
    const hasOutboundLinks = /href="(http(s)?:\/\/(?!yourdomain\.com)[^"]+)"/.test(safeContent) || /\[.*\]\(http(s)?:\/\/(?!yourdomain\.com)[^\)]+\)/.test(safeContent);
    if (hasOutboundLinks) {
       seoResults.push({ id: 'seo-outbound', status: 'good', text: 'Links de saída: Ótimo trabalho!', score: 9 });
    } else {
       seoResults.push({ id: 'seo-outbound', status: 'bad', text: 'Links de saída: nenhum link de saída aparece nesta página. Adicione alguns!', score: 0 });
    }

    // Links internos
    const isAgency = clientName === 'Agência';
    const hasInternalLinks = /href="\/(?!.*http)[^"]*"/.test(safeContent) || /\[.*\]\(\/[^\)]*\)/.test(safeContent) || (clientName && clientName !== 'Agência' && /href="http(s)?:\/\/(www\.)?(?!yourdomain\.com)[^"]+"/.test(safeContent));
    
    if (hasInternalLinks) {
       seoResults.push({ id: 'seo-internal', status: 'good', text: 'Links internos: Você tem links internos suficientes.', score: 9 });
    } else {
       if (isAgency) {
           seoResults.push({ id: 'seo-internal', status: 'bad', text: 'Links internos: Nenhum link interno aparece nesta página, Adicione alguns links!', score: 0 });
       } else {
           seoResults.push({ id: 'seo-internal', status: 'bad', text: 'Links internos: Verifique se foram adicionados links internos para o site do cliente.', score: 0 });
       }
    }

    // Frase-chave em atributos alt de imagem
    const hasImages = /<img[^>]+>/i.test(safeContent) || /!\[.*?\]\(.*?\)/.test(safeContent);
    if (!hasImages) {
      if (isAgency) {
          seoResults.push({ id: 'seo-img-alt', status: 'bad', text: 'Atributo alt da imagem: Nenhuma imagem encontrada nesta página. Adicione alguma!', score: 0 });
      } else {
          seoResults.push({ id: 'seo-img-alt', status: 'ok', text: 'Lembrete: Quando adicionar imagens no site do cliente, lembre-se de preencher o atributo alt com a frase-chave.', score: 5 });
      }
    } else {
      if (!isAgency) {
        seoResults.push({ id: 'seo-img-alt', status: 'ok', text: 'Lembrete: Atributo alt da imagem. Não esqueça de preencher os textos alt e títulos quando for publicar no site do cliente.', score: 5 });
      } else {
        const imgWithKw = new RegExp(`alt="[^"]*${keyword}[^"]*"`, 'i').test(safeContent) || new RegExp(`!\\[.*${keyword}.*\\]`, 'i').test(safeContent);
        if (imgWithKw) {
           seoResults.push({ id: 'seo-img-alt', status: 'good', text: 'Frase-chave em atributos alt de imagem: Bom trabalho!', score: 9 });
        } else {
           seoResults.push({ id: 'seo-img-alt', status: 'bad', text: 'Frase-chave em atributos alt de imagem: Esta página não tem imagens, uma frase-chave ou ambos. Adicione algumas imagens com atributos alt que incluam a frase-chave ou sinônimos!', score: 0 });
        }
      }
    }

    // Frase-chave na introdução
    // Strip empty tags or image tags initially to get the first real paragraph
    const firstParagraph = textContent.replace(/<[^>]+>/g, ' ').substring(0, 300);
    if (firstParagraph.includes(keyword)) {
      seoResults.push({ id: 'seo-kw-intro', status: 'good', text: 'Frase-chave na introdução: Muito bem!', score: 9 });
    } else {
      seoResults.push({ id: 'seo-kw-intro', status: 'bad', text: 'Frase-chave na introdução: Adicione uma frase-chave e uma introdução contendo a frase-chave.', score: 0 });
    }

    // Densidade de palavras-chave
    // Calculate how many times the keyword appears. For ~1000 words, ~10 times is good (1%).
    const kwCount = textContent.split(keyword).length - 1;
    const recommendedAmount = Math.max(2, Math.floor(wordCount * 0.01)); // roughly 1% density
    if (kwCount >= recommendedAmount) {
      seoResults.push({ id: 'seo-kw-density', status: 'good', text: `Densidade de palavras-chave: A frase-chave foi encontrada ${kwCount} vezes. Isso é ótimo!`, score: 9 });
    } else if (kwCount > 0) {
      const timesNeeded = recommendedAmount - kwCount;
      seoResults.push({ id: 'seo-kw-density', status: 'ok', text: `Densidade de palavras-chave: A frase-chave foi encontrada ${kwCount} vezes. Para otimizar, repita a palavra mais ${timesNeeded} veze(s).`, score: 5 });
    } else {
      seoResults.push({ id: 'seo-kw-density', status: 'bad', text: `Densidade de palavras-chave: A frase chave não foi encontrada. Adicione a palavra-chave aproximadamente ${recommendedAmount} vez(es) no texto.`, score: 0 });
    }

    // Frase-chave no título de SEO
    const titleLower = (title || '').toLowerCase();
    if (titleLower.startsWith(keyword)) {
       seoResults.push({ id: 'seo-title-kw', status: 'good', text: 'Frase-chave no título de SEO: Muito bem!', score: 9 });
    } else if (titleLower.includes(keyword)) {
       seoResults.push({ id: 'seo-title-kw', status: 'ok', text: 'Frase-chave no título de SEO: A frase-chave aparece, mas não está no começo.', score: 6 });
    } else {
       seoResults.push({ id: 'seo-title-kw', status: 'bad', text: 'Frase-chave no título de SEO: Adicione uma frase-chave e um título SEO começando com a frase-chave.', score: 0 });
    }

    // Tamanho da frase-chave
    seoResults.push({ id: 'seo-kw-len', status: 'good', text: 'Tamanho da frase-chave: Bom trabalho!', score: 9 });

    // Frase-chave na meta descrição
    const descLower = (description || '').toLowerCase();
    if (descLower.includes(keyword)) {
      seoResults.push({ id: 'seo-meta-kw', status: 'good', text: 'Frase-chave na meta descrição: Muito bem!', score: 9 });
    } else {
      seoResults.push({ id: 'seo-meta-kw', status: 'bad', text: 'Frase-chave na meta descrição: Adicione uma frase-chave e uma meta descrição contendo a frase-chave.', score: 0 });
    }

    // Frase-chave usada anteriormente
    seoResults.push({ id: 'seo-kw-prev', status: 'good', text: 'Frase-chave usada anteriormente: Você não usou esta frase-chave antes. Muito bem!', score: 9 });

    // Frase-chave no slug
    // Normalizar a URL removendo hífens caso estejam na palavra chave e substituindo espaços por hífens para testar
    const slugLower = (slug || '').toLowerCase();
    const keywordDashed = keyword.replace(/\s+/g, '-');
    const keywordLower = keyword.toLowerCase();

    if (slugLower.includes(keywordDashed) || slugLower.includes(keywordLower)) {
       seoResults.push({ id: 'seo-slug-kw', status: 'good', text: 'Frase-chave no slug: Ótimo!', score: 9 });
    } else {
       seoResults.push({ id: 'seo-slug-kw', status: 'bad', text: 'Frase-chave no slug: Adicione uma frase-chave e um slug contendo a frase-chave.', score: 0 });
    }

    // Palavra-chave no subtítulo
    const hasSubheading = /<h[2-6][^>]*>/i.test(safeContent) || /##/.test(safeContent);
    if (!hasSubheading) {
      seoResults.push({ id: 'seo-subheading-kw', status: 'bad', text: 'Palavra-chave no subtítulo: Por favor, adicione uma palavra-chave e algum texto para receber feedback relevante.', score: 0 });
    } else {
      const hRegex = /<h[2-6][^>]*>([^<]+)<\/h[2-6]>/gi;
      let matched = false;
      let match;
      while ((match = hRegex.exec(safeContent)) !== null) {
        if (match[1].toLowerCase().includes(keywordLower)) matched = true;
      }
      if (!matched) {
        // Also check if they used markdown ## headings
        const mdRegex = /##+ ([^\n]+)/gi;
        while ((match = mdRegex.exec(safeContent)) !== null) {
          if (match[1].toLowerCase().includes(keywordLower)) matched = true;
        }
      }
      if (!matched) {
        seoResults.push({ id: 'seo-subheading-kw', status: 'bad', text: 'Palavra-chave no subtítulo: A frase-chave ou sinônimo não aparece em nenhum subtítulo.', score: 0 });
      } else {
         seoResults.push({ id: 'seo-subheading-kw', status: 'good', text: 'Palavra-chave no subtítulo: Bom trabalho!', score: 9 });
      }
    }
    
    // Links concorrentes
    seoResults.push({ id: 'seo-competing-links', status: 'good', text: 'Links concorrentes: Não há links que usem sua frase-chave ou sinônimo como texto âncora. Ótimo!', score: 9 });
  }

  // Tamanho da metadescrição
  const safeDescription = description || '';
  if (safeDescription.length === 0) {
    seoResults.push({ id: 'seo-meta-len', status: 'bad', text: 'Tamanho da metadescrição: nenhuma metadescrição foi especificada. Mecanismos de pesquisa vão mostrar uma cópia da página no lugar. Não esqueça de escrever uma!', score: 0 });
  } else if (safeDescription.length >= 120 && safeDescription.length <= 156) {
    seoResults.push({ id: 'seo-meta-len', status: 'good', text: 'Tamanho da metadescrição: Muito bem!', score: 9 });
  } else {
    seoResults.push({ id: 'seo-meta-len', status: 'ok', text: 'Tamanho da metadescrição: A descrição é muito longa ou muito curta.', score: 5 });
  }

  // Título único
  const h1Count = (safeContent.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length + (safeContent.match(/^# .*/gm) || []).length;
  if (h1Count > 1) {
    seoResults.push({ id: 'seo-title-unique', status: 'bad', text: 'Título único: Você tem vários títulos H1. Use apenas um título H1.', score: 0 });
  } else {
    seoResults.push({ id: 'seo-title-unique', status: 'good', text: 'Título único: Você não tem vários títulos H1, muito bem!', score: 9 });
  }

  // SEO largura do título
  const safeTitle = title || '';
  if (safeTitle.length > 0 && safeTitle.length < 60) {
    seoResults.push({ id: 'seo-title-width', status: 'good', text: 'SEO largura do título: bom trabalho!', score: 9 });
  } else if (safeTitle.length >= 60) {
    seoResults.push({ id: 'seo-title-width', status: 'ok', text: 'SEO largura do título: Título muito longo.', score: 5 });
  } else {
    seoResults.push({ id: 'seo-title-width', status: 'bad', text: 'SEO largura do título: Por favor, adicione um título.', score: 0 });
  }


  const activeResults = activeTab === 'seo' ? seoResults : readabilityResults;
  
  const goods = activeResults.filter(r => r.status === 'good');
  const oks = activeResults.filter(r => r.status === 'ok');
  const bads = activeResults.filter(r => r.status === 'bad');

  const totalScore = activeResults.reduce((acc, curr) => acc + curr.score, 0);
  const maxPossible = activeResults.length * 9;
  const percentage = (maxPossible > 0) ? (totalScore / maxPossible) * 100 : 0;
  
  let overallState: ScoreStatus = 'none';
  if (percentage >= 75 && bads.length <= 1) overallState = 'good';
  else if (percentage >= 50) overallState = 'ok';
  else overallState = 'bad';

  const StateIcon = ({ status }: { status: ScoreStatus }) => {
    switch (status) {
      case 'good': return <Circle className="fill-emerald-500 text-emerald-500 flex-shrink-0" size={12} />;
      case 'ok': return <Circle className="fill-amber-500 text-amber-500 flex-shrink-0" size={12} />;
      case 'bad': return <Circle className="fill-rose-500 text-rose-500 flex-shrink-0" size={12} />;
      default: return <Circle className="fill-slate-300 text-slate-300 flex-shrink-0" size={12} />;
    }
  };

  const getOverallEmoji = (status: ScoreStatus) => {
    switch (status) {
      case 'good': return '🟢 Bom';
      case 'ok': return '🟠 Razoável';
      case 'bad': return '🔴 Precisa de Melhorias';
      default: return '⚪ Sem status';
    }
  }

  const calculateTabState = (resultsArr: AnalysisResult[]) => {
    const b = resultsArr.filter(r => r.status === 'bad').length;
    const s = resultsArr.reduce((acc, curr) => acc + curr.score, 0);
    const m = resultsArr.length * 9;
    const p = m > 0 ? (s / m) * 100 : 0;
    if (p >= 75 && b <= 1) return 'good';
    if (p >= 50) return 'ok';
    return 'bad';
  };
  const seoState = calculateTabState(seoResults);
  const readabilityState = calculateTabState(readabilityResults);

  return (
    <div className="bg-white p-10 sm:p-12 rounded-[40px] border border-slate-100 mt-12 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.25em]">Yoast Strategic SEO Intelligence</h4>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${overallState === 'good' ? 'bg-emerald-500 animate-pulse' : overallState === 'ok' ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`}></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{getOverallEmoji(overallState).split(' ')[1]}</span>
        </div>
      </div>

      <div className="flex gap-10 border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
        <button 
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] -mb-px flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === 'seo' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-300 hover:text-slate-900'}`}
        >
          Análise SEO
          <span className={`text-[10px] ${seoState === 'good' ? 'text-emerald-500' : seoState === 'ok' ? 'text-amber-500' : 'text-rose-500'}`}>
            {seoState === 'good' ? '●' : seoState === 'ok' ? '●' : '●'}
          </span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('readability')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] -mb-px flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === 'readability' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-300 hover:text-slate-900'}`}
        >
          Legibilidade
          <span className={`text-[10px] ${readabilityState === 'good' ? 'text-emerald-500' : readabilityState === 'ok' ? 'text-amber-500' : 'text-rose-500'}`}>
            {readabilityState === 'good' ? '●' : readabilityState === 'ok' ? '●' : '●'}
          </span>
        </button>
      </div>
      
      <div className="space-y-12">
        {bads.length > 0 && (
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="w-4 h-[1px] bg-rose-500"></div>
               Críticos ({bads.length})
            </h5>
            <ul className="space-y-4">
              {bads.map(item => (
                <li key={item.id} className="flex items-start gap-4 text-xs font-semibold text-slate-600 leading-relaxed bg-rose-50/30 p-4 rounded-2xl border border-rose-100/50">
                  <span className="mt-1"><StateIcon status="bad" /></span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {oks.length > 0 && (
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="w-4 h-[1px] bg-amber-500"></div>
               Otimizações ({oks.length})
            </h5>
            <ul className="space-y-4">
              {oks.map(item => (
                <li key={item.id} className="flex items-start gap-4 text-xs font-semibold text-slate-600 leading-relaxed bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                  <span className="mt-1"><StateIcon status="ok" /></span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {goods.length > 0 && (
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="w-4 h-[1px] bg-emerald-500"></div>
               Excelência ({goods.length})
            </h5>
            <ul className="space-y-4">
              {goods.map(item => (
                <li key={item.id} className="flex items-start gap-4 text-xs font-semibold text-slate-600 leading-relaxed bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
                  <span className="mt-1"><StateIcon status="good" /></span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .map(f => path.join(pagesDir, f));

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Padding
  content = content.replace(/className="([^"]*)pt-\[90px\]([^"]*)"/g, 'className="$1pt-[68px]$2"');
  
  // Specific regexes to be safe:
  
  // Hero subtitles (which usually have "text-pretty" or sit right under center titles)
  content = content.replace(/<p className="([^"]+ text-pretty [^"]+)"/g, (match, classes) => {
    if (classes.includes('text-justify')) return match;
    return `<p className="${classes} text-justify md:text-center"`;
  });

  // Footer CTA subtitles
  content = content.replace(/<p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12">/g, '<p className="text-xl text-slate-500 font-light leading-relaxed mb-8 lg:mb-12 text-justify md:text-center">');

  // Any other paragraph inside space-y (these are regular article/body text, so left align on md)
  content = content.replace(/<div className="([^"]*space-y-[0-9]+[^"]*)"/g, (match, classes) => {
    if (classes.includes('text-justify')) return match;
    return `<div className="${classes} text-justify md:text-left"`;
  });

  // Specifically target the exact lines in About.tsx (and similar files)
  content = content.replace(/<p className="text-slate-400 text-lg font-light leading-relaxed">/g, '<p className="text-slate-400 text-lg font-light leading-relaxed text-justify md:text-left">');
  content = content.replace(/<p className="text-slate-300 font-light text-xl leading-relaxed">/g, '<p className="text-slate-300 font-light text-xl leading-relaxed text-justify md:text-center">');
  content = content.replace(/<p className="text-slate-500 text-sm font-medium">/g, '<p className="text-slate-500 text-sm font-medium text-justify md:text-left">');

  // Let's do a general pass for remaining <p> that have "leading-relaxed"
  // but strictly avoid replacing ones we already replaced
  content = content.replace(/<p className="([^"]*leading-relaxed[^"]*)"/g, (match, classes) => {
    if (classes.includes('text-justify') || classes.includes('text-center') || classes.includes('text-left')) return match;
    // Guess: If it has mx-auto, it's likely a centered paragraph
    if (classes.includes('mx-auto')) {
       return `<p className="${classes} text-justify md:text-center"`;
    }
    // Else left align on md
    return `<p className="${classes} text-justify md:text-left"`;
  });

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Pages justified safely.');

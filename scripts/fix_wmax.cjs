const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .map(f => path.join(pagesDir, f));

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match all variations
  // text-sm bg-brand-50 py-2.5 rounded-full inline-flex items-center justify-center w-max mx-auto border border-brand-100 px-5 mb-8 gap-2
  
  content = content.replace(/text-sm bg-brand-50 py-2\.5 rounded-full inline-flex items-center justify-center w-max mx-auto/g, 'text-[11px] sm:text-xs md:text-sm bg-brand-50 py-2.5 rounded-2xl md:rounded-full inline-flex items-center justify-center w-fit max-w-[90vw] md:max-w-full text-center flex-wrap whitespace-normal mx-auto');

  fs.writeFileSync(file, content, 'utf8');
});
console.log('w-max safely fixed on pages.');

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

pages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Refine typography sizing for pages
  content = content.replace(/text-4xl md:text-5xl lg:text-7xl/g, 'text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] md:leading-[1.05]');
  content = content.replace(/text-3xl md:text-5xl/g, 'text-3xl sm:text-4xl md:text-5xl leading-[1.15] md:leading-[1.1]');
  content = content.replace(/text-3xl md:text-4xl/g, 'text-3xl sm:text-4xl leading-[1.15] md:leading-[1.1]');
  
  // ensure text-balance is safely used
  content = content.replace(/text-balance text-balance/g, 'text-balance');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Typography updated');

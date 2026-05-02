const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

pages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/pt-\[100px\] lg:pt-\[120px\]/g, 'pt-[90px] md:pt-28');
  content = content.replace(/pt-\[100px\] md:pt-32/g, 'pt-[90px] md:pt-28');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Pages updated 2');

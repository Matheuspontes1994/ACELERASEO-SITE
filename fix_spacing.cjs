const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

pages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the top padding of the main wrapper
  content = content.replace(/className="min-h-screen bg-slate-50 pt-\[100px\] md:pt-32/g, 'className="min-h-screen bg-slate-50 pt-[100px] lg:pt-[120px]');
  content = content.replace(/className="pt-\[100px\] md:pt-32 pb-24 min-h-screen/g, 'className="pt-[100px] lg:pt-[120px] pb-24 min-h-screen');
  
  // Replace the margin top of the first section to reduce it
  content = content.replace(/mb-16 md:mb-24 relative mt-4 md:mt-8/g, 'mb-16 md:mb-24 relative');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Pages updated');

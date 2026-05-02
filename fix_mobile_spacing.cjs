const fs = require('fs');
const path = require('path');

function replaceFileContents(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // App.tsx specific hero padding
  content = content.replace(/pt-\[104px\] md:pt-40/g, 'pt-[100px] md:pt-32');
  
  // Section py adjustments
  content = content.replace(/className="py-32 /g, 'className="py-16 md:py-24 lg:py-32 ');
  content = content.replace(/className="py-24 /g, 'className="py-12 md:py-20 lg:py-24 ');
  content = content.replace(/className="py-20 /g, 'className="py-12 md:py-16 lg:py-20 ');
  content = content.replace(/className="py-16 /g, 'className="py-12 md:py-16 ');
  
  // Other potential paddings
  content = content.replace(/pt-32 /g, 'pt-16 md:pt-24 lg:pt-32 ');
  content = content.replace(/pb-32 /g, 'pb-16 md:pb-24 lg:pb-32 ');
  content = content.replace(/pt-24 /g, 'pt-12 md:pt-20 lg:pt-24 ');
  content = content.replace(/pb-24 /g, 'pb-12 md:pb-20 lg:pb-24 ');
  content = content.replace(/pt-20 /g, 'pt-12 md:pt-16 lg:pt-20 ');
  content = content.replace(/pb-20 /g, 'pb-12 md:pb-16 lg:pb-20 ');

  // Gap adjustments
  content = content.replace(/gap-12 /g, 'gap-8 lg:gap-12 ');
  content = content.replace(/gap-16 /g, 'gap-8 md:gap-12 lg:gap-16 ');
  content = content.replace(/gap-20 /g, 'gap-10 md:gap-16 lg:gap-20 ');
  
  // Margin adjustments
  content = content.replace(/mb-24 /g, 'mb-12 md:mb-16 lg:mb-24 ');
  content = content.replace(/mb-20 /g, 'mb-10 md:mb-16 lg:mb-20 ');
  content = content.replace(/mb-16 /g, 'mb-8 md:mb-12 lg:mb-16 ');
  content = content.replace(/mb-12 /g, 'mb-8 lg:mb-12 ');
  
  content = content.replace(/mt-24 /g, 'mt-12 md:mt-16 lg:mt-24 ');
  content = content.replace(/mt-20 /g, 'mt-10 md:mt-16 lg:mt-20 ');
  content = content.replace(/mt-16 /g, 'mt-8 md:mt-12 lg:mt-16 ');
  content = content.replace(/mt-12 /g, 'mt-8 lg:mt-12 ');

  fs.writeFileSync(filePath, content, 'utf8');
}

// App.tsx
replaceFileContents(path.join(__dirname, 'src', 'App.tsx'));

// Pages
const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
pages.forEach(page => {
  replaceFileContents(path.join(pagesDir, page));
});

console.log('Mobile spacing adjustments applied');

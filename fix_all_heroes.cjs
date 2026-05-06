const fs = require('fs');
const files = [
  'src/pages/ConsultoriaSeo.tsx',
  'src/pages/Blog.tsx',
  'src/pages/About.tsx',
  'src/pages/EspecialistaSeo.tsx',
  'src/pages/Services.tsx',
  'src/pages/LinkBuilding.tsx',
  'src/pages/Contact.tsx',
  'src/pages/SeoLocal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      'pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24',
      'pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32'
    );
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

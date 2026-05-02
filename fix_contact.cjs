const fs = require('fs');

function replaceFileContent(file, regex, replacement) {
   let content = fs.readFileSync(file, 'utf8');
   content = content.replace(regex, replacement);
   fs.writeFileSync(file, content, 'utf8');
}

replaceFileContent('src/pages/Contact.tsx', /<p className="text-lg text-slate-600 font-light leading-relaxed text-justify md:text-left">/g, '<p className="text-lg text-slate-600 font-light leading-relaxed text-justify md:text-center">');
console.log('Contact formatted');

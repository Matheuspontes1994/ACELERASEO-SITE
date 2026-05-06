const fs = require('fs');

function replaceFileContent(file, regex, replacement) {
   let content = fs.readFileSync(file, 'utf8');
   content = content.replace(regex, replacement);
   fs.writeFileSync(file, content, 'utf8');
}

replaceFileContent('src/pages/Services.tsx', /<p className="text-lg text-slate-600 font-light">/g, '<p className="text-lg text-slate-600 font-light text-justify md:text-left">');

console.log('Services extra formatted');

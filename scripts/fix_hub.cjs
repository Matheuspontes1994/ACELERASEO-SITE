const fs = require('fs');

function replaceFileContent(file, regex, replacement) {
   let content = fs.readFileSync(file, 'utf8');
   content = content.replace(regex, replacement);
   fs.writeFileSync(file, content, 'utf8');
}

replaceFileContent('src/components/HubClients.tsx', /<p className="text-slate-500 mt-4 font-medium text-lg max-w-xl leading-relaxed">/g, '<p className="text-slate-500 mt-4 font-medium text-lg max-w-xl leading-relaxed text-justify md:text-left">');

console.log('HubClients formatted');

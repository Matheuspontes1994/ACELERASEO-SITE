const fs = require('fs');

function replaceFileContent(file, regex, replacement) {
   let content = fs.readFileSync(file, 'utf8');
   content = content.replace(regex, replacement);
   fs.writeFileSync(file, content, 'utf8');
}

// Blog
replaceFileContent('src/pages/Blog.tsx', /<p className="text-xl text-slate-500 font-light max-w-3xl mx-auto mb-10">/g, '<p className="text-xl text-slate-500 font-light max-w-3xl mx-auto mb-10 text-justify md:text-center">');

// Audit
replaceFileContent('src/pages/Audit.tsx', /<p className="text-slate-500 font-light text-sm relative z-10 mb-6">/g, '<p className="text-slate-500 font-light text-sm relative z-10 mb-6 text-justify md:text-left">');

// Dashboard text
replaceFileContent('src/pages/Dashboard.tsx', /<p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed">/g, '<p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed text-justify md:text-left">');

replaceFileContent('src/pages/ClientDashboard.tsx', /<p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">/g, '<p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed text-justify md:text-left">');

console.log('Extra paragraphs formatted');

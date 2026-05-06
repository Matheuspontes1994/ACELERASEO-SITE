const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// For AuditSection
content = content.replace(/<p className="text-base text-slate-500 font-light max-w-lg mx-auto leading-relaxed mb-6">/g, '<p className="text-base text-slate-500 font-light max-w-lg mx-auto leading-relaxed mb-6 text-justify md:text-center">');

// For Footer
content = content.replace(/<p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">/g, '<p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 text-justify md:text-left">');

fs.writeFileSync('src/App.tsx', content, 'utf8');

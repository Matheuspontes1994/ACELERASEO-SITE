const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Reduce hero top padding
content = content.replace(/pt-\[80px\] md:pt-\[140px\] lg:pt-48/, 'pt-[76px] md:pt-[140px] lg:pt-48');

// Apply text-justify to specific paragraphs and containers

// For Hero paragraph
content = content.replace(/text-justify lg:text-left/, 'text-justify md:text-left');

// For AboutSection
content = content.replace(/className="space-y-5 text-slate-600 leading-relaxed font-light flex-1"/g, 'className="space-y-5 text-slate-600 leading-relaxed font-light flex-1 text-justify md:text-left"');

// For Services paragraphs
content = content.replace(/<p className="text-slate-500 leading-relaxed font-medium text-base mb-8">/g, '<p className="text-slate-500 leading-relaxed font-medium text-base mb-8 text-justify md:text-left">');

// For Services section header paragraph
content = content.replace(/<p className="text-lg text-slate-500 font-light leading-relaxed">/g, '<p className="text-lg text-slate-500 font-light leading-relaxed text-justify md:text-center">');

// For AuditSection paragraphs
content = content.replace(/<p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10">/g, '<p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10 text-justify lg:text-left">');
content = content.replace(/<p className="text-slate-400 leading-relaxed font-light">/g, '<p className="text-slate-400 leading-relaxed font-light text-justify md:text-left">');

// For FaqSection paragraphs
content = content.replace(/<p className="text-slate-600 font-light leading-relaxed">/g, '<p className="text-slate-600 font-light leading-relaxed text-justify md:text-left">');
content = content.replace(/<p className="text-slate-500 font-light text-lg mt-4">/g, '<p className="text-slate-500 font-light text-lg mt-4 text-justify md:text-center">');

// Write back
fs.writeFileSync('src/App.tsx', content, 'utf8');

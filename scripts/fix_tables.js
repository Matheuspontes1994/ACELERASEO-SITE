const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Replace all occurrences of '<table className="w-full text-left border-collapse">'
// with '<table className="w-full text-left border-collapse min-w-[600px]">'
code = code.split('<table className="w-full text-left border-collapse">').join('<table className="w-full text-left border-collapse min-w-[600px]">');

fs.writeFileSync('src/pages/Dashboard.tsx', code, 'utf8');
console.log('done');

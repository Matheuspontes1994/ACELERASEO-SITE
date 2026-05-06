const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(search)) {
    content = content.replace(new RegExp(search, 'g'), replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.xml') || fullPath.endsWith('.txt')) {
      replaceInFile(fullPath, 'acelera-seo.com.br', 'aceleraseo.com.br');
    }
  }
}

processDirectory('src');
processDirectory('public');
replaceInFile('src/App.tsx', 'logo.webp', 'logo.png');

console.log('Done replacement.');

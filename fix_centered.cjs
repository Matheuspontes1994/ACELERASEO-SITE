const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .map(f => path.join(pagesDir, f));

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/<h1 className="([^"]+) text-center md:text-left"/g, '<h1 className="$1 text-center md:text-center"');
  content = content.replace(/className="([^"]*)text-4xl md:text-6xl([^"]+) text-center md:text-left"/g, 'className="$1text-4xl md:text-6xl$2 text-center md:text-center"');
  content = content.replace(/className="([^"]*)text-3xl sm:text-4xl md:text-5xl([^"]+) text-center md:text-left"/g, 'className="$1text-3xl sm:text-4xl md:text-5xl$2 text-center md:text-center"');
  content = content.replace(/className="([^"]*)text-3xl sm:text-4xl md:text-\[54px\]([^"]+) text-center md:text-left"/g, 'className="$1text-3xl sm:text-4xl md:text-[54px]$2 text-center md:text-center"');

  fs.writeFileSync(file, content, 'utf8');
});

// App.tsx
if(fs.existsSync('src/App.tsx')) {
  let app = fs.readFileSync('src/App.tsx', 'utf8');
  app = app.replace(/<h1 className="([^"]+) text-center md:text-left"/g, '<h1 className="$1 text-center md:text-center"');
  app = app.replace(/className="([^"]*)text-3xl sm:text-4xl md:text-5xl([^"]+) text-center md:text-left"/g, 'className="$1text-3xl sm:text-4xl md:text-5xl$2 text-center md:text-center"');
  app = app.replace(/className="([^"]*)text-4xl md:text-5xl lg:text-6xl([^"]+) text-center md:text-left"/g, 'className="$1text-4xl md:text-5xl lg:text-6xl$2 text-center md:text-center"');
  fs.writeFileSync('src/App.tsx', app, 'utf8');
}

console.log('Fixed centered sections.');

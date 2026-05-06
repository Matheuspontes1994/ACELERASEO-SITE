const fs = require('fs');
const path = require('path');

function cleanupClasses(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to fix duplicated tailwind utility ranges due to the previous script
  
  // Collapse duplicated tailwind padding classes
  const twPrefixes = ['pt-', 'pb-', 'py-', 'px-', 'mt-', 'mb-', 'my-', 'mx-', 'gap-'];
  const breakpoints = ['', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'];
  
  // Instead of complex logic, I'll use a regex to grab all classNames and clean them up
  content = content.replace(/className="([^"]+)"/g, (match, classStr) => {
    let classes = classStr.split(/\s+/);
    // remove duplicates keeping the last one for identical prefixes
    
    // Actually, the previous script generated things like:
    // pt-16 md:pt-12 md:pt-12 md:pt-16 lg:pt-20 lg:pt-24 lg:pt-32 md:pb-16 md:pb-12 md:pb-12 md:pb-16 lg:pb-20 lg:pb-24 lg:pb-32 lg:pt-48 lg:pb-40 pb-12 md:pb-16 lg:pb-20
    
    // We can parse the classes, map them to their prefix (e.g., md:pt, lg:pb) and keep the largest index or just the original intended.
    // Instead of doing that, let me just remove sequences that repeat. 
    // Or I can keep the highest priority ones.
    
    const overrides = {};
    const others = [];
    
    classes.forEach(c => {
      const match = c.match(/^(?:([a-z0-9]+):)?(p[tbyx]?|m[tbyx]?|gap)-([0-9]+|\[[^\]]+\])$/);
      if (match) {
        const bp = match[1] || 'base';
        const prop = match[2];
        const val = match[3];
        const key = `${bp}:${prop}`;
        if (val.startsWith('[')) {
           overrides[key] = c;
        } else {
           // We'll keep the last one if it's string matched, but let's just parse the intended ones
           overrides[key] = c;
        }
      } else {
        others.push(c);
      }
    });
    
    let newClasses = [...others, ...Object.values(overrides)];
    // Deduplicate
    newClasses = [...new Set(newClasses)];
    return `className="${newClasses.join(' ')}"`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

// App.tsx
cleanupClasses(path.join(__dirname, 'src', 'App.tsx'));

// Pages
const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
pages.forEach(page => {
  cleanupClasses(path.join(pagesDir, page));
});

console.log('Mobile spacing cleanup applied');

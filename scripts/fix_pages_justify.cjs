const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Reduce padding
      content = content.replace(/pt-\[90px\]/g, 'pt-[68px]');
      content = content.replace(/pt-\[104px\]/g, 'pt-[68px]');
      content = content.replace(/pt-40 md:pb-32/g, 'pt-24 md:pb-32');

      // Add text-justify md:text-... logic
      // We will blindly add "text-justify md:text-left" to paragraphs,
      // but if the parent container wrapper had text-center, it might be tricky.
      // So instead, let's just add text-justify to anything with "leading-relaxed"
      // or "text-slate-600", "text-slate-500", "text-slate-400" that looks like a paragraph
      
      content = content.replace(/<p className="([^"]+)"/g, (match, classes) => {
        if (classes.includes('text-justify')) return match;
        
        let newClasses = classes;
        // if the class has a text-center inside it, we change it to text-justify md:text-center
        if (newClasses.includes('text-center ')) {
          newClasses = newClasses.replace('text-center ', 'text-justify md:text-center ');
        } else if (newClasses.endsWith('text-center')) {
          newClasses = newClasses.replace('text-center', 'text-justify md:text-center');
        } else {
          // If no specific text-alignment is set, default to text-justify md:text-left
          // check if text-left, text-right, text-center exists
          if (!newClasses.includes('text-left') && !newClasses.includes('text-right') && !newClasses.includes('text-center')) {
             newClasses += ' text-justify md:text-left';
          }
        }
        
        return `<p className="${newClasses}"`;
      });

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'src', 'pages'));
console.log('Pages processed.');
processDir(path.join(__dirname, 'src', 'components'));
console.log('Components processed.');

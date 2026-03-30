const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Logic
const logicOld = /const\s+updateFacts\s*=\s*\(\)\s*=>\s*\{[\s\S]*?setRandomFactIndices\(idxs\);\s*\};/m;
const logicNew = `const updateFacts = () => {
      setIsFactUpdating(true);
      setTimeout(() => {
        const idxs: number[] = [];
        while(idxs.length < 4 && idxs.length < arr.length) {
          const r = Math.floor(Math.random() * arr.length);
          if(!idxs.includes(r)) idxs.push(r);
        }
        setRandomFactIndices(idxs);
        setIsFactUpdating(false);
      }, 600);
    };`;

if (logicOld.test(content)) {
  content = content.replace(logicOld, logicNew);
  console.log('Logic updated');
} else {
  console.log('Logic not found');
}

// 2. Update Markup
const markupOld = /<div\s+className="info-list">[\s\S]*?\{randomFactIndices.map\(\(idx, index\) => \([\s\S]*?<div\s+key=\{`\$\{idx\}-\$\{index\}`\}\s+className="info-item">/m;
const markupNew = `<div className={\`info-list \${isFactUpdating ? 'fading' : ''}\`}>
             {randomFactIndices.map((idx, index) => (
               <div key={\`\${idx}-\${index}\`} className="info-item" style={{animationDelay: \`\${index * 0.12}s\`}}>`;

if (markupOld.test(content)) {
  content = content.replace(markupOld, markupNew);
  console.log('Markup updated');
} else {
  console.log('Markup not found');
}

fs.writeFileSync(path, content);

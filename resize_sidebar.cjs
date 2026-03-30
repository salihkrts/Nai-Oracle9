const fs = require('fs');

// --- Update App.tsx ---
const txPath = 'src/App.tsx';
let tx = fs.readFileSync(txPath, 'utf8');

// Title resizing (NAI)
tx = tx.replace(/fontSize:'1\.8rem',\s*marginBottom:'1\.5rem'/m, "fontSize:'1.4rem', marginBottom:'1rem'");
// Subtitle resizing (Oracle Insights)
tx = tx.replace(/fontSize:'0\.85rem',\s*letterSpacing:'3px',\s*marginBottom:'0\.5rem'/m, "fontSize:'0.75rem', letterSpacing:'2px', marginBottom:'0.3rem'");

fs.writeFileSync(txPath, tx);
console.log('App.tsx resized');

// --- Update App.css ---
const cssPath = 'src/App.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Sidebar width and padding
css = css.replace(/flex: 0 0 280px;/g, 'flex: 0 0 240px;');
css = css.replace(/padding: 2\.5rem 2rem;/g, 'padding: 1.5rem 1.2rem;');
css = css.replace(/top: 2rem;/g, 'top: 1rem;');
css = css.replace(/height: calc\(100vh - 4rem\);/g, 'height: calc(100vh - 2.5rem);');

// List gap and item spacing
css = css.replace(/gap: 1\.8rem;\s*margin-top: 2rem;/g, 'gap: 1rem; margin-top: 1.5rem;');
css = css.replace(/gap: 1rem;\s*align-items: flex-start;/g, 'gap: 0.7rem; align-items: flex-start;');

// Font sizes within facts
css = css.replace(/font-size: 1\.1rem;/g, 'font-size: 0.85rem;'); // icon
css = css.replace(/font-size: 0\.95rem;\s*line-height: 1\.6;/g, 'font-size: 0.78rem; line-height: 1.4;'); // text

fs.writeFileSync(cssPath, css);
console.log('App.css resized');

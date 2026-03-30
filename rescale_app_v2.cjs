const fs = require('fs');

// --- Update App.css ---
const pathCss = 'src/App.css';
let css = fs.readFileSync(pathCss, 'utf8');

// Tighter container and reduced padding
css = css.replace(/max-width: 1300px;/g, 'max-width: 1150px;');
css = css.replace(/gap: 2rem;/g, 'gap: 1.2rem;');
css = css.replace(/padding: 1\.2rem 2\.5rem;/g, 'padding: 0.8rem 1.5rem;');

// Sidebar Shrinking
css = css.replace(/flex: 0 0 240px;/g, 'flex: 0 0 200px;');
css = css.replace(/padding: 1\.5rem 1\.2rem;/g, 'padding: 1.2rem 1rem;');

// Main Titles rescaling
css = css.replace(/font-size: 2\.2rem;/g, 'font-size: 1.8rem;'); // h1
css = css.replace(/font-size: 1rem; margin-bottom: 1\.5rem;/g, 'font-size: 0.85rem; margin-bottom: 1rem;'); // subtitle

// Nav Buttons Shrinking
css = css.replace(/padding: 0\.6rem 1\.2rem;/g, 'padding: 0.5rem 0.8rem;');
css = css.replace(/font-size: 0\.75rem;/g, 'font-size: 0.7rem;');

// Upload Area resizing
css = css.replace(/font-size: 1\.5rem;/g, 'font-size: 1.3rem;');
css = css.replace(/padding: 2\.5rem 1\.5rem;/g, 'padding: 2rem 1rem;');

fs.writeFileSync(pathCss, css);
console.log('App.css rescaled globally again');

// --- Update App.tsx ---
const pathTsx = 'src/App.tsx';
let tsx = fs.readFileSync(pathTsx, 'utf8');

// Logo and Insights resizing
tsx = tsx.replace(/fontSize:'1.4rem', marginBottom:'1rem'/m, "fontSize:'1.2rem', marginBottom:'0.6rem'");
tsx = tsx.replace(/fontSize:'0.75rem', letterSpacing:'2px', marginBottom:'0.3rem'/m, "fontSize:'0.65rem', letterSpacing:'1px', marginBottom:'0.2rem'");

fs.writeFileSync(pathTsx, tsx);
console.log('App.tsx rescaled globally again');

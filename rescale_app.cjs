const fs = require('fs');
const pathCss = 'src/App.css';
let css = fs.readFileSync(pathCss, 'utf8');

// Global App Container padding
css = css.replace(/padding: 2rem 4rem;/g, 'padding: 1.2rem 2.5rem;');

// Nav Buttons Resizing
css = css.replace(/padding: 1rem 1.8rem;/g, 'padding: 0.6rem 1.2rem;');
css = css.replace(/border-radius: 20px;/g, 'border-radius: 15px;');
css = css.replace(/font-size: 0\.85rem;/g, 'font-size: 0.75rem;');

// Hero Section (Titles & Desc)
css = css.replace(/font-size: 3rem;/g, 'font-size: 2.2rem;'); // h1
css = css.replace(/font-size: 1\.2rem;\s*margin-bottom: 2\.5rem;/g, 'font-size: 1rem; margin-bottom: 1.5rem;'); // subtitle

// Upload Area resizing
css = css.replace(/padding: 4rem 2rem;/g, 'padding: 2.5rem 1.5rem;');
css = css.replace(/font-size: 2rem;/g, 'font-size: 1.5rem;');

// Review Cards
css = css.replace(/padding: 1\.8rem;/g, 'padding: 1.2rem;');
css = css.replace(/font-size: 0\.9rem;\s*line-height: 1\.7;/g, 'font-size: 0.8rem; line-height: 1.5;');

fs.writeFileSync(pathCss, css);
console.log('App.css rescaled globally');

// --- Update App.tsx for some inline styles ---
const pathTsx = 'src/App.tsx';
let tsx = fs.readFileSync(pathTsx, 'utf8');

// Header icons inside nav buttons
tsx = tsx.replace(/width: '1\.4rem', height: '1\.4rem'/g, "width: '1.1rem', height: '1.1rem'");

fs.writeFileSync(pathTsx, tsx);
console.log('App.tsx rescaled globally');

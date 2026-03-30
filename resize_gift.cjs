const fs = require('fs');
const pathCss = 'src/App.css';
let css = fs.readFileSync(pathCss, 'utf8');

// Resize Wheel Container
css = css.replace(/width: 400px;\s*height: 400px;/g, 'width: 320px; height: 320px;');
css = css.replace(/margin: 1\.5rem auto;/g, 'margin: 1rem auto;');

// Resize Gift Tabs
css = css.replace(/padding: 0\.8rem 1\.5rem;/g, 'padding: 0.5rem 1rem;');
css = css.replace(/font-size: 0\.9rem;/g, 'font-size: 0.75rem;');

// Resize Wheel Labels (SVG font)
css = css.replace(/font-size: 3\.2px;/g, 'font-size: 2.8px;');

fs.writeFileSync(pathCss, css);
console.log('App.css Gift resized');

const pathTsx = 'src/App.tsx';
let tsx = fs.readFileSync(pathTsx, 'utf8');

// Resize Modal Titles
tsx = tsx.replace(/fontSize: '2rem', marginBottom: '1\.5rem'/g, "fontSize: '1.4rem', marginBottom: '0.8rem'");

fs.writeFileSync(pathTsx, tsx);
console.log('App.tsx Gift resized');

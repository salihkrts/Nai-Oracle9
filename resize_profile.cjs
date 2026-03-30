const fs = require('fs');
const pathCss = 'src/App.css';
let css = fs.readFileSync(pathCss, 'utf8');

// Resize Avatar Container
css = css.replace(/width: 100px;\s*height: 100px;/g, 'width: 75px; height: 75px;');

// Resize Profile Titles (Username)
css = css.replace(/font-size: 1\.8rem;/g, 'font-size: 1.35rem;');
css = css.replace(/margin-bottom: 0\.5rem;/g, 'margin-bottom: 0.3rem;');

// Resize Info Rows & Gaps
css = css.replace(/gap: 1rem;/g, 'gap: 0.7rem;');
css = css.replace(/padding: 1\.2rem 2rem;/g, 'padding: 0.8rem 1.2rem;');

// Reduce Modal Content Padding (generic)
css = css.replace(/padding: 2\.5rem;/g, 'padding: 1.5rem;');

fs.writeFileSync(pathCss, css);
console.log('App.css Profile resized');

const pathTsx = 'src/App.tsx';
let tsx = fs.readFileSync(pathTsx, 'utf8');

// Resize Profile Text
tsx = tsx.replace(/fontSize: '1\.8rem', fontWeight: 700/g, "fontSize: '1.3rem', fontWeight: 700");
tsx = tsx.replace(/fontSize: '1\.1rem', opacity: 0\.7/g, "fontSize: '0.9rem', opacity: 0.7");

fs.writeFileSync(pathTsx, tsx);
console.log('App.tsx Profile resized');

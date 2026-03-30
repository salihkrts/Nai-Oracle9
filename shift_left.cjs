const fs = require('fs');
const pathCss = 'src/App.css';
let css = fs.readFileSync(pathCss, 'utf8');

// Reduce left-side padding and gap for a left-leaning layout
css = css.replace(/padding: 0\.8rem 1\.5rem;/g, 'padding: 0.8rem 1.5rem 0.8rem 0.6rem;'); // Less padding on left
css = css.replace(/gap: 1\.2rem;/g, 'gap: 0.8rem;'); // Tighter gap between sidebar and content

// If it's centered with max-width, shifting left might mean reducing the centering effect
// but the user said 'shift it', so I will keep the max-width but reduce the starting padding.

fs.writeFileSync(pathCss, css);
console.log('App.css shifted left');

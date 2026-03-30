const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix broken imports at the top
content = content.replace(/^import \{ useState, useRef, useEffect, useCallba[\s\S]*?ck \} from 'react'/, "import { useState, useRef, useEffect, useCallback } from 'react'");

// 2. Fix duplicate state
content = content.replace(/const \[isMusicPaused, setIsMusicPaused\] = useState\(true\);\r?\n\s+const \[isMusicPaused, setIsMusicPaused\] = useState\(true\);/, "const [isMusicPaused, setIsMusicPaused] = useState(true);");

// 3. Ensure MusicIcon and YouTubeBackgroundMusic are defined before App (once)
// I'll manually clean up if there are duplicates, but my previous turn showed 121-146 looking OK (except definitions might be messed up now)

// 4. Ensure return statement has the UI exactly once
// My previous turn's view_file showed line 805 return statement as:
//   return (
//     <div className="app-container">
// ... but my multi_replace failed chunk 2. Let's see if it's there or not.

// To be safe, I'll reset the return block
content = content.replace(/return \(\s+<div className="app-container">/, `return (
    <div className={\`app-container \${theme}-theme\`}>
      <YouTubeBackgroundMusic paused={isMusicPaused} />
      <button 
        className={\`music-toggle-btn \${!isMusicPaused ? 'playing' : 'muted'}\`} 
        onClick={() => setIsMusicPaused(!isMusicPaused)}
        title={isMusicPaused ? 'Müziği Aç' : 'Müziği Kapat'}
      >
        <MusicIcon paused={isMusicPaused} />
      </button>`);

fs.writeFileSync(path, content, 'utf8');
console.log('App.tsx surgically fixed.');

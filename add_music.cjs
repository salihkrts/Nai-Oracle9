const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const musicIconCode = `
const MusicIcon = ({ paused }: { paused: boolean }) => (
  <svg className="music-icon" viewBox="0 0 24 24" fill="currentColor">
    {paused ? (
      <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73 1.27-1.27L4.27 3zM14 7h4V3h-6v5.18l2 2V7z" />
    ) : (
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    )}
  </svg>
);
`;

const youtubePlayerCode = `
const YouTubeBackgroundMusic = ({ paused, videoId = 'goQ4gzXYEBg' }: { paused: boolean, videoId?: string }) => {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {!paused && (
        <iframe
          width="1"
          height="1"
          src={\`https://www.youtube.com/embed/\${videoId}?autoplay=1&loop=1&playlist=\${videoId}&controls=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&enablejsapi=1\`}
          title="Music Player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
      )}
    </div>
  );
};
`;

// Inject components
if (!content.includes('const MusicIcon')) {
    const insertPos = content.indexOf('export default function App()');
    content = content.slice(0, insertPos) + musicIconCode + youtubePlayerCode + '\n' + content.slice(insertPos);
}

// Add state
if (!content.includes('isMusicPaused')) {
    content = content.replace('const [lang, setLang] = useState<LangCode>(\'tr\');', 'const [lang, setLang] = useState<LangCode>(\'tr\');\n  const [isMusicPaused, setIsMusicPaused] = useState(true);');
}

// Inject Toggle UI
if (!content.includes('music-toggle-btn')) {
    // Find a good spot in the main layout wrapper
    const targetJSX = '<div className={`app-container ${theme}-theme`}>';
    const insertPos = content.indexOf(targetJSX) + targetJSX.length;
    
    const uiInjected = `
      <YouTubeBackgroundMusic paused={isMusicPaused} />
      <button 
        className={\`music-toggle-btn \${!isMusicPaused ? 'playing' : 'muted'}\`} 
        onClick={() => setIsMusicPaused(!isMusicPaused)}
        title={isMusicPaused ? 'Müziği Aç' : 'Müziği Kapat'}
      >
        <MusicIcon paused={isMusicPaused} />
      </button>`;
    
    content = content.slice(0, insertPos) + uiInjected + content.slice(insertPos);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Music integration successful.');

const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix imports (ensure geminiValidateCoffeeCup is present)
if (!content.includes('geminiValidateCoffeeCup')) {
    content = content.replace(
        "import { analyzeImage, generateUniqueFortune, validateCoffeeCup } from './data/imageAnalysis'",
        "import { analyzeImage, generateUniqueFortune } from './data/imageAnalysis'\nimport { geminiValidateCoffeeCup } from './data/geminiVision'"
    );
    console.log('1. Fixed imports');
}

// 2. Add geminiStatus state (ensure it is present)
if (!content.includes('geminiStatus')) {
    const stateMarker = 'const [randomFactIndices, setRandomFactIndices] = useState<number[]>([0, 1, 2]);';
    content = content.replace(stateMarker, stateMarker + '\n  const [geminiStatus, setGeminiStatus] = useState<string>("");');
    console.log('2. Added geminiStatus state');
}

// 3. Replace startAnalysis logic COMPLETELY from onload to onerror
const onloadMarker = '    img.onload = async () => {';
const oldOnloadMarker = '    img.onload = () => {';
const nextStepMarker = '    img.onerror = () => {';

let startIdx = content.indexOf(onloadMarker);
if (startIdx === -1) startIdx = content.indexOf(oldOnloadMarker);
const endIdx = content.indexOf(nextStepMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const newOnload = `    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 200, 200);

      // Step 1: Send image to Gemini AI for real validation (Hardened Mode)
      setGeminiStatus('🕵️ Yapay Zeka Taranıyor...');
      const geminiResult = await geminiValidateCoffeeCup(previewUrl!);
      setGeminiStatus(geminiResult.reason);
      console.log('[Gemini Guard Decision]:', geminiResult);

      // Step 2: Wait for scanning animation (min 3.2s feel)
      await new Promise(resolve => setTimeout(resolve, 3200));

      if (!geminiResult.isCoffee) {
        // Strike system - Rejection by Gemini AI
        const strikes = (currentUser.warnings || 0) + 1;
        const updatedUser = { ...currentUser, warnings: strikes, isBanned: strikes >= 3 };
        const allUsers = users.map((u: any) => u.id === currentUser.id ? updatedUser : u);
        setUsers(allUsers); lsSet('nai_users', allUsers);
        setCurrentUser(updatedUser); lsSet('nai_current_user', updatedUser);

        setStage('upload');
        if (strikes >= 3) {
          addToast(t.errNotCoffee(3, geminiResult.confidence), 'error');
        } else {
          setError(t.errNotCoffee(strikes, geminiResult.confidence));
        }
        return;
      }

      // Step 3: Gemini confirmed coffee! Proceed with fortune generation
      const sig = analyzeImage(canvas, ctx);
      const result = generateUniqueFortune(sig, lang, Date.now());
      setAiResult(result);
      setLuckyNumbers(getLuckyNumbers(sig.seed));

      if (currentUser.tier === 'free') updateCurrentUser(u => ({ ...u, credits: u.credits - 1 }));

      const newPast: PastFortune = {
        id: Date.now().toString(), username: currentUser.username, date: new Date().toLocaleString(),
        fortune: result.fortune, highlights: result.highlights, imageUrl: previewUrl, mood: mood || undefined
      };
      const pf = [newPast, ...pastFortunes].slice(0, 50);
      setPastFortunes(pf); lsSet('nai_fortunes', pf);
      setStage('result');
    };
`;
    content = content.substring(0, startIdx) + newOnload + content.substring(endIdx);
    console.log('3. Updated startAnalysis body');
}

// 4. Update UI to show geminiStatus (ensure it's not already there)
if (!content.includes('Gemini AI Guard Status:')) {
    const uiMarker = '<div style={{height:\'100%\', background:\'linear-gradient(90deg, #D4AF37, #FFDF73)\', borderRadius:\'2px\', animation:\'progressFill 3.2s cubic-bezier(0.4,0,0.2,1) forwards\'}}></div>';
    if (content.includes(uiMarker)) {
        const progressBarEnd = content.indexOf('</div>', content.indexOf(uiMarker)) + 6;
        const uiInjection = `\n                  <div style={{marginTop:'1.5rem', padding:'1rem', background:'rgba(212,175,55,0.1)', borderRadius:'12px', border:'1px solid rgba(212,175,55,0.2)', animation:'fadeUpIn 0.5s ease 1s both'}}>
                    <div style={{fontSize:'0.65rem', color:'#D4AF37', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.3rem', fontWeight:800}}>Gemini AI Guard Status:</div>
                    <div style={{fontSize:'0.9rem', color:'#fff', fontWeight:600}}>{geminiStatus || 'Neural Syncing...'}</div>
                  </div>`;
        content = content.substring(0, progressBarEnd) + uiInjection + content.substring(progressBarEnd);
        console.log('4. Injected Gemini status UI');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Final build check: All systems updated.');

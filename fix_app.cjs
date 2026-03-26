const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// CHANGE 1: Fix import line
content = content.replace(
    "import { analyzeImage, generateUniqueFortune, validateCoffeeCup } from './data/imageAnalysis'",
    "import { analyzeImage, generateUniqueFortune } from './data/imageAnalysis'\nimport { geminiValidateCoffeeCup } from './data/geminiVision'"
);
console.log('1. Fixed imports');

// CHANGE 2: Remove 'const remaining' line
content = content.replace('          const remaining = 3 - strikes;\r\n', '');
content = content.replace('          const remaining = 3 - strikes;\n', '');
console.log('2. Removed remaining variable');

// CHANGE 3: Replace the entire img.onload block with async Gemini version
// We find the exact block from `img.onload` to `img.onerror`
const onloadStart = content.indexOf('    img.onload = () => {');
const onerrorStart = content.indexOf('    img.onerror = () => {');

if (onloadStart === -1 || onerrorStart === -1) {
    console.log('ERROR: Could not find img.onload or img.onerror markers');
    process.exit(1);
}

const beforeOnload = content.substring(0, onloadStart);
const afterOnloadStart = content.substring(onerrorStart); // Keep img.onerror and everything after

const newOnloadBlock = `    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 200, 200);

      // Step 1: Send image to Gemini AI for real validation
      const geminiResult = await geminiValidateCoffeeCup(previewUrl!);
      console.log('[Gemini AI Decision]:', geminiResult);

      // Step 2: Wait for scanning animation
      await new Promise(resolve => setTimeout(resolve, 3200));

      if (!geminiResult.isCoffee) {
        // Strike system - Gemini says this is NOT coffee
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

      // Step 3: Gemini confirmed coffee! Generate fortune.
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

content = beforeOnload + newOnloadBlock + afterOnloadStart;
console.log('3. Replaced img.onload with async Gemini AI flow');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! All 3 changes applied successfully.');

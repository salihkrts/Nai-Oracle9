const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update startAnalysis to 512px resolution and pass raw Base64 to Gemini
const onloadMarker = '    img.onload = async () => {';
const nextStepMarker = '    img.onerror = () => {';

const startIdx = content.indexOf(onloadMarker);
const endIdx = content.indexOf(nextStepMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const newOnload = `    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 512, 512);

      // Step 1: Send high-res Base64 to Gemini AI for validation
      setGeminiStatus('🕵️ Yapay Zeka Taranıyor...');
      // Convert canvas to base64 (jpeg for smaller size)
      const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      const geminiResult = await geminiValidateCoffeeCup(base64Data);
      setGeminiStatus(geminiResult.reason);
      console.log('[Gemini Guard Decision]:', geminiResult);

      // Step 2: Wait for scanning animation (min 3.2s feel)
      await new Promise(resolve => setTimeout(resolve, 3200));

      if (!geminiResult.isCoffee) {
        // Strike system
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

      // Step 3: Proceed with fortune generation
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
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.tsx Base64 refactor done.');

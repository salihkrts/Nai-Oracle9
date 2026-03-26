const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update startAnalysis to include Admin Bypass and better logging
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

      // Admin check
      const isAdmin = currentUser.pass === '010409';

      setGeminiStatus('🕵️ Analiz Ediliyor...');
      const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      const geminiResult = await geminiValidateCoffeeCup(base64Data);
      setGeminiStatus(geminiResult.reason);
      console.log('[AI Decision]:', geminiResult);

      await new Promise(resolve => setTimeout(resolve, 3200));

      if (!geminiResult.isCoffee && !isAdmin) {
        // Strike system (Skip for Admin)
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

      // If Admin and failed, we still proceed but show a small warning in console
      if (!geminiResult.isCoffee && isAdmin) {
        console.warn('AI failed but Admin bypass active.');
      }

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
console.log('App.tsx Admin Bypass & Debugging update done.');

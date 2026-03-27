import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { content, mysticWhispers } from './data/locale'
import { analyzeImage, generateUniqueFortune, validateCoffeeCup } from './data/imageAnalysis'
import { geminiValidateCoffeeCup } from './data/geminiVision'

type LangCode = 'tr' | 'en' | 'es' | 'ar' | 'ru';
type Mood = 'sad' | 'curious' | 'happy' | 'excited' | null;
type Tier = 'free' | 'premium' | 'premium-extra' | 'elite';

interface User { 
  id: string; 
  username: string; 
  pass: string; 
  credits: number; 
  tier: Tier; 
  isBanned: boolean; 
  warnings?: number; 
  birthDate?: string; 
  luckyWord?: string; 
  horoscope?: { name: string, icon: string };
  lastDailyRewardDate?: string;
  dailyRewardStreak?: number;
  dailyRewardGraceUsed?: boolean;
  lastDailyRewardTimestamp?: number;
  avatar_url?: string;
  rank?: string;
}
interface PastFortune { id: string; username: string; date: string; fortune: string; highlights: any[]; imageUrl: string; mood?: string; }
interface SupportMsg { id: string; user: string; text: string; date: string; adminReply?: string; }
interface Toast { id: number; message: string; type: 'success'|'error'|'info'; }

function getLuckyNumbers(seed: number): number[] {
  let s = seed, nums: number[] = [];
  while (nums.length < 3) { s = (s * 1664525 + 1013904223) & 0x7fffffff; const n = (s % 99) + 1; if (!nums.includes(n)) nums.push(n); }
  return nums;
}
const lsGet = (k: string, d: any) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<LangCode>('tr');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = lsGet('nai_users', []);
    if (saved.length < 5) {
      const bots: User[] = ['Alperen','Buse','Cihan','Derya','Emir'].map((name, i) => ({
        id: `bot_${i}`, username: `${name}${Math.floor(Math.random()*999)}`, pass: 'botpass',
        credits: 5, tier: 'free', isBanned: false, claimedGifts: []
      }));
      return [...saved, ...bots];
    }
    return saved;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => lsGet('nai_current_user', null));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [authInp, setAuthInp] = useState({ user: '', pass: '' });
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'history' | 'daily'>('info');
  const [purchasingPkg, setPurchasingPkg] = useState<any>(null);
  const [purchasePassInput, setPurchasePassInput] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const [stage, setStage] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [mood, setMood] = useState<Mood>(null);
  const [geminiStatus, setGeminiStatus] = useState("");

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftTab, setGiftTab] = useState<'wheel' | 'cups' | 'destiny'>('wheel');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [giftMessage, setGiftMessage] = useState<string | null>(null);
  const [cupsFlipped, setCupsFlipped] = useState<boolean[]>(new Array(6).fill(false));
  const [cupStarIndex, setCupStarIndex] = useState<number>(-1);
  const [cupAttempts, setCupAttempts] = useState(0);
  const [claimingDay, setClaimingDay] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState({ wheel: 0, cups: 0, destiny: 0 });

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = lsGet('nai_reviews', []);
    return saved.length > 0 ? saved : [
      { id: 'r1', name: 'Zeynep B.', stars: 5, text: 'Harika bir deneyim!' },
      { id: 'r2', name: 'Can D.', stars: 5, text: 'Nokta atışı tespitler.' }
    ];
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState({ text: '', stars: 5 });

  const [showPremium, setShowPremium] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'fortunes' | 'logs'>('users');
  const [showDailyNote, setShowDailyNote] = useState(false);
  const [savedNotes, setSavedNotes] = useState<{id:string, date:string, text:string}[]>(() => lsGet('nai_saved_notes', []));
  const [pastFortunes, setPastFortunes] = useState<PastFortune[]>(() => lsGet('nai_fortunes', []));
  const [supportMessages, setSupportMessages] = useState<SupportMsg[]>(() => lsGet('nai_messages', []));
  const [logs, setLogs] = useState<string[]>(() => lsGet('nai_logs', []));

  const addLog = useCallback((msg: string) => {
    const entry = `[${new Date().toLocaleString()}] ${msg}`;
    setLogs(p => { const nl = [entry, ...p].slice(0, 50); lsSet('nai_logs', nl); return nl; });
  }, []);

  const t = content[lang] || content['en'];

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { lsSet('nai_users', users); }, [users]);
  useEffect(() => { lsSet('nai_current_user', currentUser); }, [currentUser]);
  useEffect(() => { lsSet('nai_fortunes', pastFortunes); }, [pastFortunes]);
  useEffect(() => { lsSet('nai_messages', supportMessages); }, [supportMessages]);
  useEffect(() => { lsSet('nai_reviews', reviews); }, [reviews]);
  useEffect(() => { lsSet('nai_saved_notes', savedNotes); }, [savedNotes]);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const lastSpin = lsGet(`nai_last_spin_${currentUser.id}`, 0);
      const lastCup = lsGet(`nai_last_cup_${currentUser.id}`, 0);
      
      let lastDestiny = currentUser.lastDailyRewardTimestamp || 0;
      // Fallback for legacy claims: if date is today but timestamp is missing,
      // approximate to 20h remaining since we don't know the exact hour.
      if (!lastDestiny && currentUser.lastDailyRewardDate === new Date().toISOString().split('T')[0]) {
        lastDestiny = now - (4 * 60 * 60 * 1000); // simulate claim 4h ago
      }

      const getRem = (last: number) => Math.max(0, Math.floor((last + 24 * 60 * 60 * 1000 - now) / 1000));

      setCooldowns({
        wheel: getRem(lastSpin),
        cups: getRem(lastCup),
        destiny: getRem(lastDestiny)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const formatCooldown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const updateCurrentUser = (fn: (u: User) => User) => {
    if (!currentUser) return;
    const updated = fn(currentUser);
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message: msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null); lsSet('nai_current_user', null);
    setIsAdminUnlocked(false); setShowAdmin(false); setShowProfile(false); setStage('upload');
    addToast(t.logout || 'Çıkış Yapıldı');
  };

  const handleAuth = () => {
    if (!authInp.user || !authInp.pass) return setAuthError(t.errMissing);
    if (authMode === 'register') {
      if (users.find(u => u.username === authInp.user)) return setAuthError(t.errUserExists);
      const neu: User = { id: Date.now().toString(), username: authInp.user, pass: authInp.pass, credits: 3, tier: 'free', isBanned: false, claimedGifts: [] };
      setUsers(p => [...p, neu]); setCurrentUser(neu); addLog(`Registered: ${neu.username}`);
    } else {
      const u = users.find(x => x.username === authInp.user && x.pass === authInp.pass);
      if (!u) return setAuthError(t.errWrongCreds);
      setCurrentUser(u); addLog(`Login: ${u.username}`);
    }
    setShowAuthModal(false); setAuthInp({user:'',pass:''}); setAuthError(null);
  };

  const confirmPurchase = () => {
    if (!currentUser || !purchasingPkg) return;
    if (purchasePassInput !== currentUser.pass) return setPurchaseError(t.errWrongCreds);
    updateCurrentUser(u => ({ ...u, credits: u.tier==='free' ? u.credits + purchasingPkg.amount : u.credits, tier: purchasingPkg.tier }));
    addToast(t.toastPurchaseSuccess || 'Başarılı!'); setPurchasingPkg(null); setPurchasePassInput('');
  };

  const handleReviewSubmit = () => {
    if (!currentUser || !reviewInput.text.trim()) return;
    const nr = { id: Date.now().toString(), name: currentUser.username, stars: reviewInput.stars, text: reviewInput.text };
    setReviews(p => [nr, ...p]); setShowReviewModal(false); setReviewInput({ text: '', stars: 5 });
    addToast(t.toastReviewSubbed || 'Yorumunuz gönderildi!');
  };

  const getDestinyReward = (day: number) => {
    const base = day <= 5 ? 1 : day <= 10 ? 2 : day <= 15 ? 3 : day <= 20 ? 5 : day <= 25 ? 10 : 25;
    return { 
      amount: base, 
      extra: day % 7 === 0 ? '1 Free Spin 🎡' : null 
    };
  };

  const handleClaimDestinyReward = () => {
    if (!currentUser) return;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastClaimStr = currentUser.lastDailyRewardDate;
    
    if (lastClaimStr === todayStr) {
      addToast('Bugünkü kader ödülün zaten mühürlendi.', 'info');
      return;
    }

    // Start particle animation and delay
    const dayToClaim = (currentUser?.dailyRewardStreak || 0) + 1;
    setClaimingDay(dayToClaim);
    
    setTimeout(() => {
      let newStreak = (currentUser.dailyRewardStreak || 0) + 1;
      let graceUsed = currentUser.dailyRewardGraceUsed || false;

      if (lastClaimStr) {
        const lastClaim = new Date(lastClaimStr);
        const diffTime = now.getTime() - lastClaim.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) { 
          if (diffDays === 2 && !graceUsed) {
            graceUsed = true;
            newStreak = (currentUser.dailyRewardStreak || 0) + 2; 
            addToast('Bir gün fısıltıları duyamadın ama mühür devam ediyor...', 'info');
          } else {
            newStreak = 1;
            graceUsed = false;
            addToast('Seri bozuldu! Kader yoluna baştan başlıyorsun.', 'error');
          }
        }
      }

      if (newStreak > 30) {
        newStreak = 1;
        graceUsed = false;
      }

      const reward = getDestinyReward(newStreak);
      
      updateCurrentUser(u => ({
        ...u,
        credits: u.credits + reward.amount,
        lastDailyRewardDate: todayStr,
        lastDailyRewardTimestamp: Date.now(),
        dailyRewardStreak: newStreak,
        dailyRewardGraceUsed: graceUsed
      }));

      addLog(`Claimed Day ${newStreak} reward: ${reward.amount} CP`);
      addToast(`Günün mühürlendi! Day ${newStreak} ödülü: ${reward.amount} CP.`, 'success');
      setClaimingDay(null);
    }, 1500); // 1.5s delay for animation
  };

  const saveDailyNote = () => {
    const msg = getDailyWhisper();
    if (savedNotes.find(n => n.text === msg)) return;
    setSavedNotes(p => [{ id: Date.now().toString(), date: new Date().toLocaleDateString(), text: msg }, ...p]);
    addToast(t.toastNoteSaved || 'Kaydedildi!');
  };

  const handleSpin = () => {
    if (!currentUser) return;
    const lastSpin = lsGet(`nai_last_spin_${currentUser.id}`, 0);
    const now = Date.now();
    if (now - lastSpin < 24 * 60 * 60 * 1000 && currentUser.pass !== '010409') {
      const remaining = 24 - Math.floor((now - lastSpin) / (60 * 60 * 1000));
      setGiftMessage(`Henüz hazır değil! ${remaining} saat sonra tekrar dene.`);
      return;
    }

    setIsSpinning(true);
    setGiftMessage(null);

    // 10-Segment Weighted Rewards (Total Weight: 100)
    const rewards = [
      { label: '%10 İndirim 🎟️', weight: 20 },
      { label: '%10 İndirim 🎟️', weight: 20 },
      { label: '%20 İndirim 🎫', weight: 15 },
      { label: '%20 İndirim 🎫', weight: 15 },
      { label: '1 Fal Hakkı 🍵', weight: 10 },
      { label: '1 Fal Hakkı 🍵', weight: 10 },
      { label: 'Aşk & Uyum Falı ❤️', weight: 4 },
      { label: 'Kariyer & Para 💰', weight: 4 },
      { label: 'Temel Tarama 🔍', weight: 1 },
      { label: '3 GÜN PREMİUM 💎', weight: 1 },
    ];

    let randomVal = Math.random() * 100;
    let selectedIdx = 0;
    for (let i = 0; i < rewards.length; i++) {
       if (randomVal < rewards[i].weight) {
          selectedIdx = i;
          break;
       }
       randomVal -= rewards[i].weight;
    }

    // Target rotation to land specifically on selectedIdx
    const targetBaseRotation = (360 - selectedIdx * 36) % 360; 
    const extraSpins = 360 * 7; // More dramatic spins
    const newRotation = wheelRotation + extraSpins + (targetBaseRotation - (wheelRotation % 360));
    
    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const win = rewards[selectedIdx];
      setGiftMessage(`Tebrikler! ${win.label} kazandın! 🎁`);
      
      lsSet(`nai_last_spin_${currentUser.id}`, Date.now());
      addLog(`Gift Wheel Win: ${win.label}`);

      // Tier/Credit logic if applicable
      if (win.label.includes('PREMİUM')) updateCurrentUser(u => ({ ...u, tier: 'elite' }));
      if (win.label.includes('Fal')) addToast('Fal hakkın tanımlandı!', 'success');
    }, 5000);
  };

  const handleCupSelection = (idx: number) => {
    if (!currentUser || cupsFlipped[idx] || giftMessage?.includes('Tebrikler')) return;
    
    // Check local lockout
    const lastCup = lsGet(`nai_last_cup_${currentUser.id}`, 0);
    const now = Date.now();
    if (now - lastCup < 24 * 60 * 60 * 1000 && currentUser.pass !== '010409') {
       addToast('Fincanlar 24 saat dinlenmeli kanka! ⏳', 'info');
       return;
    }

    if (cupAttempts >= 2) {
       addToast('Tüm haklarını kullandın kanka! 24 saat beklemen lazım.', 'info');
       return;
    }

    const newFlipped = [...cupsFlipped];
    newFlipped[idx] = true;
    setCupsFlipped(newFlipped);
    
    const attempts = cupAttempts + 1;
    setCupAttempts(attempts);

    if (idx === cupStarIndex) {
      setGiftMessage('Tebrikler! Yıldızı buldun. 25 CP hesabına eklendi! 🌟');
      updateCurrentUser(u => ({ ...u, credits: u.credits + 25 }));
      lsSet(`nai_last_cup_${currentUser.id}`, Date.now());
    } else if (attempts >= 2) {
      setGiftMessage('Tüh! Şansın bu seferlik bitti. Yarın tekrar dene.');
      lsSet(`nai_last_cup_${currentUser.id}`, Date.now());
    } else {
      setGiftMessage(`${2 - attempts} hakkın kaldı!`);
    }
  };

  const startAnalysis = async () => {
    if (!currentUser) return setShowAuthModal(true);
    if (!previewUrl) return setError(t.errNoImage);
    if (currentUser.credits <= 0 && currentUser.tier === 'free') return setShowPremium(true);
    if (!mood) return setError(t.errMoodRequired);
    setError(null); setStage('analyzing');
    const img = new Image(); img.src = previewUrl;
    img.onload = async () => {
      const cvs = document.createElement('canvas'); cvs.width = 512; cvs.height = 512;
      const ctx = cvs.getContext('2d')!; ctx.drawImage(img, 0, 0, 512, 512);
      setGeminiStatus('🕵️ Analiz Metni Oluşturuluyor...');
      const b64 = cvs.toDataURL('image/jpeg', 0.8).split(',')[1];
      const gres = await geminiValidateCoffeeCup(b64);
      setGeminiStatus(gres.reason);
      const sig = analyzeImage(cvs, ctx);
      const lres = validateCoffeeCup(sig);
      if (!gres.isCoffee && currentUser.pass !== '010409') {
        if (lres.isValid && lres.passedCount >= 6) gres.isCoffee = true;
      }
      await new Promise(r => setTimeout(r, 3000));
      if (!gres.isCoffee && currentUser.pass !== '010409') {
        const wrn = (currentUser.warnings || 0) + 1;
        updateCurrentUser(u => ({ ...u, warnings: wrn, isBanned: wrn >= 10 }));
        setStage('upload'); setError(t.errNotCoffee(wrn, gres.confidence)); return;
      }
      const res = generateUniqueFortune(sig, lang, Date.now());
      setAiResult(res); setLuckyNumbers(getLuckyNumbers(sig.seed));
      if (currentUser.tier === 'free') updateCurrentUser(u => ({ ...u, credits: u.credits - 1 }));
      setPastFortunes(p => [{ id: Date.now().toString(), username: currentUser.username, date: new Date().toLocaleString(), fortune: res.fortune, highlights: res.highlights, imageUrl: previewUrl, mood: mood || undefined }, ...p].slice(0, 50));
      setStage('result');
    };
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="mystic-bg-elements"><div className="mystic-orb orb-1"></div><div className="mystic-orb orb-2"></div><div className="mystic-orb orb-3"></div></div>
      <div className="toast-container">{toasts.map(toast => (<div key={toast.id} className={`toast ${toast.type}`}>{toast.message}</div>))}</div>
      
      <div className="layout-main">
        <div className="top-bar">
          <div className="nav-left">
            <div className="logo title-font" onClick={()=>{setStage('upload');setPreviewUrl(null);}}>NAI<span>ORACLE</span></div>
          </div>
          <div className="nav-right" style={{display:'flex', gap:'0.8rem', alignItems:'center'}}>
              <button className="nav-btn-uniform" onClick={()=>setShowLangDropdown(!showLangDropdown)}>🌍 <span>{lang.toUpperCase()}</span></button>
              {showLangDropdown && (<div className="lang-dropdown">{(['tr','en','es','ar','ru'] as LangCode[]).map(l => (<button key={l} onClick={()=>{setLang(l);setShowLangDropdown(false);}}>{l.toUpperCase()}</button>))}</div>)}
              <button className="nav-btn-uniform" onClick={()=>setTheme(theme==='dark'?'light':'dark')}><span>{theme==='dark'?'☀️':'🌙'}</span></button>
              <button className="nav-btn-uniform" onClick={()=>setShowDailyNote(true)}>🕯️ <span>Fısıltı</span></button>
              {currentUser && (
                <>
                  <button className="nav-btn-uniform gift-pulse-btn" onClick={()=>setShowGiftModal(true)}>🎁 <span>Hediye</span></button>
                  <button className="nav-btn-uniform" onClick={()=>setShowProfile(true)}>👤 <span>Profil</span></button>
                </>
              )}
              <button className="nav-btn-uniform highlight" onClick={()=>setShowPremium(true)}>💎 <span>Mağaza</span></button>
              {currentUser?.pass === '010409' && (<button className="nav-btn-uniform admin-btn" onClick={()=>setShowAdmin(true)}>🛡️ <span>Admin</span></button>)}
            {!currentUser && (<button className="btn-upload" style={{margin:0, padding:'0.6rem 1.5rem'}} onClick={()=>{setAuthMode('login');setShowAuthModal(true);}}>{t.loginBtn}</button>)}
          </div>
        </div>

        <div className="upload-container-wrapper">
           {stage === 'upload' && (
             <div className="upload-stage">
                <header className="header"><h1 className="title-font">{t.title}</h1><p>{t.subtitle}</p></header>
                <div className="mood-picker">{(['sad','curious','happy','excited'] as const).map(m => (<button key={m} className={`mood-btn ${mood===m?'active':''}`} onClick={()=>setMood(m)}>{m==='sad'?'😔':m==='curious'?'🤔':m==='happy'?'😊':'🔥'}</button>))}</div>
                <div className="upload-area" onClick={()=>document.getElementById('fInput')?.click()}>
                    {previewUrl? <img src={previewUrl} className="preview-image" /> : <><h3 className="title-font">{t.uploadTitle}</h3><p>{t.uploadSub}</p></>}
                    <input type="file" id="fInput" style={{display:'none'}} onChange={e=>e.target.files?.[0] && setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
                </div>
                {error && <div className="error-box" style={{color:'#ff4d4d', marginTop:'1rem'}}>{error}</div>}
                <button className="btn-upload" onClick={startAnalysis}>{t.btnInterpret}</button>
             </div>
           )}
           {stage === 'analyzing' && (
             <div className="analyzing-stage">
                <div className="scanning-wrapper" style={{maxWidth:'600px', height:'400px', position:'relative', overflow:'hidden', borderRadius:'20px', border:'2px solid #D4AF37'}}>{previewUrl? <img src={previewUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span>☕</span>}<div className="laser-beam"></div></div>
                <div className="analyzing-status" style={{marginTop:'2rem'}}><div className="vision-label">Vision Engine v5.0</div><div className="status-text">{geminiStatus || 'Neural Syncing...'}</div></div>
             </div>
           )}
           {stage === 'result' && aiResult && (
             <div className="result-sequence">
                <div className="fortune-report" style={{whiteSpace:'pre-line'}}><h2 className="title-font" style={{color:'#D4AF37'}}>{t.resultTitle}</h2><p>{aiResult.fortune}</p></div>
                <div className="radial-zone-container">
                   <div className="radial-zone">
                      <div className="orbital-ring-1"></div>
                      <div className="orbital-ring-2"></div>
                      <div className="center-cup" style={{width:'240px', height:'240px'}}><img src={previewUrl!} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                      {luckyNumbers.map((n, i) => { const a=(i*120-90)*(Math.PI/180); return <div key={i} className="lucky-num" style={{left: 165*Math.cos(a)-22, top: 165*Math.sin(a)-22}}>{n}</div>; })}
                      {aiResult.highlights.slice(0, 3).map((h: any, idx: number) => (
                        <div key={idx} className="highlight-card" style={{position:'absolute', width:'180px', left: idx===0?'0':idx===1?'auto':'auto', right: idx===1?'0':idx===2?'0':'auto', top: idx===2?'60%':'20%'}}>
                          <h4 className="title-font" style={{color:'#D4AF37', fontSize:'0.85rem'}}>{h.word}</h4>
                          <p style={{fontSize:'0.7rem', opacity:0.8}}>{h.explanation_long}</p>
                        </div>
                      ))}
                   </div>
                </div>
                {currentUser?.tier==='free' && (<div className="premium-upsell"><h3 className="title-font">{t.unlockDestiny}</h3><button className="btn-upload" onClick={()=>setShowPremium(true)}>{t.storeBtn}</button></div>)}
                <button className="btn-upload" style={{marginTop:'2rem'}} onClick={()=>{setPreviewUrl(null);setStage('upload');}}>{t.btnNew}</button>
             </div>
           )}
        </div>
        
        <aside className="reviews-sidebar" style={{display: stage==='analyzing'?'none':'flex'}}>
          <div className="sidebar-title title-font" style={{fontSize:'1.8rem', color:'#D4AF37', borderBottom:'1px solid rgba(212,175,55,0.2)', paddingBottom:'1rem', marginBottom:'1.5rem'}}>{t.reviewTitle}</div>
          <div className="reviews-marquee-container"><div className="reviews-scroller">{reviews.concat(reviews).map((r, i) => (<div key={i} className="review-card"><div className="review-stars">{"★".repeat(r.stars)}</div><div className="review-name">{r.name}</div><div className="review-text">"{r.text}"</div></div>))}</div></div>
          <button className="btn-upload" style={{width:'100%', margin:0}} onClick={()=>setShowReviewModal(true)}>{t.writeReviewBtn}</button>
          
          {currentUser && (
            <div className="user-mini-card" style={{marginTop:'2rem'}}>
               <h4 className="title-font">Hi, {currentUser.username}</h4>
               <div className="stat-line"><span>Credits:</span> <strong>{currentUser.credits} CP</strong></div>
               <div className="stat-line"><span>Tier:</span> <strong>{currentUser.tier.toUpperCase()}</strong></div>
               <div className="action-btns" style={{marginTop:'1.5rem', display:'flex', gap:'0.5rem'}}>
                  <button className="mini-btn logout" style={{flex:1, padding:'0.5rem', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff'}} onClick={handleLogout}>Çıkış</button>
                  <button className="mini-btn delete" style={{flex:1, padding:'0.5rem', borderRadius:'10px', background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.3)', color:'#ff4d4d'}} onClick={()=>{if(confirm('Emin misiniz?')){setUsers(p=>p.filter(x=>x.id!==currentUser.id));handleLogout();}}}>Hesap Sil</button>
               </div>
            </div>
          )}
        </aside>
      </div>

      {showProfile && currentUser && (
        <div className="modal-overlay" onClick={()=>setShowProfile(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'600px', maxHeight:'85vh'}}>
              <button className="modal-close-btn" onClick={()=>setShowProfile(false)}>✕</button>
              <div style={{display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'1.5rem'}}><div style={{width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg, #D4AF37, #FFDF73)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#111', fontSize:'1.5rem'}}>{currentUser.username[0].toUpperCase()}</div><div><div style={{fontWeight:700, fontSize:'1.2rem'}}>{currentUser.username}</div><div style={{color:'#D4AF37', fontSize:'0.85rem'}}>{currentUser.tier} • {currentUser.credits} Krediler</div></div></div>
              <div className="profile-tabs" style={{display:'flex', borderBottom:'1px solid #333', marginBottom:'1.5rem'}}>{(['info','history','daily'] as const).map(tab => (<button key={tab} className={profileTab===tab?'active':''} onClick={()=>setProfileTab(tab)} style={{flex:1, padding:'1rem', background:'transparent', border:'none', color:profileTab===tab?'#D4AF37':'#888'}}>{tab.toUpperCase()}</button>))}</div>
              <div className="tab-content" style={{maxHeight:'400px', overflowY:'auto'}}>
                {profileTab==='info' && <button className="btn-upload" style={{width:'100%', background:'#ff4d4d'}} onClick={handleLogout}>{t.logout}</button>}
                {profileTab==='history' && pastFortunes.filter(f=>f.username===currentUser.username).map(f=><div key={f.id} className="history-item" style={{padding:'1rem', borderBottom:'1px solid #222'}}>{f.date} - {f.fortune.slice(0,100)}...</div>)}
                {profileTab==='daily' && savedNotes.map(n=><div key={n.id} className="history-item" style={{display:'flex', justifyContent:'space-between', padding:'1rem'}}>{n.date}: {n.text} <button onClick={()=>setSavedNotes(p=>p.filter(x=>x.id!==n.id))} style={{background:'transparent', border:'none', color:'#D4AF37'}}>✕</button></div>)}
              </div>
           </div>
        </div>
      )}

      {showAuthModal && (
        <div className="modal-overlay" onClick={()=>setShowAuthModal(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'400px'}}>
              <h2 className="title-font" style={{textAlign:'center', color:'#D4AF37'}}>{authMode==='login'?t.loginBtn:t.registerBtn}</h2>
              <input className="nai-input" placeholder="User" value={authInp.user} onChange={e=>setAuthInp(p=>({...p,user:e.target.value}))} />
              <input className="nai-input" type="password" placeholder="Pass" value={authInp.pass} onChange={e=>setAuthInp(p=>({...p,pass:e.target.value}))} />
              {authError && <p style={{color:'#ff4d4d', textAlign:'center'}}>{authError}</p>}
              <button className="btn-upload" style={{width:'100%'}} onClick={handleAuth}>{authMode==='login'?t.loginBtn:t.registerBtn}</button>
              <p onClick={()=>setAuthMode(authMode==='login'?'register':'login')} style={{textAlign:'center', cursor:'pointer', color:'#D4AF37'}}>{authMode==='login'?'Hesap Aç':'Giriş Yap'}</p>
           </div>
        </div>
      )}

      {showPremium && (
        <div className="modal-overlay" onClick={()=>setShowPremium(false)}>
           <div className="fancy-modal store-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'800px'}}>
              <h2 className="title-font" style={{textAlign:'center', color:'#D4AF37', marginBottom:'2rem'}}>{t.storeTitle}</h2>
              <div className="premium-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem'}}>
                {[{n:'Standard',a:10,p:'$4.99',t:'premium'},{n:'Extra',a:50,p:'$19.99',t:'premium-extra'},{n:'Elite',a:999,p:'$49.99',t:'elite'}].map(pkg=>(
                  <div key={pkg.n} className="pkg-card" style={{padding:'2rem', background:'rgba(255,255,255,0.05)', borderRadius:'20px', textAlign:'center', border:'1px solid rgba(212,175,55,0.2)'}}>
                    <h3 className="title-font">{pkg.n}</h3><div style={{fontSize:'2rem', color:'#FFDF73'}}>{pkg.p}</div><button className="btn-upload" style={{width:'100%'}} onClick={()=>{ if(!currentUser)setShowAuthModal(true); else setPurchasingPkg({amount:pkg.a, tier:pkg.t, name:pkg.n}); }}>Satin Al</button>
                  </div>
                ))}
              </div>
              {purchasingPkg && (
                <div className="confirm-box" style={{marginTop:'2rem', padding:'1rem', border:'1px solid #D4AF37', borderRadius:'10px'}}>
                  <p style={{textAlign:'center'}}>{purchasingPkg.name} Onayla</p>
                  <input className="nai-input" type="password" placeholder="Şifreniz" value={purchasePassInput} onChange={e=>setPurchasePassInput(e.target.value)} />
                  <button className="btn-upload" style={{width:'100%'}} onClick={confirmPurchase}>Satin Al</button>
                </div>
              )}
           </div>
        </div>
      )}

      {showAdmin && (
        <div className="modal-overlay" onClick={()=>setShowAdmin(false)}>
           <div className="fancy-modal admin-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'900px', width:'90%'}}>
              {!isAdminUnlocked ? <div className="admin-lock" style={{textAlign:'center', padding:'4rem'}}>🛡️ <input className="nai-input" type="password" placeholder="010409" autoFocus onKeyDown={e=>{if(e.key==='Enter' && e.currentTarget.value==='010409'){setIsAdminUnlocked(true);addToast('Admin');}}} /></div> : 
              <>
                <div className="admin-tabs" style={{display:'flex', gap:'1rem', marginBottom:'1.5rem'}}>{(['users','fortunes','logs'] as const).map(tab=><button key={tab} className={adminTab===tab?'active':''} onClick={()=>setAdminTab(tab)} style={{flex:1, padding:'1rem', background:adminTab===tab?'#D4AF37':'#222'}}>{tab.toUpperCase()}</button>)}</div>
                <div className="admin-content" style={{maxHeight:'50vh', overflowY:'auto'}}>
                  {adminTab==='users' && users.map(u=><div key={u.id} className="admin-row" style={{display:'flex', justifyContent:'space-between', padding:'0.5rem', borderBottom:'1px solid #333'}}>{u.username} ({u.credits} CP) <div style={{display:'flex', gap:'0.5rem'}}><button onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,credits:x.credits+10}:x))}>+10</button><button onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))}>DEL</button></div></div>)}
                  {adminTab==='fortunes' && pastFortunes.map(f=><div key={f.id} style={{padding:'0.5rem', borderBottom:'1px solid #222'}}>{f.username}: {f.fortune.slice(0,50)}...</div>)}
                  {adminTab==='logs' && logs.map((l,i)=><div key={i} style={{fontSize:'12px', color:'#0f0', fontFamily:'monospace'}}>{l}</div>)}
                </div>
              </>}
           </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay" onClick={()=>setShowReviewModal(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'500px'}}>
              <h2 className="title-font" style={{color:'#D4AF37', textAlign:'center'}}>{t.writeReviewBtn}</h2>
              <textarea className="nai-input" style={{height:'100px'}} value={reviewInput.text} onChange={e=>setReviewInput(p=>({...p,text:e.target.value}))}></textarea>
              <div className="star-picker" style={{display:'flex', justifyContent:'center', gap:'0.5rem', margin:'1rem 0'}}>{[1,2,3,4,5].map(s=><button key={s} onClick={()=>setReviewInput(p=>({...p,stars:s}))} style={{fontSize:'2rem', background:'transparent', border:'none', color:reviewInput.stars>=s?'gold':'#444'}}>★</button>)}</div>
              <button className="btn-upload" style={{width:'100%'}} onClick={handleReviewSubmit}>Gonder</button>
           </div>
        </div>
      )}

      {showDailyNote && (
        <div className="modal-overlay" onClick={()=>setShowDailyNote(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'500px', textAlign:'center'}}>
              <h2 className="title-font" style={{color:'#D4AF37'}}>{t.dailyTitle}</h2>
              <div className="note-box" style={{padding:'2rem', background:'rgba(212,175,55,0.05)', borderRadius:'10px', margin:'1.5rem 0'}}><p>"{getDailyWhisper()}"</p></div>
              {currentUser && <button className="btn-upload" style={{width:'100%'}} onClick={()=>{saveDailyNote();setShowDailyNote(false);}}>{t.saveWhisper}</button>}
           </div>
        </div>
      )}

      {showGiftModal && (
        <div className="modal-overlay" onClick={()=>setShowGiftModal(false)}>
           <div className="fancy-modal gift-center-modal" onClick={e=>e.stopPropagation()}>
              <button className="modal-close-btn" onClick={()=>setShowGiftModal(false)}>✕</button>
              <div className="gift-header"><h2 className="title-font">{t.giftCenterTitle}</h2><div className="gift-tabs"><button className={giftTab==='wheel'?'active':''} onClick={()=>setGiftTab('wheel')}>🎡 {t.wheelTitle}</button><button className={giftTab==='cups'?'active':''} onClick={()=>setGiftTab('cups')}>✨ {t.cupTitle}</button></div></div>
              <div className="gift-content">
                {giftTab==='wheel' ? (
                  <div className="wheel-section">
                    <div className="wheel-container"><div className="wheel-pointer"></div><div className="wheel" style={{transform:`rotate(${wheelRotation}deg)`}}>{[1,2,3,4,5,6,7,8].map(i=>(<div key={i} className="wheel-segment" style={{transform:`rotate(${(i-1)*45}deg)`}}><span>{['5 CP','❌','10 CP','❌','15 CP','❌','ELITE','❌'][i-1]}</span></div>))}</div></div>
                    <div className="gift-controls">{giftMessage && <div className="gift-stat-msg" style={{margin:'1rem 0'}}>{giftMessage}</div>}<button className="btn-upload" onClick={handleSpin} disabled={isSpinning}>{isSpinning?'...':t.spinBtn}</button></div>
                  </div>
                ) : (
                  <div className="cups-section"><p className="gift-hint">{t.cupHint}</p><div className="cups-grid">{cupsFlipped.map((f,i)=>(<div key={i} className={`gift-card ${f?'flipped':''}`} onClick={()=>handleCupSelection(i)}><div className="card-inner"><div className="card-front">?</div><div className="card-back">⭐</div></div></div>))}</div>{giftMessage && <div className="gift-stat-msg" style={{marginTop:'1.5rem'}}>{giftMessage}</div>}</div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;

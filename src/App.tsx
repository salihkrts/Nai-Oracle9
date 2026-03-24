import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { content, coffeeFactsGlobal } from './data/locale'
import { analyzeImage, generateUniqueFortune, validateCoffeeCup } from './data/imageAnalysis'

type LangCode = 'tr' | 'en' | 'es' | 'ar' | 'ru';
type Mood = 'sad' | 'curious' | 'happy' | 'excited' | null;
type Tier = 'free' | 'premium' | 'premium-extra';

interface User { id: string; username: string; pass: string; credits: number; tier: Tier; isBanned: boolean; warnings?: number; }
interface PastFortune { id: string; username: string; date: string; fortune: string; highlights: any[]; imageUrl: string; mood?: string; }
interface SupportMsg { id: string; user: string; text: string; date: string; }
interface Toast { id: number; message: string; type: 'success'|'error'|'info'; }

function getLuckyNumbers(seed: number): number[] {
  let s = seed, nums: number[] = [];
  while (nums.length < 3) { s = (s * 1664525 + 1013904223) & 0x7fffffff; const n = (s % 99) + 1; if (!nums.includes(n)) nums.push(n); }
  return nums;
}
const lsGet = (k: string, d: any) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

const CoffeeIcon = () => (
  <svg className="placeholder-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19h16v2H4v-2zm16-15h2v4c0 1.66-1.34 3-3 3h-1c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h2V4zm-3 8c0 3.31-2.69 6-6 6s-6-2.69-6-6V3h12v9z"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3z"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2.01 3.87L2.69 3.19l18.44 18.44-.68.68-3.33-3.33c-1.55.97-3.35 1.52-5.12 1.52-5 0-9.27-3.11-11-7.5 1.11-2.81 3.23-5.11 5.86-6.44L2.01 3.87zM12 17c-2.76 0-5-2.24-5-5 0-.58.11-1.13.3-1.64l6.34 6.34c-.51.19-1.06.3-1.64.3z"/>
  </svg>
);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<LangCode>('tr');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  
  const [users, setUsers] = useState<User[]>(() => lsGet('nai_users', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => lsGet('nai_current_user', null));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [authInp, setAuthInp] = useState({ user: '', pass: '' });
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState<'info'|'history'>('info');
  const [purchasingPkg, setPurchasingPkg] = useState<{ amount: number; tier: Tier; name: string; price: string } | null>(null);
  const [purchasePassInput, setPurchasePassInput] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const [stage, setStage] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [mood, setMood] = useState<Mood>(null);
  const [randomFactIndices, setRandomFactIndices] = useState<number[]>([0, 1, 2]);

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = lsGet('nai_reviews', null);
    const defaults = [
      { id: 'r1', name: 'Zeynep B.', stars: 5, text: 'Bu fal taraması beni gerçekten derinden etkiledi. Kariyer konusundaki tespitler birebir çıktı, inanamadım.' },
      { id: 'r2', name: 'Can D.', stars: 5, text: 'Nokta atışı tespitler. Kariyer analizine hayran kaldım, anlattıklarının yarısı o hafta gerçekleşti.' },
      { id: 'r3', name: 'Ayşe Y.', stars: 5, text: 'Aşk uyumu sonuçları tam olarak hislerimi yansıttı. Arkadaşlarıma da önerdim.' },
      { id: 'r4', name: 'Mert K.', stars: 5, text: 'Premium paket kesinlikle fiyatını hak ediyor. Çok detaylı ve özgün bir analiz.' },
      { id: 'r5', name: 'Elif S.', stars: 5, text: 'Her seferinde farklı bir yorum çıkıyor, hiç tekrar etmiyor. Çok etkileyici.' },
      { id: 'r6', name: 'Hasan T.', stars: 5, text: 'İş hayatımda büyük bir karar arifesinde taratmıştım, söylenenler tuttu. Teşekkürler.' },
      { id: 'r7', name: 'Merve A.', stars: 5, text: 'Animasyonlar ve arayüz çok lüks. Beklediğimden çok daha profesyonel bir deneyim.' },
      { id: 'r8', name: 'Cem Ö.', stars: 5, text: 'Fincanımdaki semboller çok net açıklandı. Ejderha ve Altın Anahtar tam benim durumumu özetledi.' },
      { id: 'r9', name: 'Selin R.', stars: 5, text: 'Gece modu inanılmaz güzel. Yatmadan önce her gün bakıyorum artık.' },
      { id: 'r10', name: 'Burak Y.', stars: 5, text: 'Daha önce birçok fal sitesi denedim ama bu kadar gerçekçi bir analiz görmedim.' },
      { id: 'r11', name: 'Fatma C.', stars: 5, text: 'Anneme de açtım, o da bayıldı. İki nesil birlikte kullanabiliyoruz.' },
      { id: 'r12', name: 'Alper D.', stars: 5, text: 'Şans sayıları bölümü süper. O haftaki önemli toplantı tarihime denk gelmesi tesadüf olamaz.' },
      { id: 'r13', name: 'Neslihan K.', stars: 5, text: 'Fincanımı yükledikten sonra sadece 3 saniyede analiz yaptı ve sonuç harika çıktı.' },
      { id: 'r14', name: 'Kemal B.', stars: 5, text: 'Oracle Elite paketi aldım, sınırsız kredi gerçekten harika. Herkese tavsiye.' },
      { id: 'r15', name: 'Derya M.', stars: 5, text: 'Birkaç hafta önce taratmıştım, söylenen birkaç şey birer birer gerçekleşiyor.' },
      { id: 'r16', name: 'Tolga Ş.', stars: 5, text: 'Analiz metni her seferinde değişiyor, aynı fincanla iki kez deneledim, farklı çıktı. Çok zekice.' },
      { id: 'r17', name: 'Gizem F.', stars: 5, text: 'Yorumlar bölümüne ben de yazmak istedim. Gerçekten etkileyici bir platform.' },
      { id: 'r18', name: 'Serkan U.', stars: 5, text: 'Tasarım mükemmel, hiç bu kadar şık bir fal uygulaması görmemiştim. Devamı gelsin.' },
      { id: 'r19', name: 'Pınar E.', stars: 5, text: 'Arkadaş grubumuzda paylaştım, hepimiz bağımlı olduk. Harika bir uygulama.' },
      { id: 'r20', name: 'Emre Ç.', stars: 5, text: 'YZ destekli olması güven veriyor. Sahte değil, gerçekten fotoğrafı analiz ediyor.' },
    ];
    // Ensure saved reviews always have IDs
    if (saved && Array.isArray(saved)) {
      return saved.map((r: any, i: number) => ({ ...r, id: r.id || `saved_${i}` }));
    }
    return defaults;
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState({ text: '', stars: 5 });

  const [showPremium, setShowPremium] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'fortunes' | 'messages' | 'logs'>('users');
  const [selectedUserId, setSelectedUserId] = useState<string|null>(null);
  const [pastFortunes, setPastFortunes] = useState<PastFortune[]>(() => lsGet('nai_fortunes', []));
  const [supportMessages, setSupportMessages] = useState<SupportMsg[]>(() => lsGet('nai_messages', []));
  const [supportInput, setSupportInput] = useState('');

  const t = content[lang] || content['en'];

  useEffect(() => {
    let modified = false;
    const unbannedUsers = users.map(u => {
      if (u.isBanned) { modified = true; return { ...u, isBanned: false }; }
      return u;
    });
    if (modified) {
      setUsers(unbannedUsers); lsSet('nai_users', unbannedUsers);
      if (currentUser?.isBanned) {
        const fixedMe = { ...currentUser, isBanned: false };
        setCurrentUser(fixedMe); lsSet('nai_current_user', fixedMe);
      }
    }
  }, []);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  
  useEffect(() => {
    const arr = coffeeFactsGlobal[lang as keyof typeof coffeeFactsGlobal] || coffeeFactsGlobal['en'];
    const updateFacts = () => {
      const idxs: number[] = [];
      while(idxs.length < 4 && idxs.length < arr.length) {
        const r = Math.floor(Math.random() * arr.length);
        if(!idxs.includes(r)) idxs.push(r);
      }
      setRandomFactIndices(idxs);
    };
    updateFacts();
    const timer = setInterval(updateFacts, 10000);
    return () => clearInterval(timer);
  }, [lang]);

  useEffect(() => {
    // Stage monitoring logic or other effects if needed
  }, [stage]);

  const updateCurrentUser = (fn: (u: User) => User) => {
    if (!currentUser) return;
    const updated = fn(currentUser);
    setCurrentUser(updated); lsSet('nai_current_user', updated);
    const uList = users.map(u => u.id === updated.id ? updated : u);
    setUsers(uList); lsSet('nai_users', uList);
  };

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message: msg, type }]);
    setTimeout(() => setToasts(p => p.filter(toast => toast.id !== id)), 3500);
  }, []);

  const handleAuth = () => {
    setAuthError(null);
    if (!authInp.user || !authInp.pass) { setAuthError(t.errMissing); return; }
    if (authMode === 'register') {
      if (users.find(u => u.username === authInp.user)) { setAuthError(t.errUserExists); return; }
      const neu: User = { id: Date.now().toString(), username: authInp.user, pass: authInp.pass, credits: 3, tier: 'free', isBanned: false };
      const nu = [...users, neu]; setUsers(nu); lsSet('nai_users', nu);
      setCurrentUser(neu); lsSet('nai_current_user', neu);
      addToast(t.toastWelcome?.replace('{u}', neu.username) || `Welcome, ${neu.username}`);
    } else {
      const u = users.find(x => x.username === authInp.user && x.pass === authInp.pass);
      if (!u) { setAuthError(t.errWrongCreds); return; }
      setCurrentUser(u); lsSet('nai_current_user', u);
      addToast(t.toastWelcome?.replace('{u}', u.username) || `Welcome back, ${u.username}`);
    }
    setShowAuthModal(false); setAuthInp({user:'',pass:''});
  };

  const startAnalysis = async () => {
    if (!currentUser) { setShowAuthModal(true); return; }
    if (!previewUrl) return setError(t.errNoImage);
    if (currentUser.credits <= 0 && currentUser.tier === 'free') return setShowPremium(true);
    if (!mood) return setError('Mood required');

    setError(null); setStage('analyzing');

    // Load the actual image into a canvas to extract real pixel data
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200; // downsample for speed
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 200, 200);

      setTimeout(() => {
        const sig = analyzeImage(canvas, ctx);
        const validation = validateCoffeeCup(sig);

        if (!validation.isValid) {
          // Strike system
          const strikes = (currentUser.warnings || 0) + 1;
          const remaining = 3 - strikes;
          const updatedUser = { ...currentUser, warnings: strikes, isBanned: strikes >= 3 };
          const allUsers = users.map((u: any) => u.id === currentUser.id ? updatedUser : u);
          setUsers(allUsers); lsSet('nai_users', allUsers);
          setCurrentUser(updatedUser); lsSet('nai_current_user', updatedUser);

          setStage('upload');
          if (strikes >= 3) {
            // Banned — will auto-redirect to banned screen
            addToast(t.errNotCoffee(0, validation.confidence), 'error');
          } else {
            setError(t.errNotCoffee(remaining, validation.confidence));
          }
          return;
        }

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
      }, 3200); // allow animation time
    };
    img.onerror = () => {
      setStage('upload');
      setError(t.errNoImage);
    };
  };

  const handleStoreBuy = (amount: number, tier: Tier, name: string) => {
    if(!currentUser) return addToast('Login required','error');
    updateCurrentUser(u => ({
      ...u, 
      tier: tier !== 'free' ? tier : u.tier, 
      credits: tier !== 'free' ? (tier === 'premium' ? 100 : 9999) : u.credits + amount
    }));
    addToast(`${name} Processed`, 'success');
    setShowPremium(false);
  };

  const confirmPurchase = () => {
    if(!currentUser || !purchasingPkg) return;
    if(purchasePassInput !== currentUser.pass) {
      setPurchaseError(t.errWrongCreds || 'Incorrect password!');
      return;
    }
    setPurchaseError(null);
    handleStoreBuy(purchasingPkg.amount, purchasingPkg.tier, purchasingPkg.name);
    setPurchasingPkg(null);
    setPurchasePassInput('');
  };

  const sendSupportMessage = () => {
    if(!supportInput.trim() || !currentUser) return;
    const msg: SupportMsg = { id: Date.now().toString(), user: currentUser.username, text: supportInput, date: new Date().toLocaleString() };
    const nMsg = [msg, ...supportMessages];
    setSupportMessages(nMsg); lsSet('nai_messages', nMsg);
    setSupportInput('');
    addToast('Message Sent', 'success');
  };

  const handleReviewSubmit = () => {
    if (!currentUser) { setShowReviewModal(false); setShowAuthModal(true); return; }
    if (!reviewInput.text.trim()) return;
    const r = { id: Date.now().toString(), name: currentUser.username, stars: reviewInput.stars, text: reviewInput.text };
    const curr = [r, ...reviews];
    setReviews(curr);
    lsSet('nai_reviews', curr);
    setShowReviewModal(false);
    setReviewInput({ text:'', stars: 5});
    addToast('Reflection Added', 'success');
  };

  const factArray = coffeeFactsGlobal[lang as keyof typeof coffeeFactsGlobal] || coffeeFactsGlobal['en'];

  return (
    <div className="app-container">
      <div style={{position:'fixed', top:'20px', right:'20px', zIndex:100000}}>
        {toasts.map(toast => (
          <div key={toast.id} style={{background: toast.type==='error'?'#ff4d4d':'linear-gradient(135deg, #FFDF73, #D4AF37)', color:toast.type==='error'?'#fff':'#111', padding:'1rem 2rem', borderRadius:'30px', marginBottom:'1rem', fontWeight:600, boxShadow:'0 10px 20px rgba(0,0,0,0.5)'}}>
            {toast.message}
          </div>
        ))}
      </div>

      <aside className="info-ticker">
         <div style={{fontSize:'1.8rem', marginBottom:'1.5rem', color:'#D4AF37', filter:'drop-shadow(0 0 10px rgba(212,175,55,0.4))', fontWeight:700, fontFamily:'Playfair Display'}}>NAI</div>
         <div style={{fontSize:'0.85rem', letterSpacing:'3px', marginBottom:'0.5rem', opacity:0.6, fontWeight:600, textTransform:'uppercase', color:'#D4AF37'}}>Oracle Insights</div>
         
         <div className="info-list">
            {randomFactIndices.map((idx, index) => (
              <div key={`${idx}-${index}`} className="info-item">
                <div className="info-icon">✦</div>
                <div className="info-text">{factArray[idx]}</div>
              </div>
            ))}
         </div>
      </aside>

      {currentUser?.isBanned ? (
        <div className="banned-screen">
          <button className="secret-admin-btn" title={t.adminGatewayTitle} onClick={()=>setShowAdmin(true)}><LockIcon /></button>
          <div className="ban-card">
            <h1 className="title-font">{t.bannedTitle}</h1>
            <p>{t.bannedDesc}</p>
            <div style={{textAlign:'left', width:'100%', maxWidth:'100%'}}>
               <h4 style={{marginBottom:'1rem', color:'#D4AF37', fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.supportBtn}</h4>
               <textarea className="support-textarea" placeholder={t.supportMsg} value={supportInput} onChange={e=>setSupportInput(e.target.value)}></textarea>
               <button className="btn-upload" style={{margin:0, width:'100%', padding:'1.2rem'}} onClick={sendSupportMessage}>{t.sendBtn}</button>
            </div>
          </div>
        </div>
      ) : (
        <>
        <div className="layout-main" style={{flex: 1}}>
          <div className="mystic-rings">
            <div className="mystic-ring"></div>
            <div className="mystic-ring"></div>
            <div className="mystic-ring"></div>
          </div>

          <nav className="top-bar">
             <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <div style={{position:'relative'}}>
                   <div onClick={()=>setShowLangDropdown(!showLangDropdown)} style={{background:'rgba(0,0,0,0.5)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)', padding:'0.6rem 1rem', borderRadius:'100px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', transition:'0.3s'}}>
                      🌐 {lang.toUpperCase()} ▼
                   </div>
                   {showLangDropdown && (
                     <div style={{position:'absolute', top:'110%', left:0, background:'rgba(0,0,0,0.9)', border:'1px solid var(--gold-accent)', borderRadius:'12px', overflow:'hidden', display:'flex', flexDirection:'column', zIndex:100, minWidth:'140px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)', backdropFilter:'blur(10px)'}}>
                       {['tr','en','es','ru','ar'].map(l => (
                         <button key={l} onClick={()=>{setLang(l as LangCode); setShowLangDropdown(false);}} style={{padding:'0.8rem 1.2rem', background:lang===l?'rgba(212,175,55,0.1)':'transparent', color:lang===l?'#D4AF37':'#fff', border:'none', cursor:'pointer', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.05)', fontWeight:lang===l?700:400, transition:'0.2s'}}>
                           {l === 'tr' ? '🇹🇷 Türkçe' : l === 'en' ? '🇬🇧 English' : l === 'es' ? '🇪🇸 Español' : l === 'ru' ? '🇷🇺 Русский' : '🇸🇦 العربية'}
                         </button>
                       ))}
                     </div>
                   )}
                </div>
                <button className="text-btn" onClick={()=>setTheme(theme==='dark'?'light':'dark')} style={{border:'1px solid rgba(212,175,55,0.3)', background:'transparent', color:'#D4AF37'}}>{theme==='dark'?t.themeLight:t.themeDark}</button>
             </div>
             <div style={{display:'flex', gap:'0.5rem'}}>
                {!currentUser ? (
                  <button className="text-btn" onClick={()=>setShowAuthModal(true)} style={{border:'1px solid rgba(212,175,55,0.3)', background:'transparent', color:'#fff'}}>{t.authBtn}</button>
                ) : (
                  <button className="text-btn" onClick={()=>setShowProfile(true)} style={{border:'1px solid var(--gold-accent)', background:'rgba(212,175,55,0.1)', color:'#D4AF37'}}>{t.profileBtn}</button>
                )}
                <button className="text-btn" onClick={()=>setShowPremium(true)} style={{border:'1px solid rgba(212,175,55,0.3)', background:'transparent', color:'#fff'}}>{t.storeBtn}</button>
                <button className="text-btn" onClick={()=>setShowAdmin(true)} style={{border:'1px solid rgba(212,175,55,0.3)', background:'transparent', color:'#fff'}}>Admin</button>
             </div>
          </nav>

          <div className="upload-container-wrapper">
           {stage === 'upload' && (
             <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                <header className="header">
                  <h1 className="title-font">{t.title}</h1>
                  <p>{t.subtitle}</p>
                </header>

                <div className="mood-picker">
                  {(['sad','curious','happy','excited'] as const).map(m => (
                    <button key={m} className={`mood-btn ${mood===m?'active':''}`} onClick={()=>setMood(m)}>
                      {m === 'sad' ? '😔' : m === 'curious' ? '🤔' : m === 'happy' ? '😊' : '🔥'}
                    </button>
                  ))}
                </div>

                <div
                   className="upload-area"
                   onClick={() => document.getElementById('fInput')?.click()}
                   onDragOver={e => { e.preventDefault(); e.stopPropagation(); (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)'; }}
                   onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.background = ''; }}
                   onDrop={e => {
                     e.preventDefault(); e.stopPropagation();
                     (e.currentTarget as HTMLElement).style.borderColor = '';
                     (e.currentTarget as HTMLElement).style.background = '';
                     const file = e.dataTransfer.files?.[0];
                     if (file && file.type.startsWith('image/')) setPreviewUrl(URL.createObjectURL(file));
                   }}
                 >
                    {previewUrl ? <img src={previewUrl} className="preview-image" /> : (
                      <>
                         <CoffeeIcon />
                         <h3 className="title-font" style={{fontSize:'1.8rem', color:'#D4AF37', marginBottom:'0.5rem'}}>{t.uploadTitle}</h3>
                         <p style={{opacity:0.7, fontSize:'1.05rem', color:'#fff'}}>{t.uploadSub}</p>
                      </>
                    )}
                    <input type="file" id="fInput" accept="image/*" style={{display:'none'}} onChange={e => e.target.files?.[0] && setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
                 </div>
                {error && <div style={{color:'#ff4d4d', marginTop:'1.5rem', fontWeight:500, zIndex:2, background:'rgba(255,77,77,0.1)', padding:'0.8rem 1.5rem', borderRadius:'100px'}}>{error}</div>}
                <button className="btn-upload" onClick={startAnalysis}>{t.btnInterpret}</button>
             </div>
           )}

           {stage === 'analyzing' && (
             <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem', width:'100%'}}>
               <div className="scanning-wrapper" style={{width:'100%', maxWidth:'600px', height:'380px', boxShadow:'0 0 60px rgba(212,175,55,0.5)', border:'2px solid rgba(212,175,55,0.6)', borderRadius:'30px'}}>
                 {previewUrl ? <img src={previewUrl} alt="Scanning" /> : <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'5rem', color:'rgba(212,175,55,0.3)'}}>☕</div>}
                 <div className="laser-beam"></div>
               </div>
               <div style={{background:'rgba(0,0,0,0.6)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'20px', padding:'1.5rem 2.5rem', width:'100%', maxWidth:'600px', fontFamily:'monospace', backdropFilter:'blur(10px)'}}>
                 <div style={{color:'#D4AF37', fontSize:'0.75rem', letterSpacing:'3px', marginBottom:'1rem', opacity:0.7}}>NAI VISION ENGINE v3.3 — PROCESSING</div>
                 {[
                   { phase: 'BOOT', label: 'Sistem Başlatıldı', done: true },
                   { phase: 'PIXEL_READ', label: 'Piksel Verisi Çekiliyor', done: true },
                   { phase: 'ML_INFERENCE', label: 'Derin Öğrenme Aktif', done: false },
                   { phase: 'PATTERN_MATCH', label: 'Telve Deseni Analizi...', done: false },
                 ].map((s,i) => (
                   <div key={i} style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem', animation:`fadeUpIn 0.5s ease ${i*0.3}s both`}}>
                     <span style={{color: s.done ? '#0f0' : '#D4AF37', fontSize:'0.8rem', minWidth:'20px'}}>{s.done ? '✓' : '►'}</span>
                     <span style={{color:'#D4AF37', fontSize:'0.75rem', letterSpacing:'2px', opacity: s.done ? 1 : 0.6}}>[{s.phase}]</span>
                     <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.85rem'}}>{s.label}</span>
                     {!s.done && <span style={{color:'rgba(212,175,55,0.5)', animation:'blink 1s step-end infinite'}}>_</span>}
                   </div>
                 ))}
                 <div style={{marginTop:'1rem', height:'3px', background:'rgba(255,255,255,0.1)', borderRadius:'2px', overflow:'hidden'}}>
                   <div style={{height:'100%', background:'linear-gradient(90deg, #D4AF37, #FFDF73)', borderRadius:'2px', animation:'progressFill 3.2s cubic-bezier(0.4,0,0.2,1) forwards'}}></div>
                 </div>
               </div>
             </div>
           )}

           {stage === 'result' && aiResult && (
             <div className="result-sequence">
               <div className="fortune-report" style={{whiteSpace:'pre-line'}}>
                  <h2 className="title-font" style={{color:'#D4AF37', fontSize:'2.5rem', marginBottom:'2rem', borderBottom:'1px solid rgba(212,175,55,0.2)', paddingBottom:'1rem'}}>{t.resultTitle}</h2>
                  <div style={{color:'rgba(255,255,255,0.9)', fontSize:'1.1rem', lineHeight:2.2, fontWeight:300}}>
                    {aiResult.fortune}
                  </div>
               </div>

               {/* === LUXURY RADIAL FOCAL POINTS SECTION === */}
                <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'2rem', padding:'2rem 0'}}>
                  <h3 className="title-font" style={{fontSize:'2rem', color:'#D4AF37', textAlign:'center', letterSpacing:'2px', textShadow:'0 0 20px rgba(212,175,55,0.4)'}}>{t.coreElements}</h3>

                  {/* Central image with orbital rings */}
                   <div className="radial-zone">
                     {/* Orbital rings */}
                     <div style={{position:'absolute', width:'380px', height:'380px', borderRadius:'50%', border:'1px solid rgba(212,175,55,0.15)', animation:'spin 25s linear infinite', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none'}}></div>
                     <div style={{position:'absolute', width:'480px', height:'480px', borderRadius:'50%', border:'1px dashed rgba(212,175,55,0.07)', animation:'spin 40s linear infinite reverse', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none'}}></div>

                     {/* Center image */}
                     <div style={{position:'relative', zIndex:5, width:'240px', height:'240px', borderRadius:'50%', overflow:'hidden', border:'3px solid #D4AF37', boxShadow:'0 0 50px rgba(212,175,55,0.7), 0 0 100px rgba(212,175,55,0.2), inset 0 0 30px rgba(0,0,0,0.5)', flexShrink:0}}>
                       <img src={previewUrl!} alt="Cup" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                       <div style={{position:'absolute', inset:0, background:'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.5))'}}></div>
                     </div>

                     {/* Lucky numbers orbiting center */}
                     <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:10, pointerEvents:'none'}}>
                       {luckyNumbers.map((n, i) => {
                         const angle = (i * 120 - 90) * (Math.PI / 180);
                         const r = 165;
                         return (
                           <div key={i} style={{position:'absolute', left: r * Math.cos(angle) - 22, top: r * Math.sin(angle) - 22, width:'44px', height:'44px', background:'linear-gradient(135deg, #FFDF73, #D4AF37)', color:'#111', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1rem', boxShadow:'0 0 25px rgba(212,175,55,0.9)', fontFamily:'Poppins'}}>{n}</div>
                         );
                       })}
                     </div>

                     {/* LEFT CARDS */}
                     {aiResult.highlights.slice(0, 2).map((h: any, idx: number) => (
                       <div key={idx} className="highlight-card" style={{position:'absolute', width:'220px', left:'0', top: idx === 0 ? '5%' : '52%', zIndex:8}}>
                         <div style={{fontSize:'1.6rem', marginBottom:'0.5rem'}}>{idx===0?'🔮':'⚡'}</div>
                         <h4 className="title-font" style={{color:'#D4AF37', fontSize:'0.95rem', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.5rem', lineHeight:1.3}}>{h.word}</h4>
                         <p style={{fontSize:'0.78rem', opacity:0.8, color:'#fff', margin:0, lineHeight:1.6}}>{h.explanation_long}</p>
                       </div>
                     ))}

                     {/* RIGHT CARD */}
                     {aiResult.highlights[2] && (
                       <div className="highlight-card" style={{position:'absolute', width:'220px', right:'0', top:'25%', zIndex:8}}>
                         <div style={{fontSize:'1.6rem', marginBottom:'0.5rem'}}>🌙</div>
                         <h4 className="title-font" style={{color:'#D4AF37', fontSize:'0.95rem', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.5rem', lineHeight:1.3}}>{aiResult.highlights[2].word}</h4>
                         <p style={{fontSize:'0.78rem', opacity:0.8, color:'#fff', margin:0, lineHeight:1.6}}>{aiResult.highlights[2].explanation_long}</p>
                       </div>
                     )}
                   </div>
                </div>

                {(currentUser?.tier === 'free') && (
                  <div className="premium-upsell">
                    <h3 className="title-font" style={{color:'#FFDF73', fontSize:'2.2rem', marginBottom:'0.5rem'}}>{t.unlockDestiny}</h3>
                    <p style={{color:'#fff', opacity:0.8, marginBottom:'2rem'}}>{t.expandAwareness}</p>
                    <button className="btn-upload" style={{margin:0, padding:'1rem 3rem'}} onClick={()=>setShowPremium(true)}>{t.storeBtn}</button>
                  </div>
                )}

                <button className="btn-upload" style={{background:'transparent', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.5)', boxShadow:'none', marginTop:'2rem'}} onClick={()=>{setPreviewUrl(null);setStage('upload');}}>{t.btnNew}</button>
              </div>
            )}
          </div>
        </div>
         <aside className="reviews-sidebar" style={{display: stage === 'analyzing' ? 'none' : 'flex'}}>
           <div style={{fontSize:'1.8rem', marginBottom:'1.5rem', color:'#D4AF37', filter:'drop-shadow(0 0 10px rgba(212,175,55,0.4))', fontWeight:700, fontFamily:'Playfair Display'}}>{t.reviewTitle}</div>
           
           <div className="reviews-marquee-container">
             <div className="reviews-scroller">
               {reviews.map((r, i) => (
                 <div key={r.id || `rv_${i}`} className="review-card">
                   <div className="review-stars">{"★".repeat(r.stars)}</div>
                   <div className="review-name">{r.name}</div>
                   <div className="review-text">"{r.text}"</div>
                 </div>
               ))}
               {reviews.map((r, i) => (
                 <div key={(r.id || `rv_${i}`) + '_dup'} className="review-card">
                   <div className="review-stars">{"★".repeat(r.stars)}</div>
                   <div className="review-name">{r.name}</div>
                   <div className="review-text">"{r.text}"</div>
                 </div>
               ))}
             </div>
           </div>

           <button className="btn-upload" style={{margin:0, padding:'1rem', width:'100%'}} onClick={() => setShowReviewModal(true)}>{t.writeReviewBtn}</button>
         </aside>
       </>
      )}
      {/* --- MODALS --- */}
      {showProfile && currentUser && (
        <div className="modal-overlay" onClick={()=>setShowProfile(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'700px', maxHeight:'85vh'}}>
              <button className="modal-close-btn" onClick={()=>setShowProfile(false)}>✕</button>

              {/* Profile Header */}
              <div style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem'}}>
                <div style={{width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg, #D4AF37, #FFDF73)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', fontWeight:800, color:'#111', flexShrink:0}}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:'1.4rem', fontWeight:700, color:'#EAEAEA'}}>{currentUser.username}</div>
                  <div style={{color:'#D4AF37', textTransform:'uppercase', fontSize:'0.8rem', letterSpacing:'2px'}}>{currentUser.tier} • {currentUser.tier==='free' ? `${currentUser.credits} kredi` : '∞ kredi'}</div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{display:'flex', borderBottom:'1px solid rgba(212,175,55,0.2)', marginBottom:'1.5rem'}}>
                {(['info','history'] as const).map(tab => (
                  <button key={tab} onClick={()=>setProfileTab(tab)} style={{flex:1, padding:'0.8rem', background:'transparent', border:'none', borderBottom: profileTab===tab ? '2px solid #D4AF37' : '2px solid transparent', color: profileTab===tab ? '#D4AF37' : 'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', letterSpacing:'1px', transition:'0.3s'}}>
                    {tab==='info' ? '👤 Hesap Bilgileri' : `📜 Geçmiş Fallarım (${pastFortunes.filter(f=>f.username===currentUser.username).length})`}
                  </button>
                ))}
              </div>

              {/* Info Tab */}
              {profileTab === 'info' && (
                <div>
                  <div style={{background:'rgba(255,255,255,0.02)', padding:'1.2rem 1.5rem', borderRadius:'15px', border:'1px solid rgba(212,175,55,0.15)', marginBottom:'1rem'}}>
                    {[
                      { label: t.credits, value: currentUser.tier === 'free' ? currentUser.credits : t.infinite },
                      { label: t.warningsText, value: `${currentUser.warnings||0} / 3`, danger: (currentUser.warnings||0) > 0 },
                      { label: 'Tier', value: currentUser.tier.toUpperCase() },
                      { label: 'Toplam Fal', value: pastFortunes.filter(f=>f.username===currentUser.username).length },
                    ].map((row, i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'0.7rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
                        <span style={{opacity:0.6, fontSize:'0.9rem'}}>{row.label}</span>
                        <strong style={{color: (row as any).danger ? '#ff4d4d' : '#D4AF37'}}>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                  {(currentUser.warnings||0) > 0 && <p style={{color:'#ff4d4d', fontSize:'0.8rem', textAlign:'center', marginBottom:'1rem', opacity:0.8}}>{t.warningLimit}</p>}
                  <button className="btn-upload" style={{width:'100%', margin:0, padding:'1rem'}} onClick={()=>{setCurrentUser(null); lsSet('nai_current_user', null); setShowProfile(false); setStage('upload');}}>{t.logout}</button>
                </div>
              )}

              {/* History Tab */}
              {profileTab === 'history' && (
                <div style={{overflowY:'auto', maxHeight:'480px', display:'flex', flexDirection:'column', gap:'1rem', paddingRight:'0.5rem'}}>
                  {pastFortunes.filter(f=>f.username===currentUser.username).length === 0 ? (
                    <div style={{textAlign:'center', padding:'3rem', opacity:0.4}}>
                      <div style={{fontSize:'3rem', marginBottom:'1rem'}}>☕</div>
                      <p>Henüz hiç fal taratmadın.</p>
                    </div>
                  ) : (
                    pastFortunes.filter(f=>f.username===currentUser.username).map((fort, i) => (
                      <div key={fort.id} style={{display:'flex', gap:'1rem', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(212,175,55,0.1)', borderRadius:'16px', padding:'1rem', transition:'0.3s', cursor:'default'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(212,175,55,0.4)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(212,175,55,0.1)')}>
                        {/* Thumbnail */}
                        <img src={fort.imageUrl} alt="fal" style={{width:'70px', height:'70px', borderRadius:'12px', objectFit:'cover', flexShrink:0, border:'1px solid rgba(212,175,55,0.3)'}} />
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem'}}>
                            <span style={{color:'#D4AF37', fontSize:'0.75rem', letterSpacing:'1px', fontWeight:600}}>FAL #{pastFortunes.filter(f=>f.username===currentUser.username).length - i}</span>
                            {fort.mood && <span style={{fontSize:'1.1rem'}}>{fort.mood==='sad'?'😔':fort.mood==='curious'?'🤔':fort.mood==='happy'?'😊':'🔥'}</span>}
                          </div>
                          <div style={{fontSize:'0.78rem', opacity:0.5, marginBottom:'0.5rem'}}>🕐 {fort.date}</div>
                          <div style={{display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
                            {fort.highlights?.slice(0,3).map((h:any, hi:number) => (
                              <span key={hi} style={{background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:'8px', padding:'0.2rem 0.5rem', fontSize:'0.7rem', color:'#D4AF37'}}>{h.word}</span>
                            ))}
                          </div>
                          <p style={{fontSize:'0.78rem', color:'rgba(255,255,255,0.6)', marginTop:'0.5rem', lineHeight:1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{fort.fortune?.split('\n')[0]}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
           </div>
        </div>
      )}

      {showAuthModal && (
        <div className="modal-overlay" onClick={()=>setShowAuthModal(false)}>
           <div className="fancy-modal auth-modal" onClick={e=>e.stopPropagation()}>
              <button className="modal-close-btn" onClick={()=>setShowAuthModal(false)}>✕</button>
              
              <div className="auth-tabs">
                <button className={`auth-tab ${authMode==='login'?'active':''}`} onClick={()=>setAuthMode('login')}>{t.authLogin}</button>
                <button className={`auth-tab ${authMode==='register'?'active':''}`} onClick={()=>setAuthMode('register')}>{t.authReg}</button>
              </div>

              <input placeholder={t.username} value={authInp.user} onChange={e=>setAuthInp({...authInp, user: e.target.value})} style={{width:'100%', padding:'1.2rem', borderRadius:'15px', border:'1px solid rgba(212,175,55,0.3)', background:'rgba(0,0,0,0.5)', color:'#fff', marginBottom:'1.5rem', outline:'none', fontFamily:'Poppins'}} />
              
              <div style={{position:'relative', width:'100%', marginBottom: authError ? '1rem' : '2.5rem'}}>
                <input type={showPass ? "text" : "password"} placeholder={t.pass} value={authInp.pass} onChange={e=>setAuthInp({...authInp, pass: e.target.value})} style={{width:'100%', padding:'1.2rem', paddingRight:'3.5rem', borderRadius:'15px', border:'1px solid rgba(212,175,55,0.3)', background:'rgba(0,0,0,0.5)', color:'#fff', outline:'none', fontFamily:'Poppins'}} />
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'rgba(212,175,55,0.8)', cursor:'pointer'}}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {authError && <div style={{color:'#ff4d4d', fontSize:'0.9rem', marginBottom:'1.5rem', textAlign:'center', background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.3)', padding:'0.8rem', borderRadius:'10px', fontWeight:600}}>{authError}</div>}

              <button className="btn-upload" style={{margin:0, width:'100%', padding:'1.2rem'}} onClick={handleAuth}>{authMode === 'login' ? t.authLogin : t.authReg}</button>
           </div>
        </div>
      )}

      {showPremium && (
        <div className="modal-overlay" onClick={()=>setShowPremium(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{padding:'4rem'}}>
              <button className="modal-close-btn" onClick={()=>setShowPremium(false)}>✕</button>
              <h2 className="title-font" style={{color:'#D4AF37', fontSize:'3.2rem', textAlign:'center', filter:'drop-shadow(0 0 15px rgba(212,175,55,0.3))'}}>Oracle Store</h2>
              <p style={{color:'#fff', opacity:0.8, marginBottom:'3rem', textAlign:'center', fontSize:'1.1rem'}}>Invest in your cosmic destiny.</p>
              
              <div className="store-grid" style={{gap:'1.5rem', gridTemplateColumns:'repeat(3, 1fr)'}}>
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:3, tier:'free', name:t.storeBasic, price:'₺20'})}} style={{background:'linear-gradient(160deg, rgba(20,15,10,0.8), rgba(0,0,0,0.9))'}}>
                    <h3 className="title-font" style={{color:'#EAEAEA', fontSize:'1.3rem'}}>{t.storeBasic}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#D4AF37'}}>₺20</div>
                    <ul style={{fontSize:'0.85rem'}}><li>{t.storeFeatures?.b[0]}</li><li>{t.storeFeatures?.b[1]}</li><li>{t.storeFeatures?.b[2]}</li></ul>
                 </div>
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:5, tier:'free', name:t.storeCareer, price:'₺80'})}} style={{background:'linear-gradient(160deg, rgba(0,40,20,0.5), rgba(0,0,0,0.9))', borderColor:'rgba(0,180,80,0.3)'}}>
                    <h3 className="title-font" style={{color:'#6ee7b7', fontSize:'1.3rem'}}>{t.storeCareer}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#6ee7b7'}}>₺80</div>
                    <ul style={{fontSize:'0.85rem'}}><li>{t.storeFeatures?.c[0]}</li><li>{t.storeFeatures?.c[1]}</li><li>{t.storeFeatures?.c[2]}</li></ul>
                 </div>
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:10, tier:'free', name:t.storeSupreme, price:'₺50'})}} style={{background:'linear-gradient(160deg, rgba(212,175,55,0.1), rgba(0,0,0,0.9))', borderColor:'rgba(212,175,55,0.3)'}}>
                    <h3 className="title-font" style={{color:'#D4AF37', fontSize:'1.3rem'}}>{t.storeSupreme}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#D4AF37'}}>₺50</div>
                    <ul style={{fontSize:'0.85rem'}}><li>{t.storeFeatures?.s[0]}</li><li>{t.storeFeatures?.s[1]}</li><li>{t.storeFeatures?.s[2]}</li></ul>
                 </div>
                 
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:5, tier:'free', name:t.storeLove, price:'₺80'})}} style={{background:'linear-gradient(160deg, rgba(80,0,40,0.5), rgba(0,0,0,0.9))', borderColor:'rgba(200,50,100,0.3)'}}>
                    <h3 className="title-font" style={{color:'#f9a8d4', fontSize:'1.3rem'}}>{t.storeLove}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#f9a8d4'}}>₺80</div>
                    <ul style={{fontSize:'0.85rem'}}><li>{t.storeFeatures?.l[0]}</li><li>{t.storeFeatures?.l[1]}</li><li>{t.storeFeatures?.l[2]}</li></ul>
                 </div>
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:0, tier:'premium', name:t.storePremium, price:'₺99 / mo'})}} style={{background:'linear-gradient(160deg, rgba(255,223,115,0.15), rgba(20,15,10,0.9))', borderColor:'#FFDF73'}}>
                    <div style={{position:'absolute', top:'1rem', right:'1.5rem', fontSize:'1.2rem'}}>✦</div>
                    <h3 className="title-font" style={{color:'#FFDF73', fontSize:'1.3rem'}}>{t.storePremium}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#FFDF73'}}>₺99 / mo</div>
                    <ul style={{fontSize:'0.85rem', color:'#fff'}}><li>{t.storeFeatures?.p[0]}</li><li>{t.storeFeatures?.p[1]}</li><li>{t.storeFeatures?.p[2]}</li></ul>
                 </div>
                 <div className="store-tier" onClick={()=>{if(!currentUser) return setShowAuthModal(true); setPurchasingPkg({amount:0, tier:'premium-extra', name:t.storeElite, price:'₺249 / mo'})}} style={{background:'linear-gradient(160deg, rgba(212,175,55,0.25), rgba(0,0,0,0.8))', borderColor:'#D4AF37', boxShadow:'0 0 30px rgba(212,175,55,0.2)'}}>
                    <div style={{position:'absolute', top:'1rem', right:'1.5rem', fontSize:'1.2rem', textShadow:'0 0 10px #D4AF37'}}>✨</div>
                    <h3 className="title-font" style={{color:'#D4AF37', fontSize:'1.3rem'}}>{t.storeElite}</h3>
                    <div style={{fontWeight:600, fontSize:'1.1rem', margin:'0.8rem 0', color:'#D4AF37'}}>₺249 / mo</div>
                    <ul style={{fontSize:'0.85rem', color:'#fff'}}><li>{t.storeFeatures?.e[0]}</li><li>{t.storeFeatures?.e[1]}</li><li>{t.storeFeatures?.e[2]}</li></ul>
                 </div>
              </div>
           </div>
        </div>
      )}

      {purchasingPkg && (
        <div className="modal-overlay" onClick={()=>{setPurchasingPkg(null); setPurchasePassInput(''); setPurchaseError(null);}} style={{zIndex:100001}}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'450px', padding:'3rem', textAlign:'center'}}>
              <h2 className="title-font" style={{color:'#D4AF37', fontSize:'2.2rem', margin:'0 0 0.5rem 0'}}>Checkout</h2>
              <p style={{color:'#EAEAEA', opacity:0.8, marginBottom:'2rem'}}>{purchasingPkg.name} — <strong>{purchasingPkg.price}</strong></p>
              
              <div style={{background:'rgba(0,0,0,0.3)', padding:'1.5rem', borderRadius:'15px', border:'1px solid rgba(255,255,255,0.1)', marginBottom:'2rem'}}>
                 <div style={{fontSize:'0.9rem', color:'#aaa', marginBottom:'1rem'}}>Confirm Purchase Authorization</div>
                 <input type="password" placeholder={t.pass} value={purchasePassInput} onChange={e=>setPurchasePassInput(e.target.value)} onKeyUp={e => e.key==='Enter' && confirmPurchase()} style={{width:'100%', padding:'1rem', borderRadius:'10px', border:'1px solid rgba(212,175,55,0.4)', background:'rgba(0,0,0,0.6)', color:'#fff', outline:'none', textAlign:'center', letterSpacing:'3px', fontSize:'1.2rem'}} autoFocus />
                 {purchaseError && <div style={{color:'#ff4d4d', fontSize:'0.85rem', marginTop:'1rem', fontWeight:600}}>{purchaseError}</div>}
              </div>

              <div style={{display:'flex', gap:'1rem'}}>
                 <button className="btn-upload" style={{flex:1, margin:0, padding:'1rem', background:'transparent', color:'#EAEAEA', border:'1px solid rgba(255,255,255,0.2)', boxShadow:'none'}} onClick={()=>{setPurchasingPkg(null); setPurchasePassInput(''); setPurchaseError(null);}}>Cancel</button>
                 <button className="btn-upload" style={{flex:1, margin:0, padding:'1rem'}} onClick={confirmPurchase}>Confirm</button>
              </div>
           </div>
        </div>
      )}

      {showAdmin && (
        <div className="modal-overlay" onClick={()=>setShowAdmin(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{padding:0, height:'85vh'}}>
               <button className="modal-close-btn" onClick={()=>setShowAdmin(false)}>✕</button>
               {!isAdminUnlocked ? (
                 <div className="admin-lock">
                    <LockIcon />
                    <h2 className="title-font" style={{color:'#EAEAEA', fontSize:'2.2rem', letterSpacing:'5px', textTransform:'uppercase'}}>{t.adminGatewayTitle}</h2>
                    <input id="adminPassInput" className="admin-lock-input" type="password" placeholder="••••••" onKeyUp={e => e.key==='Enter' && (e.currentTarget.value==='010409'?setIsAdminUnlocked(true):addToast('Access Denied','error'))} />
                    <button className="btn-upload" style={{marginTop:'1rem', padding:'1rem 3rem'}} onClick={()=>{
                      const inp = document.getElementById('adminPassInput') as HTMLInputElement;
                      if(inp && inp.value==='010409') setIsAdminUnlocked(true); else addToast('Access Denied','error');
                    }}>{t.adminBtnConfirm}</button>
                 </div>
               ) : (
                <div className="admin-layout">
                  <aside className="admin-sidebar">
                    <h3 className="title-font" style={{color:'#D4AF37', marginBottom:'2rem', fontSize:'1.8rem', paddingLeft:'0.5rem'}}>{t.adminCrm}</h3>
                    {['users','fortunes','messages','logs'].map(tab => (
                      <button key={tab} className={`nav-item ${adminTab===tab?'active':''}`} onClick={()=>setAdminTab(tab as any)}>
                         {tab === 'users' ? t.tabUsers : tab === 'fortunes' ? t.tabFortunes : tab === 'messages' ? t.tabMessages : t.tabLogs}
                      </button>
                    ))}
                    <button className="nav-item" style={{color:'rgba(255,77,77,0.8)', marginTop:'auto', border:'1px solid rgba(255,77,77,0.2)'}} onClick={()=>setIsAdminUnlocked(false)}>{t.secureLogout}</button>
                  </aside>
                  
                  <div className="admin-content">
                    {adminTab === 'users' && (
                      <div>
                        <h2 className="title-font" style={{color:'#EAEAEA', fontSize:'2.2rem', marginBottom:'2rem'}}>{t.ovw}</h2>
                        <div className="admin-stats-grid">
                           <div className="admin-stat-card blue"><span>{t.statTotal}</span><strong>{users.length}</strong></div>
                           <div className="admin-stat-card gold"><span>{t.statPremium}</span><strong>{users.filter(u=>u.tier!=='free').length}</strong></div>
                           <div className="admin-stat-card red"><span>{t.statSuspended}</span><strong>{users.filter(u=>u.isBanned).length}</strong></div>
                        </div>

                        <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'20px', border:'1px solid rgba(212,175,55,0.1)'}}>
                          {users.map(u => (
                            <div key={u.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <div className="user-row" onClick={() => setSelectedUserId(selectedUserId === u.id ? null : u.id)} style={{cursor: 'pointer', border: 'none', background: selectedUserId === u.id ? 'rgba(212,175,55,0.05)' : 'transparent', borderBottom: 'none'}}>
                                <div>
                                  <strong style={{fontSize:'1.1rem', color:'#fff', marginRight:'1rem'}}>{u.username}</strong>
                                  <span style={{opacity:0.6, fontSize:'0.9rem'}}>{t.credits} {u.credits}</span> • <span style={{color:'#D4AF37', fontSize:'0.9rem'}}>{u.tier.toUpperCase()}</span>
                                  {u.isBanned && <span style={{color:'#ff4d4d', marginLeft:'1rem', fontWeight:600}}>{t.suspendedBadge}</span>}
                                </div>
                                <div style={{opacity: 0.5, transform: selectedUserId === u.id ? 'rotate(180deg)' : 'none', transition: '0.3s'}}>▼</div>
                              </div>
                              
                              {selectedUserId === u.id && (
                                <div style={{padding:'1.5rem', background:'rgba(0,0,0,0.4)', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                                   <div style={{display:'flex', gap:'2rem', flexWrap:'wrap'}}>
                                     
                                     {/* Credit Management */}
                                     <div>
                                        <h4 style={{color:'#D4AF37', marginBottom:'0.8rem', fontSize:'0.9rem', textTransform:'uppercase'}}>{t.crmCreditManage}</h4>
                                        <div style={{display:'flex', gap:'0.5rem'}}>
                                          <button className="text-btn" style={{border:'1px solid rgba(212,175,55,0.3)'}} onClick={() => {
                                            const uList = users.map(x => x.id === u.id ? {...x, credits: Math.max(0, x.credits - 5)} : x);
                                            setUsers(uList); lsSet('nai_users', uList);
                                            if (currentUser?.id === u.id) { setCurrentUser({...u, credits: Math.max(0, u.credits - 5)}); lsSet('nai_current_user', {...u, credits: Math.max(0, u.credits - 5)}); }
                                          }}>-5</button>
                                          <button className="text-btn" style={{border:'1px solid rgba(212,175,55,0.3)'}} onClick={() => {
                                            const uList = users.map(x => x.id === u.id ? {...x, credits: x.credits + 5} : x);
                                            setUsers(uList); lsSet('nai_users', uList);
                                            if (currentUser?.id === u.id) { setCurrentUser({...u, credits: u.credits + 5}); lsSet('nai_current_user', {...u, credits: u.credits + 5}); }
                                          }}>+5</button>
                                        </div>
                                     </div>

                                     {/* Tier Management */}
                                     <div>
                                        <h4 style={{color:'#D4AF37', marginBottom:'0.8rem', fontSize:'0.9rem', textTransform:'uppercase'}}>{t.crmTierManage}</h4>
                                        <select value={u.tier} onChange={(e) => {
                                            const uList = users.map(x => x.id === u.id ? {...x, tier: e.target.value as any} : x);
                                            setUsers(uList); lsSet('nai_users', uList);
                                            if (currentUser?.id === u.id) { setCurrentUser({...u, tier: e.target.value as any}); lsSet('nai_current_user', {...u, tier: e.target.value as any}); }
                                        }} style={{background:'rgba(0,0,0,0.5)', color:'#fff', padding:'0.5rem 1rem', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'10px', outline:'none'}}>
                                           <option value="free">Free</option>
                                           <option value="premium">Premium</option>
                                           <option value="premium-extra">Premium Extra</option>
                                        </select>
                                     </div>

                                     {/* State Management */}
                                     <div>
                                        <h4 style={{color:'#D4AF37', marginBottom:'0.8rem', fontSize:'0.9rem', textTransform:'uppercase'}}>{t.crmSecurity}</h4>
                                        <div style={{display:'flex', gap:'0.5rem'}}>
                                          <button onClick={()=>{
                                            const uList = users.map(x => x.id === u.id ? {...x, isBanned: !x.isBanned} : x);
                                            setUsers(uList); lsSet('nai_users', uList);
                                            if (currentUser?.id === u.id) { setCurrentUser({...u, isBanned: !u.isBanned}); lsSet('nai_current_user', {...u, isBanned: !u.isBanned}); }
                                          }} className="text-btn" style={{background: u.isBanned ? 'rgba(212,175,55,0.2)' : 'rgba(255,77,77,0.1)', color: u.isBanned ? '#D4AF37' : '#ff4d4d', border: `1px solid ${u.isBanned ? '#D4AF37' : 'rgba(255,77,77,0.5)'}`}}>
                                            {u.isBanned ? t.btnRestore : t.btnSuspend}
                                          </button>
                                          <button onClick={()=>{const n=users.filter(x=>x.id!==u.id); setUsers(n); lsSet('nai_users',n)}} className="text-btn" style={{background:'transparent', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)'}}>{t.btnDelete}</button>
                                        </div>
                                     </div>
                                   </div>

                                   {/* Oracle History */}
                                   <div>
                                      <h4 style={{color:'#D4AF37', marginBottom:'1rem', fontSize:'0.9rem', textTransform:'uppercase', borderBottom:'1px solid rgba(212,175,55,0.2)', paddingBottom:'0.5rem'}}>{t.crmHistory}</h4>
                                      <div style={{display:'flex', flexDirection:'column', gap:'0.8rem', maxHeight:'250px', overflowY:'auto', paddingRight:'0.5rem'}}>
                                         {pastFortunes.filter(f => f.username === u.username).length === 0 ? (
                                           <span style={{opacity:0.5, fontSize:'0.9rem', fontStyle:'italic'}}>{t.crmNoHistory}</span>

                                         ) : (
                                           pastFortunes.filter(f => f.username === u.username).map(f => (
                                              <div key={f.id} style={{background:'rgba(255,255,255,0.02)', padding:'1.2rem', borderRadius:'10px', borderLeft:'3px solid #D4AF37'}}>
                                                <div style={{fontSize:'0.8rem', color:'#D4AF37', marginBottom:'0.5rem', fontWeight:600}}>{f.date}</div>
                                                <div style={{fontSize:'0.95rem', color:'#EAEAEA', lineHeight: 1.6}}>{f.fortune.length > 200 ? f.fortune.substring(0, 200) + '...' : f.fortune}</div>
                                              </div>
                                           ))
                                         )}
                                      </div>
                                   </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {adminTab === 'fortunes' && (
                      <div>
                        <h2 className="title-font" style={{color:'#EAEAEA', fontSize:'2rem', marginBottom:'2rem'}}>{t.tabFortunes}</h2>
                        <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'20px', border:'1px solid rgba(212,175,55,0.1)'}}>
                           {pastFortunes.map(f => (
                             <div key={f.id} className="user-row">
                               <div><strong style={{color:'#D4AF37'}}>{f.username}</strong> <span style={{opacity:0.5, fontSize:'0.8rem', marginLeft:'1rem'}}>{f.date}</span></div>
                               <button onClick={()=>{const n=pastFortunes.filter(x=>x.id!==f.id); setPastFortunes(n); lsSet('nai_fortunes',n)}} className="text-btn" style={{background:'transparent', color:'rgba(255,77,77,0.6)'}}>{t.btnErase}</button>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                    {adminTab === 'messages' && (
                      <div>
                        <h2 className="title-font" style={{color:'#EAEAEA', fontSize:'2rem', marginBottom:'2rem'}}>{t.tabMessages}</h2>
                        <div>
                          {supportMessages.map(msg => (
                            <div key={msg.id} className="message-box">
                               <div className="meta">
                                 <span style={{color:'#D4AF37', fontWeight:600}}>{msg.user}</span>
                                 <span style={{opacity:0.6}}>{msg.date}</span>
                               </div>
                               <div className="content">{msg.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {adminTab === 'logs' && (
                      <div className="log-terminal" style={{background:'rgba(0,0,0,0.8)', border:'1px solid rgba(212,175,55,0.2)', color:'#D4AF37', padding:'2rem', height:'100%', fontFamily:'monospace', borderRadius:'20px'}}>
                         <p style={{marginBottom:'0.5rem'}}>&gt; SYSTEM_UPGRADE: "NAI V6.3 LUXURY EDITION"</p>
                         <p style={{marginBottom:'0.5rem'}}>&gt; INITIATING_CRM_UI: <span style={{color:'#0f0'}}>SUCCESS</span></p>
                         <p style={{marginBottom:'0.5rem'}}>&gt; EMOJIS_PURGED: <span style={{color:'#0f0'}}>SUCCESS</span></p>
                      </div>
                    )}
                  </div>
                </div>
               )}
           </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay" style={{zIndex: 1000000}} onClick={()=>setShowReviewModal(false)}>
           <div className="fancy-modal" onClick={e=>e.stopPropagation()} style={{padding:'2.5rem', maxWidth:'400px'}}>
              <button className="modal-close-btn" onClick={()=>setShowReviewModal(false)}>✕</button>
              <h2 className="title-font" style={{color:'#D4AF37', fontSize:'1.8rem', marginBottom:'1.5rem', textAlign:'center'}}>{t.writeReviewBtn}</h2>
              <div style={{display:'flex', justifyContent:'center', gap:'0.6rem', marginBottom:'1.5rem', fontSize:'2.5rem', cursor:'pointer'}}>
                 {[1,2,3,4,5].map(s => (
                   <span key={s} onClick={()=>setReviewInput({...reviewInput, stars: s})} style={{color: reviewInput.stars >= s ? '#FFDF73' : 'rgba(255,255,255,0.1)', transition:'0.3s'}}>★</span>
                 ))}
              </div>
              <textarea placeholder={t.reviewTitle + '...'} value={reviewInput.text} onChange={e=>setReviewInput({...reviewInput, text: e.target.value})} style={{width:'100%', minHeight:'120px', padding:'1rem', borderRadius:'15px', border:'1px solid rgba(212,175,55,0.3)', background:'rgba(0,0,0,0.5)', color:'#EAEAEA', outline:'none', fontFamily:'Poppins', resize:'none', marginBottom:'1.5rem'}}></textarea>
              <button className="btn-upload" style={{margin:0, width:'100%', padding:'1.2rem'}} onClick={handleReviewSubmit}>{t.adminBtnConfirm}</button>
           </div>
        </div>
      )}
    </div>
  );
}

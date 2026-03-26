// Dev Image Analysis Engine V3.3 - High-precision pixel density & pattern recognition
export interface ImageSignature {
  topLeftBrightness: number; topRightBrightness: number;
  bottomLeftBrightness: number; bottomRightBrightness: number;
  centerDensity: number; edgeContrast: number;
  warmScore: number; darkScore: number;
  textureScore: number; circularityScore: number;
  entropy: number; seed: number;
}

export function analyzeImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): ImageSignature {
  const w = canvas.width, h = canvas.height;
  const data = ctx.getImageData(0, 0, w, h).data;
  const total = w * h;

  let tl=0, tr=0, bl=0, br=0, center=0, circleFit=0;
  let warm=0, dark=0, variance=0, prevLum=0, edgeContrast=0, entropy=0;
  let seed = 0;

  const cx = w/2, cy = h/2, maxR = Math.min(w,h)/2;
  const halfW = w/2, halfH = h/2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      const lum = 0.299*r + 0.587*g + 0.114*b;
      
      seed = (seed * 31 + r*3 + g*7 + b*11) & 0xFFFFFF;
      
      if (x < halfW && y < halfH) tl += lum;
      else if (x >= halfW && y < halfH) tr += lum;
      else if (x < halfW && y >= halfH) bl += lum;
      else br += lum;

      const dx = x - cx, dy = y - cy, dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxR * 0.4) center += lum;
      if (lum < 75 && dist > maxR * 0.4 && dist < maxR * 0.85) circleFit++;

      if (r > g + 20 && r > b + 15) warm++;
      if (lum < 55) dark++;

      entropy += Math.abs(lum - (data[i-4]||0)); // Simple local entropy check
      variance += Math.abs(lum - 128);
      edgeContrast += Math.abs(lum - prevLum);
      prevLum = lum;
    }
  }

  return {
    topLeftBrightness: tl/(total/4)/255, topRightBrightness: tr/(total/4)/255,
    bottomLeftBrightness: bl/(total/4)/255, bottomRightBrightness: br/(total/4)/255,
    centerDensity: center/(Math.PI*(maxR*0.4)**2)/255, edgeContrast: edgeContrast/total/255,
    warmScore: warm/total, darkScore: dark/total, textureScore: variance/total/128,
    circularityScore: circleFit/total, entropy: entropy/total/255, seed: seed
  };
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233) * 1000;
  return x - Math.floor(x);
}

export function validateCoffeeCup(sig: ImageSignature): { isValid: boolean; confidence: number; reason: string } {
  // === VISION ENGINE V4.0 — RIGOROUS MULTI-CRITERIA COFFEE CUP DETECTION ===
  
  // A. MANDATORY "POISON PILL" REJECTIONS (If these fail, it's NOT coffee)
  
  // 1. Mandatory Darkness (Coffee grounds MUST be present and dark)
  if (sig.darkScore < 0.18) {
    return { isValid: false, confidence: 15, reason: 'YETERLİ_KARANLIK_YOK (Fincan boş veya çok parlak)' };
  }

  // 2. Mandatory Form (Must have at least a hint of a circular rim)
  if (sig.circularityScore < 0.035) {
    return { isValid: false, confidence: 20, reason: 'DAİRESEL_YAPI_ELENDİ (Fincan formu tespit edilemedi)' };
  }

  // 3. Mandatory Brightness Cap (Reject overexposed or white surfaces)
  const avgBright = (sig.topLeftBrightness + sig.topRightBrightness + sig.bottomLeftBrightness + sig.bottomRightBrightness) / 4;
  if (avgBright > 0.75) {
     return { isValid: false, confidence: 10, reason: 'AŞIRI_PARLAK_YÜZEY (Kağıt veya boş ekran olabilir)' };
  }

  // B. SCORING CRITERIA (Stricter thresholds for V4.0)
  
  const isDarkEnough = sig.darkScore > 0.35;        // Grounds should cover significant area
  const hasCircularForm = sig.circularityScore > 0.12; // Strong rim detection
  const hasTexture = sig.textureScore > 0.45;        // Grounds must be complex/grainy
  const hasContrast = sig.edgeContrast > 0.06;       // Sharp transition between cup and grounds
  const hasWarmTones = sig.warmScore > 0.08;         // Brown/Amber tones presence
  const hasCenterDensity = sig.centerDensity > 0.45;  // Core should be coffee-dense
  const hasEntropy = sig.entropy > 0.12;             // High local complexity

  // Calculate weighted score
  const criteria = [isDarkEnough, hasCircularForm, hasTexture, hasContrast, hasWarmTones, hasCenterDensity, hasEntropy];
  const passedCount = criteria.filter(Boolean).length;
  const confidence = Math.round((passedCount / criteria.length) * 100);

  // Must pass at least 5 out of 7 criteria in V4.0
  if (passedCount < 5) {
    const reasons = [
      !isDarkEnough ? 'KARANLIK_SEVİYESİ_DÜŞÜK' : null,
      !hasCircularForm ? 'DAİRESEL_FORM_YETERSİZ' : null,
      !hasTexture ? 'DOKU_DETAYI_YOK' : null,
      !hasContrast ? 'KONTRAST_ZAYIF' : null,
      !hasWarmTones ? 'RENK_TONU_UYUMSUZ' : null,
      !hasCenterDensity ? 'MERKEZ_YOĞUNLUĞU_DÜŞÜK' : null,
      !hasEntropy ? 'KARMAŞIKLIK_DÜŞÜK' : null,
    ].filter(Boolean).join(', ');
    
    return { isValid: false, confidence: Math.max(confidence, 25), reason: reasons };
  }

  // Final verification score boost for very clear matches
  const finalConf = Math.min(99, 88 + Math.floor(seededRandom(sig.seed, 11) * 11));
  return { isValid: true, confidence: finalConf, reason: 'V4.0_SAĞLIKLI_TARAMA_TAMAMLANDI' };
}

export function generateUniqueFortune(sig: ImageSignature, lang: string, timeSalt: number = 0): { fortune: string; highlights: any[] } {
  // Mix image seed with current time so every reading is unique
  const s = (sig.seed ^ timeSalt) >>> 0;
  const rng = (i: number) => seededRandom(s, i);

  const symMap: Record<string, any[]> = {
    tr: [
      { id: 'eagle', word: 'Kartal', short: 'yüksek vizyon ve güç', desc: 'Fincanın zirvesinde beliren bu keskin silüet, rakiplerinden zekice sıyrılıp parlayacağın mutlak bir zaferi müjdeliyor. Görüş açın çok netleşecek, fırsatları daha önce hiç olmadığı kadar net göreceksin.' },
      { id: 'dragon', word: 'Ejderha', short: 'bastırılmış tutku', desc: 'İçindeki uyuyan dev uyanıyor. Uzun süredir ertelediğin büyük bir enerji patlamasıyla hem kariyer dengeni hem de sosyal çevreni derinden sarsacak bir değişime giriyorsun.' },
      { id: 'bridge', word: 'Köprü', short: 'kadersel geçiş', desc: 'İki farklı karar arasında kuracağın o altın bağ telvelerde adeta parlıyor. Eski bir kırgınlığın onarılacağı veya büyük bir uzlaşmanın kapıda olduğu açıkça görülüyor.' },
      { id: 'key', word: 'Altın Anahtar', short: 'mutlak çözüm', desc: 'Aşılması imkansız görünen o büyük kapının anahtarı, hiç beklemediğin bir insanın ağzından çıkacak basit bir cümleyle tamamen eline geçmek üzere. Dikkatli dinle.' },
      { id: 'phoenix', word: 'Anka', short: 'yeniden doğuş', desc: 'Geçmişin tozlarını ve pişmanlıklarını kesin olarak silkeleme vakti. Kendi hatalarından öğrenip küllerinden çok daha güçlü ve asil bir versiyonunla ayağa kalkıyorsun.' },
      { id: 'lighthouse', word: 'Deniz Feneri', short: 'rehberlik ve umut', desc: 'Duygusal veya finansal fırtınalarda kaybolduğunu hissettiğin bu evrede, sana rotanı gösterecek bilge ve sakin bir kişi aniden hayatına giriş yapacak.' },
      { id: 'rose', word: 'Gül', short: 'tutkulu aşk ve zarafet', desc: 'Telvedeki bu zarif kıvrım, kalbini tamamen sarıp sarmalayacak beklenmedik ve derin bir aşkın ya da köklü bir ilişkinin yeniden çiçekleneceğinin habercisi.' },
      { id: 'crown', word: 'Taç', short: 'liderlik ve saygınlık', desc: 'Uzun zamandır hak ettiğin o tanınmayı ve liderlik konumunu nihayet alacaksın. Çevrende seni takdir edecek önemli isimler beliriyor.' },
      { id: 'anchor', word: 'Çıpa', short: 'istikrar ve güven', desc: 'Halanın kökleri derinlere uzanıyor. Hayatındaki dalgalanmalar yerini sağlam, kalıcı bir istikrara bırakacak; beklediğin güvenli limana yaklaşıyorsun.' },
      { id: 'moon', word: 'Hilal', short: 'gizem ve sezgi', desc: 'Sezgilerin şu an olağanüstü güçlü. Açgözlülükten uzak tut kendini, içgüdülerine güven; yakında sıradan insanın göremediği bir gerçeği sen açıkça göreceksin.' },
      { id: 'star', word: 'Yıldız', short: 'şans ve ilahi yönlenme', desc: 'Evren seni aktif olarak yönlendiriyor. Gelecek haftalarda birden fazla alanda eş zamanlı kapı açılacak; bu fırsatların hiçbirini kaçırma.' },
      { id: 'fish', word: 'Balık', short: 'bereket ve bolluk', desc: 'Fincanın alt bölgesindeki bu desen, maddi skıntıların sona erdiğini ve hem finansal hem de duygusal bir bereket döneminin kapıda olduğunu gösteriyor.' },
      { id: 'wolf', word: 'Kurt', short: 'korunma ve içgüdü', desc: 'Bir tehlikeyi ya da sahte bir yüzü sezinliyorsun; içgüdülerini dinle. Yakın çevrende seni kıskanan biri var ama senin farkındalığın onların planlarını boşa çıkaracak.' },
      { id: 'butterfly', word: 'Kelebek', short: 'dönüşüm ve özgürlük', desc: 'Tırtıl evreni sona erdi, artık kanatlanma zamanı. Seni kısıtlayan o örtük alışkanlıklar ve korkular hızla eriyip gidecek, yerine uçuş özgürlüğü gelecek.' },
      { id: 'mountain', word: 'Dağ', short: 'azim ve zekice strateji', desc: 'Önündeki engel görünenden küçük. Acelecilikten vazgeç, sabırlı ve stratejik adımlarla ilerle; zirveye az kaldı ve manzara o perspektiften çok farklı görünüyor.' },
      { id: 'flame', word: 'Alev', short: 'tutku ve kararlılık', desc: 'İçindeki o alev son derece güçlü ve kontrollü yanıyor. Bu tutkuyu doğru bir hedefe yönlendirdiğinde, etrafındaki her şeyi aydınlatacak ve insanları sana doğru çekeceksin.' },
      { id: 'ring', word: 'Halka', short: 'sonsuzluk ve taahhüt', desc: 'Önemli bir söz ya da bağlılık kısa süre içinde şekillenecek. Duygusal ya da mesleki planda derin ve kalıcı bir bağ kurulacak; bu ilişki hayatının seyrini değiştirecek.' },
      { id: 'serpent', word: 'Yılan', short: 'dönüşüm ve içgüdüsel bilgelik', desc: 'Yılan deri değiştirir; sen de şu an köklü bir dönüşüm içindesin. Eski inanç sistemlerin ya da seni durduran bir düşünce kalıbı son bulacak, yerine taze ve keskin bir bilinç gelecek.' },
    ],
    en: [
      { id: 'eagle', word: 'Eagle', short: 'high vision and power', desc: 'This sharp silhouette at the peak suggests a victory where you outshine rivals with pure intellect. Your perspective will soon clear entirely.' },
      { id: 'dragon', word: 'Dragon', short: 'suppressed passion', desc: 'The sleeping giant within is waking. You will transform your career and social circles through a massive burst of delayed energy.' },
      { id: 'bridge', word: 'Bridge', short: 'destined transition', desc: 'You will build a golden link between two seemingly impossible choices. Expect an old grudge to heal or a massive reconciliation.' },
      { id: 'key', word: 'Golden Key', short: 'absolute solution', desc: 'The key to that supposedly impossible door will soon be in your hands via a simple sentence from an unexpected person.' },
      { id: 'rose', word: 'Rose', short: 'passionate love', desc: 'This elegant swirl heralds an unexpected and deep connection or the rekindling of an existing relationship.' },
      { id: 'crown', word: 'Crown', short: 'leadership and recognition', desc: 'The recognition you have long deserved is approaching. Important figures are beginning to notice your steady excellence.' },
      { id: 'moon', word: 'Crescent', short: 'intuition and mystery', desc: 'Your intuition is extraordinarily strong right now. Trust your instincts; you will soon perceive a truth others cannot see.' },
      { id: 'star', word: 'Star', short: 'luck and divine guidance', desc: 'The universe is actively guiding you. Multiple doors will open simultaneously in the coming weeks.' },
      { id: 'wolf', word: 'Wolf', short: 'protection and instinct', desc: 'You sense a threat or a false face nearby. Your awareness will dismantle their plans entirely.' },
      { id: 'butterfly', word: 'Butterfly', short: 'transformation and freedom', desc: 'Your transformation phase is complete. Habits and fears that constrained you will dissolve rapidly.' },
    ],
    es: [
      { id: 'eagle', word: 'Águila', short: 'visión y poder', desc: 'Esta silueta afilada sugiere una victoria donde superarás a tus rivales con inteligencia pura.' },
      { id: 'dragon', word: 'Dragón', short: 'pasión', desc: 'El gigante dormido despierta. Transformarás tu carrera con un estallido masivo de energía.' },
      { id: 'bridge', word: 'Puente', short: 'transición', desc: 'Construirás un enlace dorado. Espera una reconciliación profunda.' },
      { id: 'rose', word: 'Rosa', short: 'amor apasionado', desc: 'Esta curva elegante presagia una conexión profunda e inesperada.' },
      { id: 'star', word: 'Estrella', short: 'suerte divina', desc: 'El universo te guía activamente. Varias puertas se abrirán pronto.' },
    ],
    ru: [
      { id: 'eagle', word: 'Орел', short: 'Сила и видение', desc: 'Этот силуэт предвещает победу над соперниками с помощью чистого интеллекта.' },
      { id: 'dragon', word: 'Дракон', short: 'Скрытая страсть', desc: 'Спящий гигант просыпается. Вы трансформируете карьеру и окружение.' },
      { id: 'moon', word: 'Полумесяц', short: 'Интуиция и тайна', desc: 'Ваша интуиция невероятно сильна. Вы скоро увидите истину, скрытую от других.' },
      { id: 'star', word: 'Звезда', short: 'Удача', desc: 'Вселенная активно направляет вас. Несколько дверей откроются одновременно.' },
      { id: 'wolf', word: 'Волк', short: 'Защита', desc: 'Ваша осознанность разрушит чужие планы против вас.' },
    ],
    ar: [
      { id: 'eagle', word: 'نسر', short: 'رؤية عالية', desc: 'يشير هذا الظل إلى انتصار تتفوق فيه على المنافسين بذكاء.' },
      { id: 'moon', word: 'هلال', short: 'حدس وغموض', desc: 'حدسك قوي للغاية الآن. ستدرك حقيقة لا يراها الآخرون.' },
      { id: 'rose', word: 'وردة', short: 'حب عميق', desc: 'هذا المنحنى الرشيق ينذر بارتباط عاطفي عميق وغير متوقع.' },
      { id: 'star', word: 'نجمة', short: 'توجيه إلهي', desc: 'الكون يوجهك بنشاط. ستُفتح عدة أبواب في الوقت ذاته.' },
    ]
  };

  const pool = symMap[lang] || symMap['tr'];

  // Pick 3 non-overlapping random symbols using time-salted rng
  const usedIdx = new Set<number>();
  const pick = (offset: number) => {
    let idx = Math.floor(rng(offset) * pool.length);
    while (usedIdx.has(idx)) idx = (idx + 1) % pool.length;
    usedIdx.add(idx);
    return pool[idx];
  };
  const L = pick(1), R1 = pick(2), R2 = pick(3);

  const brightness = (sig.topLeftBrightness + sig.topRightBrightness + sig.bottomLeftBrightness + sig.bottomRightBrightness) / 4;
  const isLight = brightness > 0.48;
  const isDense = sig.darkScore > 0.14;
  const isChaos = sig.entropy > 0.1;

  // Multiple intro templates — pick one with rng
  const introTemplates = [
    `Fincanın derinliklerine kazınmış olan doku entropisi (${Math.round(sig.entropy*1000)} rezonans birimi), hayatında ${isChaos ? 'oldukça hızlı ve öngörülemez bir değişim' : 'dingin ama köklerinden sarsacak derin bir dönüşüm'} akışının fiilen başladığını gösteriyor. ${isLight ? 'Auran şu an olağanüstü parlak; bir çekim merkezi haline geliyorsun.' : 'Enerji içe dönmüş ve yoğunlaşmış; bu büyük bir sıçrayış öncesi evrenin seni hazırlamasıdır.'} Telvenin sol köşesindeki ${L.word} figürü, ${L.short} enerjisini doğrudan bugününe yansıtıyor.`,
    `NAI Oracle sistemi fincanında toplam ${Math.round(sig.entropy*1000 + rng(50)*200)} nokta bazlı desen analiz etti. ${isChaos ? 'Kaotik ve dinamik bir enerji akışı' : 'Sessiz ve stratejik bir güç birikimi'} tespit edildi. ${isLight ? 'Aurik frekansın yüksek; dışarıdan enerji çekiyorsun.' : 'Derinlere çekilen enerji yakında bir tsunami gibi geri dönecek.'} Öne çıkan sembol ${L.word} — bu ${L.short} anlamına geliyor.`,
    `Telve haritanda ${Math.round(sig.circularityScore*1000 + rng(60)*500)} birimlik dairesel rezonans ölçüldü. Bu, kaderinle olan bağlantının son derece güçlü olduğuna işaret ediyor. ${isChaos ? 'Hayatın hız kazanıyor; frene değil direksiyona odaklan.' : 'Sabır stratejin meyve veriyor; zamanlama mükemmel.'} ${L.word} sembolü bugünkü falının ana temasını belirliyor — ${L.short}.`,
    `Kozmik enerji analizi başlatıldı. Fincanının sağ yarısında ${isLight ? 'aydınlık ve açık' : 'yoğun ve karanlık'} telve kümeleri, ${Math.round(sig.warmScore*1000 + rng(70)*300)} termal birimlik sıcaklık sinyali gösteriyor. ${isChaos ? 'Değişimin rüzgarı güçlü esiyor; yelkenini aç.' : 'Fırtına öncesi sessizliktesin; hazırlan.'} ${L.word} izi bu dönemin kilit sembolü olarak öne çıkıyor.`,
    `Yapay Zeka Vision Engine'i ${Math.round(sig.entropy * 500 + sig.darkScore * 1000)} frekansta titreşen bir enerji imzası tespit etti. ${isLight ? 'Parlak ve açık bir aura' : 'Derinleşen ve güçlenen bir iç enerji'} mevcut. ${isChaos ? 'Çalkantılı ama verimli bir dönemdeydin.' : 'Planlı ve stratejik bir süreçtesin.'} ${L.word} figürü bu anın simgesi; ${L.short} mesajını taşıyor.`,
  ];
  const careerTemplates = [
    `${sig.circularityScore > 0.05 ? 'Fincan çeperindeki dairesel telve kalıntıları, geçmişte yarım bıraktığın bir projenin büyük bir finansal başarıyla tamamlanacağını fısıldıyor.' : 'Telve desenlerindeki sert çizgiler, önünde sarsılmaz bir yükselme yolu olduğunu gösteriyor.'} ${isDense ? 'Kariyerindeki engeller telve gibi birikmiş olsa da, onları dağıtacak zihinsel güç sadece sende mevcut.' : 'Bilincini açtığında yolun tüm pürüzlerden arındığını göreceksin.'} ${R1.word} figürü, o kritik terfiyi veya stratejik anlaşmayı müjdeliyor.`,
    `Kariyer falında ${R1.word} sembolünün varlığı tesadüf değil. ${sig.circularityScore > 0.05 ? 'Çevrende döngüsel bir başarı enerjisi var; girişimcilik veya yaratıcı bir proje parlayacak.' : 'Lineer ve kararlı bir ilerleme yolu açık; adımlarını sırayla at.'} ${isDense ? 'Engelleyen kuvvetler hâlâ aktif ama sen onlardan güçlüsün.' : 'Önün açık; tek ihtiyacın cesaret ve zamanlama.'} Bu sembol seni doğrudan zafere taşıyacak.`,
    `Fincanın iş ve kariyer bölgesinde ${R1.word} belirdi. Bu, ${isDense ? 'rekabetçi bir ortamda zekâyla öne çıkma' : 'fırsatları sabırla değerlendirme'} döneminde olduğunu gösteriyor. ${sig.warmScore > 0.07 ? 'İş ilişkilerin ısınıyor; yeni bir ortaklık veya iş birliği kapıda.' : 'Bağımsız bir hamle yapma zamanı; dışarıdan onay bekleme.'} Önümüzdeki 40 gün kariyer açısından kritik.`,
    `${R1.word} sembolü maddi kazanımlar ve statü yükselişini temsil ediyor. ${sig.circularityScore > 0.05 ? 'Döngüsel bir başarı kalıbı görüyorum; geçmişin ekmek attığın suya balık düşüyor.' : 'Düz bir çizgide ilerleyen kararlı bir enerji var; hedefe odaklan.'} ${isDense ? 'Engellerin seni yavaşlatmasına izin verme; enerji birikimi tam.' : 'Önün açık; tek yapman gereken ilk adımı atmak.'} Finansal bir sürpriz çok yakın.`,
    `Kariyer alanında ${R1.word} işareti güçlü. ${isDense ? 'Yoğun ve karmaşık bir çalışma ortamı seni güçlendiriyor.' : 'Verimli ve akıcı bir dönemdeykin; bu nimeti iyi kullan.'} ${sig.circularityScore > 0.05 ? 'Bir proje veya girişim sonuç vermeye yakın.' : 'Uzun vadeli planlama yapma zamanı.'} Yakında önemli bir karar vereceksin ve bu karar seni çok farklı bir yola taşıyacak.`,
  ];
  const emotionTemplates = [
    `${sig.warmScore > 0.07 ? 'Sıcak ton sarmalları, kalpte küllendiğini düşündüğün tutkulu bir bağın yeniden alevleneceğini gösteriyor.' : 'Duygusal hayatında netlik ve huzur dönemi başlıyor; gereksiz bağlardan kurtuluyorsun.'} ${R2.word} izi, ${R2.short} ile tüm boşlukları dolduracak kişiyi veya durumu temsil ediyor. Evrene hazır olduğunu ilet.`,
    `Duygusal rezonans bölgesinde ${R2.word} belirdi. ${sig.warmScore > 0.07 ? 'Sıcak ve bağlayıcı bir enerji var; birileri seni düşünüyor ve o düşünce çok yakında somutlaşacak.' : 'Duygusal bağımsızlık ve iç huzur dönemindeysin; bu güçtür, zayıflık değil.'} Bu sembol, ruhsal düzeyde derinleşecek bir ilişkinin habercisi.`,
    `${R2.word} fincanının en duygusal bölgesinde sessizce parlıyor. ${sig.warmScore > 0.07 ? 'Kalpte bir özlem var ve o özlemin somutlaşması an meselesi.' : 'Seçici ve temkinli olman seni doğru kişiye veya duruma taşıyacak.'} ${isChaos ? 'Duygusal düzlemde heyecanlı gelişmeler bekleniyor.' : 'Derin ve sakin bir bağ kurulacak; yüzeysel değil kök salan bir ilişki.'} Hazır ol.`,
    `Duygusal fal haritasında ${R2.word} sembolü öne çıkıyor. Bu ${R2.short} enerjisini taşıyor. ${sig.warmScore > 0.07 ? 'Aşk veya derin bir bağ konusunda sürpriz bir gelişme çok yakın.' : 'İç dengen güçleniyor; ilişkilerde seçici ve özgüvenli olmaya devam et.'} ${isDense ? 'Duyguların yoğundur ama bunları doğru yönetirsen muazzam bir bağ yaratırsın.' : 'Açık ve net iletişim bu dönemde seni çok ilerletecek.'}`,
    `${R2.word} izi fincanın duygusal koordinatlarında net şekilde okunuyor. ${R2.short} anlamı taşıyan bu sembol, ${sig.warmScore > 0.07 ? 'tutkulu ve dönüştürücü bir ilişkinin kapıda olduğunu' : 'seninle gerçekten uyumlu birinin hayatına gireceğini'} söylüyor. ${isChaos ? 'Bu bağ hızlı ve güçlü gelişecek.' : 'Yavaş ama köklü ve kalıcı bir ilişki şekillenecek.'}`,
  ];

  const introIdx = Math.floor(rng(10) * introTemplates.length);
  const careerIdx = Math.floor(rng(11) * careerTemplates.length);
  const emotionIdx = Math.floor(rng(12) * emotionTemplates.length);

  const fTr = `Kozmik Enerji ve Aura Analizi\n${introTemplates[introIdx]}\n\nKariyer, Başarı ve Finansal Kader\n${careerTemplates[careerIdx]}\n\nRuh Eşi, Bağlar ve Duygusal Rezonans\n${emotionTemplates[emotionIdx]}`;

  const fallback = `Cosmic Energy Analysis\nEntropy: ${Math.round(sig.entropy*1000)} units. ${isChaos ? 'Rapid transformation detected.' : 'Deep steady transformation.'} ${isLight ? 'Aura is bright and magnetic.' : 'Energy is inward, pre-breakthrough.'} Leading symbol: ${L.word} — ${L.short}.\n\nCareer & Finance\n${isDense ? 'Competition exists but your strength surpasses it.' : 'Your path is clear; take the first step.'} ${R1.word} signals a decisive career advancement.\n\nSoulmates & Bonds\n${sig.warmScore > 0.07 ? 'A passionate connection is about to reignite.' : 'Emotional clarity and peace are arriving.'} ${R2.word} — ${R2.short} — will fill what's missing.`;

  const highlights = [
    { id: L.id, word: L.word.toUpperCase(), explanation_long: `${L.word.toUpperCase()} — ${L.desc}` },
    { id: R1.id, word: R1.word.toUpperCase(), explanation_long: `${R1.word.toUpperCase()} — ${R1.desc}` },
    { id: R2.id, word: R2.word.toUpperCase(), explanation_long: `${R2.word.toUpperCase()} — ${R2.desc}` }
  ];

  return { fortune: lang === 'tr' ? fTr : fallback, highlights };
}



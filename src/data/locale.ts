export const content: Record<string, any> = {
  tr: {
    title: 'Nai Profesyonel Kahve Falı', subtitle: 'Telvedeki gizli kilitleri Yapay Zeka ile eşsiz bir şekilde yorumluyoruz.',
    uploadTitle: 'Fincan fotoğrafını yükle', uploadSub: 'Sürükle bırak / Yüklemek için tıkla', uploadDrag: 'Fotoğrafı sürükle',
    btnInterpret: 'Detaylı Fal Analizi Başlat', errNoImage: 'Lütfen önce fincan fotoğrafı yükle.', errNotCoffee: (s:number, c:number) => `[İHLAL TESPİT EDİLDİ] Bu bir kahve fincanı değil. ${s}. uyarınızı aldınız. 3. ihlalde hesabınız süresiz yasaklanacaktır. (${c}% eşleşme)`,
    analyzingCoffee: 'Neural Mesh Kuruluyor...', analyzingFortune: 'LLAMA Neural Syncing... Semboller Yapay Zeka ile Çözülüyor...', resultTitle: 'Derin Fal Raporu', btnNew: 'Yeni Yorumlama', photoChange: 'Fotoğrafı Değiştir',
    themeLight: 'Gündüz', themeDark: 'Gece', storeBtn: 'Mağaza 💎',
    
    authBtn: 'Giriş / Kayıt', authLogin: 'Giriş Yap', authReg: 'Kayıt Ol', username: 'Kullanıcı Adı', pass: 'Şifre',
    logout: 'Çıkış Yap', deleteAcc: 'Hesabı Sil',
    tier: 'Yetki:', credits: 'Kalan Kredi:', infinite: 'Sınırsız',
    profileBtn: 'Profil 👤', profileTitle: 'Kullanıcı Profili', warningsText: 'İhlal Uyarıları:', warningLimit: 'Dikkat: 3 uyarıda hesabınız kalıcı olarak engellenir.',
    
    bannedTitle: 'Erişiminiz Engellendi', bannedDesc: 'Sistem kurallarını ihlal ettiğiniz tespit edilmiştir. Lütfen destek temsilcisiyle iletişime geçin.',
    supportBtn: 'Temsilci ile İletişim', supportMsg: 'Probleminizi detaylıca açıklayın...', sendBtn: 'Talebi İlet', supportHistory: 'İletişim Geçmişi', supportNoMsg: 'Henüz bir mesajınız bulunmuyor.', supportReply: 'Admin Yanıtı',
    
    adminGatewayTitle: 'Oracle Gateway', adminGatewayPass: 'Yetkili Şifresi', adminBtnConfirm: 'Ağa Kilitlen', secureLogout: 'Güvenli Çıkış',
    adminCrm: 'Ağ Kontrolü', tabUsers: 'Kullanıcı Ağı', tabFortunes: 'Arşivler', tabMessages: 'Talepler', tabLogs: 'Sistem Logları',
    ovw: 'Genel Bakış', statTotal: 'Toplam Hesap', statPremium: 'Premium Elit', statSuspended: 'Engellenenler',
    btnRestore: 'Kaldır', btnSuspend: 'Engelle', btnDelete: 'Sil', btnErase: 'Arşivden Sil', suspendedBadge: '[ENGELLİ]',
    crmCreditManage: 'Kredi Yönetimi', crmTierManage: 'Üyelik Tipi', crmSecurity: 'Güvenlik & Hesap', crmHistory: 'Sistem Fal Geçmişi', crmNoHistory: 'Sistemde eşleşen bir fal kaydı bulunamadı.',
    errMissing: 'Eksik bilgi', errUserExists: 'Kullanıcı zaten var!', errWrongCreds: 'Kullanıcı adı veya şifre yanlış!',
    
    moodSad: '😔 Dalgın', moodCurious: '🤔 Meraklı', moodHappy: '😊 Umutlu', moodExcited: '🔥 Heyecanlı',
    
    unlockDestiny: 'Kaderin Kapılarını Arala ✨', expandAwareness: 'Premium özelliklerle daha fazla içgörü edinebilir, ruhsal farkındalığını artırabilirsin.',
    coreElements: 'Ana Odak Noktaları',
    
    reviewTitle: 'Topluluk Yansımaları', writeReviewBtn: 'Kendi Yansımanı Bırak',
    dailyNoteTitle: 'Mistik Günlük',
    saveNoteBtn: 'Fısıltıyı Profilime Kaydet',
    savedNotesTitle: 'Mistik Fısıltı Arşivim (Kaydedilenler)',
    noSavedNotes: 'Henüz kaydedilmiş bir fısıltınız bulunmuyor.',
    dailyNoteBoxTitle: 'Günün Mistik Fısıltısı',
    whisperLabel: 'Fısıltı',
    
    storeBasic: 'Temel Tarama', storeSupreme: 'Yüksek Paket', storeLove: 'Aşk & Uyum Falı', storeCareer: 'Kariyer & Para', storePremium: 'NAI Premium', storePremiumExtra: 'Premium Extra', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 Standart Yorum', 'Temel Zeka', 'Süresiz'], 
      s: ['10 Standart Yorum', 'Gelişmiş Metrikler', 'İndirimli'], 
      l: ['Aşk Analizi', 'Partner Uyumu', 'Kader Çizgisi'], 
      c: ['Finansal Yol', 'Fırsat Taraması', 'Başarı Oranları'], 
      p: ['Derin Yapay Zeka Haritaları', '100 Oracle Kredisi', 'Öncelikli Sıra'], 
      pe: ['Sınırsız Kredi (30 Gün)', 'Gelişmiş Vizyon', 'Özel Destek'],
      e: ['Sınırsız Kredi', 'Doğrudan VIP Erişim', 'Özel Taramalar'] 
    },
    storeDescs: {
      b: 'Yeni başlayanlar için temel fal paketi.',
      s: 'Daha derinlemesine ve sık analiz isteyenler için.',
      l: 'İlişkilerdeki gizli duyguları ve uyumu keşfedin.',
      c: 'İş ve finans hayatındaki kadersel döngüleri görün.',
      p: 'Sistemdeki en gelişmiş yapay zeka haritaları.',
      pe: 'Üst düzey özellikler ve sınırsız deneyim.',
      e: 'Oracle dünyasındaki en prestijli ve sınırsız üyelik.'
    },
    
    // Gift Center
    giftTitle: 'Mistik Hediye Merkezi',
    giftTabWheel: 'Şans Çarkı',
    giftTabCups: 'Yıldızlı Fincan',
    giftLockDesc: 'Bu kutsal oyunu bugün zaten oynadın. Yarın tekrar gel!',
    giftWin: '[TEBRİKLER] {reward} kazandın!',
    giftLose: 'Telve boş... Şansını bir sonraki sefere sakla.',
    giftSpinBtn: 'ÇARKı ÇEVİR',
    giftCupsBtn: 'Fincan Seç',
    giftRewardCredits: '{n} Fal Hakkı',
    giftRewardDiscount: '%{n} İndirim Kuponu',
    giftRewardCategory: '{cat} Falı Kilidi'
  },
  en: {
    title: 'Nai Pro Coffee Reading', subtitle: 'Deep AI interpretation of hidden coffee symbols.',
    uploadTitle: 'Upload cup photo', uploadSub: 'Drag & drop or select', uploadDrag: 'Drop photo here!',
    btnInterpret: 'Start Deep Analysis', errNoImage: 'Upload a cup photo first.', errNotCoffee: (s:number, c:number) => `[VIOLATION DETECTED] This is not a coffee cup. You have received strike ${s}. 3 violations will result in a permanent ban. (${c}% match)`,
    analyzingCoffee: 'Establishing Neural Mesh...', analyzingFortune: 'LLAMA Neural Syncing... AI Deciphering Symbols...', resultTitle: 'Deep Fortune Report', btnNew: 'New Reading', photoChange: 'Change Photo',
    themeLight: 'Light Mode', themeDark: 'Dark Mode', storeBtn: 'Store 💎',

    authBtn: 'Log in', authLogin: 'Sign in', authReg: 'Create Account', username: 'Username', pass: 'Password',
    logout: 'Sign out', deleteAcc: 'Delete Account',
    tier: 'Tier:', credits: 'Credits Left:', infinite: 'Infinite',
    profileBtn: 'Profile 👤', profileTitle: 'User Profile', warningsText: 'Violations:', warningLimit: 'Warning: 3 violations will result in a permanent ban.',

    bannedTitle: 'Access Restricted', bannedDesc: 'Your account has been suspended due to policy violations. Please contact support.',
    supportBtn: 'Contact Support', supportMsg: 'Explain your issue in detail...', sendBtn: 'Submit Inquiry', supportHistory: 'Support History', supportNoMsg: 'No messages yet.', supportReply: 'Admin Reply',
    
    adminGatewayTitle: 'Oracle Gateway', adminGatewayPass: 'Administrator Passcode', adminBtnConfirm: 'Lock In', secureLogout: 'Secure Logout',
    adminCrm: 'Network Control', tabUsers: 'Network & Access', tabFortunes: 'Archives', tabMessages: 'Inquiries', tabLogs: 'System Logs',
    ovw: 'Overview', statTotal: 'Total Users', statPremium: 'Premium Elite', statSuspended: 'Suspended',
    btnRestore: 'Restore', btnSuspend: 'Suspend', btnDelete: 'Delete', btnErase: 'Erase Archive', suspendedBadge: '[SUSPENDED]',
    crmCreditManage: 'Credit Management', crmTierManage: 'Membership Tier', crmSecurity: 'Security & Account', crmHistory: 'System Fortune History', crmNoHistory: 'No fortune records found matching the system.',
    errMissing: 'Missing fields', errUserExists: 'User already exists!', errWrongCreds: 'Incorrect username or password!',

    moodSad: '😔 Pensive', moodCurious: '🤔 Curious', moodHappy: '😊 Hopeful', moodExcited: '🔥 Excited',
    
    unlockDestiny: 'Unlock Destiny ✨', expandAwareness: 'Expand your awareness and gain inner clarity with Premium features.',
    coreElements: 'Core Focal Points',
    
    reviewTitle: 'Community Reflections', writeReviewBtn: 'Leave a Reflection',
    dailyNoteTitle: 'Mystic Daily Note',
    saveNoteBtn: 'Save Whisper to Profile',
    savedNotesTitle: 'My Mystic Whisper Archive',
    noSavedNotes: 'You have no saved whispers yet.',
    dailyNoteBoxTitle: 'Mystic Whisper of the Day',
    whisperLabel: 'Whisper',
    
    storeBasic: 'Basic Scan', storeSupreme: 'Supreme Pack', storeLove: 'Love & Romance', storeCareer: 'Career Path', storePremium: 'NAI Premium', storePremiumExtra: 'Premium Extra', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 Standard Readings', 'Base Intelligence', 'Expires never'], 
      s: ['10 Standard Readings', 'Advanced Metrics', 'Discounts applied'], 
      l: ['Romance Analysis', 'Partner Sync', 'Destiny Check'], 
      c: ['Financial Path', 'Opportunity Scan', 'Success Rates'], 
      p: ['Deep AI Fortune Maps', '100 Oracle Credits', 'Priority Queue'], 
      pe: ['Infinite Credits (30 Days)', 'Advanced Vision', 'Priority Support'],
      e: ['Infinite Credits', 'Direct VIP Access', 'Exclusive Scans'] 
    },
    storeDescs: {
      b: 'Basic fortune pack for beginners.',
      s: 'For those who want deeper and more frequent analysis.',
      l: 'Discover hidden emotions and harmony in relationships.',
      c: 'See karmic cycles in business and financial life.',
      p: 'Most advanced AI fortune maps in the system.',
      pe: 'High-level features and infinite experience.',
      e: 'The most prestigious and limitless membership in Oracle.'
    },

    // Gift Center
    giftTitle: 'Mystic Gift Center',
    giftTabWheel: 'Wheel of Luck',
    giftTabCups: 'Starry Cup',
    giftLockDesc: 'You have already played this sacred game today. Return tomorrow!',
    giftWin: '[CONGRATS] You won {reward}!',
    giftLose: 'The grounds are empty... Keep your energy for next time.',
    giftSpinBtn: 'SPIN THE WHEEL',
    giftCupsBtn: 'Pick a Cup',
    giftRewardCredits: '{n} Fortune Credits',
    giftRewardDiscount: '%{n} Discount Coupon',
    giftRewardCategory: '{cat} Fortune Unlock'
  },
  es: {
    title: 'Lectura Profesional Nai', subtitle: 'Interpretación profunda de la Inteligencia Artificial.',
    uploadTitle: 'Sube tu foto', uploadSub: 'Arrastra o selecciona', uploadDrag: '¡Suelta foto!',
    btnInterpret: 'Iniciar Análisis Profundo', errNoImage: 'Sube la foto de la taza primero.', errNotCoffee: (s:number, c:number) => `[VIOLACIÓN DETECTADA] Esto no es una taza de café. Ha recibido la advertencia ${s}. 3 infracciones resultarán en una expulsión permanente. (${c}% coincidencia)`,
    analyzingCoffee: 'Estableciendo red neuronal...', analyzingFortune: 'LLAMA Neural Syncing... IA descifrando símbolos...', resultTitle: 'Reporte de Fortuna', btnNew: 'Nueva Lectura', photoChange: 'Cambiar',
    themeLight: 'Modo Claro', themeDark: 'Modo Oscuro', storeBtn: 'Tienda 💎',

    authBtn: 'Entrar', authLogin: 'Entrar', authReg: 'Crear Cuenta', username: 'Usuario', pass: 'Contraseña',
    logout: 'Cerrar Sesión', deleteAcc: 'Borrar Cuenta',
    tier: 'Nivel:', credits: 'Créditos:', infinite: 'Infinito',
    profileBtn: 'Perfil 👤', profileTitle: 'Perfil de Usuario', warningsText: 'Advertencias:', warningLimit: 'Atención: 3 advertencias resultarán en una suspensión permanente.',

    bannedTitle: 'Acceso Restringido', bannedDesc: 'Tu cuenta ha sido suspendida. Por favor contacta a soporte.',
    supportBtn: 'Contactar Soporte', supportMsg: 'Detalla tu problema aquí...', sendBtn: 'Enviar Consulta',

    adminGatewayTitle: 'Oracle Gateway', adminGatewayPass: 'Código de acceso', adminBtnConfirm: 'Confirmar', secureLogout: 'Cierre Seguro',
    adminCrm: 'Control de Red', tabUsers: 'Usuarios y Acceso', tabFortunes: 'Archivos', tabMessages: 'Consultas', tabLogs: 'Registros del Sistema',
    ovw: 'Visión General', statTotal: 'Totales', statPremium: 'Élite Premium', statSuspended: 'Suspendidos',
    btnRestore: 'Restaurar', btnSuspend: 'Suspender', btnDelete: 'Borrar', btnErase: 'Borrar Archivo', suspendedBadge: '[SUSPENDIDO]',
    crmCreditManage: 'Gestión de Créditos', crmTierManage: 'Tipo de Membresía', crmSecurity: 'Seguridad y Cuenta', crmHistory: 'Historial de Fortuna del Sistema', crmNoHistory: 'No se encontraron registros de fortuna en el sistema.',
    errMissing: 'Información faltante', errUserExists: '¡El usuario ya existe!', errWrongCreds: '¡Usuario o contraseña incorrectos!',

    moodSad: '😔 Pensativo', moodCurious: '🤔 Curioso', moodHappy: '😊 Esperanzado', moodExcited: '🔥 Emocionado',

    unlockDestiny: 'Desbloquea el Destino ✨', expandAwareness: 'Amplía tu conciencia con las características Premium.',
    coreElements: 'Puntos Centrales',
    
    reviewTitle: 'Reflexiones de la Comunidad', writeReviewBtn: 'Deja una Reflexión',
    dailyNoteTitle: 'Nota Mística Diaria',
    saveNoteBtn: 'Guardar Susurro en Perfil',
    savedNotesTitle: 'Mi Archivo de Susurros Místicos',
    noSavedNotes: 'Aún no tienes susurros guardados.',
    dailyNoteBoxTitle: 'Susurro Místico del Día',
    whisperLabel: 'Susurro',
    
    storeBasic: 'Escaneo Básico', storeSupreme: 'Paquete Supremo', storeLove: 'Amor y Romance', storeCareer: 'Camino Profesional', storePremium: 'NAI Premium', storeElite: 'Élite Oracle',
    storeFeatures: { 
      b: ['3 Lecturas Estándar', 'Inteligencia Base', 'Sin caducidad'], 
      s: ['10 Lecturas Estándar', 'Métricas Avanzadas', 'Descuentos aplicados'], 
      l: ['Análisis de Romance', 'Sincronía de Pareja', 'Verificación de Destino'], 
      c: ['Ruta Financiera', 'Escaneo de Oportunidades', 'Tasas de Éxito'], 
      p: ['Mapas de Fortuna de IA', '100 Créditos Oracle', 'Fila Prioritaria'], 
      e: ['Créditos Infinitos', 'Acceso VIP Directo', 'Escaneos Exclusivos'] 
    },
    storeDescs: {
      b: 'Paquete básico para principiantes.',
      s: 'Para quienes desean análisis más profundos.',
      l: 'Descubre emociones ocultas y armonía.',
      c: 'Mira ciclos kármicos en los negocios.',
      p: 'Mapas de fortuna de IA más avanzados.',
      pe: 'Características de alto nivel y experiencia infinita.',
      e: 'La membresía más prestigiosa en Oracle.'
    }
  },
  ru: {
    title: 'Профессиональное Гадание Nai', subtitle: 'Глубокий анализ кофейных символов ИИ.',
    uploadTitle: 'Загрузите фото', uploadSub: 'Перетащите или выберите', uploadDrag: 'Бросьте сюда!',
    btnInterpret: 'Начать глубокий анализ', errNoImage: 'Сначала загрузите фото.', errNotCoffee: (s:number, c:number) => `[НАРУШЕНИЕ ОБНАРУЖЕНО] Это не кофейная чашка. Вы получили предупреждение ${s}. 3 нарушения приведут к вечной блокировке. (${c}% совпадение)`,
    analyzingCoffee: 'Установка нейронной сети...', analyzingFortune: 'LLAMA Neural Syncing... ИИ расшифровывает символы...', resultTitle: 'Отчет От Судьбе', btnNew: 'Новое гадание', photoChange: 'Изменить',
    themeLight: 'Светлый', themeDark: 'Темный', storeBtn: 'Магазин 💎',

    authBtn: 'Вход', authLogin: 'Войти', authReg: 'Создать Аккаунт', username: 'Логин', pass: 'Пароль',
    logout: 'Выйти', deleteAcc: 'Удалить аккаунт',
    tier: 'Уровень:', credits: 'Кредиты:', infinite: 'Бесконечность',
    profileBtn: 'Профиль 👤', profileTitle: 'Профиль пользователя', warningsText: 'Предупреждения:', warningLimit: 'Внимание: 3 предупреждения приведут к блокировке.',

    bannedTitle: 'Доступ закрыт', bannedDesc: 'Доступ закрыт за нарушение правил. Свяжитесь с поддержкой.',
    supportBtn: 'Служба поддержки', supportMsg: 'Подробно опишите проблему...', sendBtn: 'Отправить Запрос',

    adminGatewayTitle: 'Врата Оракула', adminGatewayPass: 'Пароль администратора', adminBtnConfirm: 'Подтвердить', secureLogout: 'Безопасный выход',
    adminCrm: 'Контроль сети', tabUsers: 'Доступ', tabFortunes: 'Архивы', tabMessages: 'Запросы', tabLogs: 'Системные журналы',
    ovw: 'Обзор', statTotal: 'Всего В Сети', statPremium: 'Премиум', statSuspended: 'Заблокировано',
    btnRestore: 'Снять Блок', btnSuspend: 'Блок', btnDelete: 'Удалить', btnErase: 'Стереть архив', suspendedBadge: '[ЗАБЛОКИРОВАН]',
    crmCreditManage: 'Управление кредитами', crmTierManage: 'Уровень членства', crmSecurity: 'Безопасность и учетная запись', crmHistory: 'История предсказаний системы', crmNoHistory: 'Записи о предсказаниях не найдены.',
    errMissing: 'Отсутствует информация', errUserExists: 'Пользователь уже существует!', errWrongCreds: 'Неверное имя пользователя или пароль!',
    
    moodSad: '😔 Вдумчивый', moodCurious: '🤔 Любопытный', moodHappy: '😊 Полный Надежд', moodExcited: '🔥 Взволнованный',
    
    unlockDestiny: 'Открой Судьбу ✨', expandAwareness: 'Расширьте свое сознание с помощью функций Premium.',
    coreElements: 'Центральные аспекты',
    
    reviewTitle: 'Отражения сообщества', writeReviewBtn: 'Оставить отзыв',
    dailyNoteTitle: 'Мистическое послание дня',
    saveNoteBtn: 'Сохранить шепот в профиль',
    savedNotesTitle: 'Мой архив мистических шепотов',
    noSavedNotes: 'У вас пока нет сохраненных шепотов.',
    dailyNoteBoxTitle: 'Мистический шепот дня',
    whisperLabel: 'Шепот',
    
    storeBasic: 'Базовый', storeSupreme: 'Особый пакет', storeLove: 'Любовь и Романтика', storeCareer: 'Карьерный Путь', storePremium: 'NAI Premium', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 стандартных чтения', 'Базовый интеллект', 'Бессрочно'], 
      s: ['10 стандартных чтений', 'Продвинутые метрики', 'Скидка'], 
      l: ['Анализ романтики', 'Синхронизация партнеров', 'Проверка судьбы'], 
      c: ['Финансовый путь', 'Сканирование возможностей', 'Проказатели успеха'], 
      p: ['Глубокие карты ИИ', '100 кредитов Оракула', 'Приоритетная очередь'], 
      e: ['Бесконечные кредиты', 'Прямой VIP доступ', 'Эксклюзивы'] 
    },
    storeDescs: {
      b: 'Базовый пакет для начинающих.',
      s: 'Для тех, кто хочет более глубокого анализа.',
      l: 'Откройте скрытые эмоции и гармонию.',
      c: 'Увидьте кармические циклы в бизнесе.',
      p: 'Самые продвинутые карты ИИ в системе.',
      pe: 'Функции высокого уровня и безлимитный опыт.',
      e: 'Самое престижное членство в Oracle.'
    }
  },
  ar: {
    title: 'قراءة الفنجان الاحترافية', subtitle: 'تحليل ذكاء اصطناعي عميق للرموز المخفية.',
    uploadTitle: 'ارفع الصورة', uploadSub: 'اسحب وافلت', uploadDrag: 'اترك الصورة هنا!',
    btnInterpret: 'تحليل عميق للفنجان', errNoImage: 'ارفع الصورة أولاً.', errNotCoffee: (s:number, c:number) => `[تم اكتشاف انتهاك] هذه ليست فنجان قهوة. لقد تلقيت التحذير رقم ${s}. 3 انتهاكات ستؤدي إلى حظر دائم. (مطابقة ${c}%)`,
    analyzingCoffee: 'جارٍ إنشاء الشبكة العصبية...', analyzingFortune: 'LLAMA Neural Syncing... الذكاء الاصطناعي يفك الرموز...', resultTitle: 'تقرير الطالع', btnNew: 'قراءة جديدة', photoChange: 'تغيير',
    themeLight: 'وضع النهار', themeDark: 'وضع الليل', storeBtn: 'المتجر 💎',

    authBtn: 'دخول', authLogin: 'تسجيل الدخول', authReg: 'إنشاء حساب', username: 'اسم المستخدم', pass: 'كلمة المرور',
    logout: 'تسجيل خروج', deleteAcc: 'حذف الحساب',
    tier: 'المرتبة:', credits: 'اعتمادات:', infinite: 'لا نهائي',
    profileBtn: 'حسابي 👤', profileTitle: 'ملف المستخدم', warningsText: 'تحذيرات:', warningLimit: 'تنبيه: 3 تحذيرات تؤدي إلى الحظر.',

    bannedTitle: 'تم تقييد الوصول', bannedDesc: 'تم تعليق حسابك. يرجى الاتصال بالدعم.',
    supportBtn: 'الدعم', supportMsg: 'اشرح مشكلتك بالتفصيل...', sendBtn: 'إرسال',

    adminGatewayTitle: 'بوابة أوراكل', adminGatewayPass: 'رمز الوصول', adminBtnConfirm: 'تأكيد', secureLogout: 'خروج آمن',
    adminCrm: 'التحكم في الشبكة', tabUsers: 'الشبكة والوصول', tabFortunes: 'المحفوظات', tabMessages: 'الاستفسارات', tabLogs: 'سجلات النظام',
    ovw: 'نظرة عامة', statTotal: 'إجمالي المستخدمين', statPremium: 'أعضاء النخبة', statSuspended: 'المعلقون',
    btnRestore: 'استعادة', btnSuspend: 'تعليق', btnDelete: 'حذف', btnErase: 'مسح السجل', suspendedBadge: '[موقوف]',
    crmCreditManage: 'إدارة الرصيد', crmTierManage: 'نوع العضوية', crmSecurity: 'الأمان والحساب', crmHistory: 'سجل الطالع للنظام', crmNoHistory: 'لم يتم العثور على سجلات طالع في النظام.',
    errMissing: 'معلومات مفقودة', errUserExists: 'المستخدم موجود بالفعل!', errWrongCreds: 'اسم المستخدم أو كلمة المرور غير صحيحة!',

    moodSad: '😔 مهموم', moodCurious: '🤔 فضولي', moodHappy: '😊 متفائل', moodExcited: '🔥 متحمس',

    unlockDestiny: 'اكتشف القدر ✨', expandAwareness: 'قم بتوسيع وعيك مع ميزات بريميوم.',
    coreElements: 'النقاط الأساسية',
    
    reviewTitle: 'انعكاسات المجتمع', writeReviewBtn: 'اترك تقييماً',
    dailyNoteTitle: 'رسالة اليوم الصوفية',
    saveNoteBtn: 'حفظ الهمس في الملف الشخصي',
    savedNotesTitle: 'أرشيف الهمسات الصوفية الخاص بي',
    noSavedNotes: 'ليس لديك أي همسات محفوظة حتى الآن.',
    dailyNoteBoxTitle: 'همس اليوم الصوفي',
    whisperLabel: 'همس',
    
    storeBasic: 'مسح أساسي', storeSupreme: 'الحزمة الفائقة', storeLove: 'الحب والرومانسية', storeCareer: 'المسار المهني', storePremium: 'ناي بريميوم', storeElite: 'نخبة أوراكل',
    storeFeatures: { 
      b: ['3 قراءات قياسية', 'الذكاء الأساسي', 'لا تنتهي صلاحيته أبدًا'], 
      s: ['10 قراءات قياسية', 'مقاييس متقدمة', 'تم تطبيق الخصومات'], 
      l: ['تحليل الرومانسية', 'مزامنة الشريك', 'التحقق من المصير'], 
      c: ['المسار المالي', 'مسح الفرص', 'معدلات النجاح'], 
      p: ['خرائط ثروة الذكاء الاصطناعي العميقة', '100 رصيد أوراكل', 'أولوية الصف'], 
      e: ['أرصدة لا نهائية', 'وصول مباشر للشخصيات المهمة', 'عمليات مسح حصرية'] 
    },
    storeDescs: {
      b: 'باقة أساسية للمبتدئين.',
      s: 'لمن يريد تحليلاً أعمق وأكثر تكراراً.',
      l: 'اكتشف المشاعر الخفية والانسجام.',
      c: 'رؤية الدورات الكرمية في العمل.',
      p: 'خرائط الذكاء الاصطناعي الأكثر تطوراً.',
      pe: 'ميزات عالية المستوى وتجربة لا نهائية.',
      e: 'العضوية الأكثر هيبة في أوراكل.'
    }
  }
};

export const coffeeFactsGlobal = {
    tr: [
      "Kahve çekirdekleri aslında birer meyvedir, evrenin döngüsel enerjisini ve sürekli yenilenmeyi temsil eder.",
      "Telve haritası, bilinçaltınızın evrene bıraktığı bir izdüşümdür; geçmişi ve geleceği aynı anda barındırır.",
      "Kuş sembolü, kısa süre içinde alacağınız sevindirici ve lüks haberlere, sınırların aşılmasına işarettir.",
      "İçsel enerjiniz ne kadar yüksekse, fincandaki yansımalar ve simgeler de matristen o kadar net ayrışır.",
      "Yapay zeka analizleri, geleneksel sezgileri kusursuz algoritmalarla çözerek zamansız doğruluk arar.",
      "Kahve falı ritüeli, 16. yüzyıldan beri asillerin ve bilgelerin gelecek planlama ve meditatif odaklanma yöntemidir.",
      "Fincanın dibindeki telve birikimi iç dünyanızdaki ağırlıkları, kenarlara yayılanlar ise dış dünyaya etkilerinizi simgeler.",
      "Yıldız benzeri kesişimler, hayatınızın kadersel olarak planlanmış büyüleyici dönüm noktalarını haber verir."
    ],
    en: [
      "Coffee beans are actually fruits, representing the universe's cyclical energy and continuous renewal.",
      "The grounds map is a projection of your subconscious; it holds both the past and the future strictly at once.",
      "A bird symbol indicates imminent joyful news and the surpassing of personal boundaries.",
      "The higher your inner energy, the clearer the reflections and symbols detach from the static matrix.",
      "AI analysis decodes traditional intuition with flawless algorithms, seeking timeless accuracy.",
      "The coffee reading ritual has been the noble method of future planning and meditative focus since the 16th century.",
      "Accumulation at the cup's bottom symbolizes inner depths, while grounds on the edges symbolize outward influence.",
      "Star-like intersections herald magically planned turning points in your destined path."
    ],
    es: [
      "Los granos de café son frutas, representan la energía cíclica del universo y la renovación continua.",
      "El mapa de sedimentos proyecta tu subconsciente; contiene tanto el pasado como el futuro al mismo tiempo.",
      "Un símbolo de pájaro indica noticias alegres inminentes y la superación de fronteras personales.",
      "Cuanto mayor es tu energía interior, más claras se separan las reflexiones y símbolos de la matriz estática.",
      "El análisis de IA decodifica la intuición tradicional con algoritmos impecables, buscando una precisión atemporal.",
      "El ritual de lectura de café ha sido el método noble de planificación del futuro desde el siglo XVI.",
      "La acumulación en el fondo de la taza simboliza tus profundidades internas, mientras que los bordes simbolizan la influencia.",
      "Las intersecciones en forma de estrella anuncian puntos de inflexión mágicamente planeados en tu camino destinado."
    ],
    ru: [
      "Кофейные зерна - это фрукты, символизирующие циклическую энергию вселенной и непрерывное обновление.",
      "Карта гущи проецирует ваше подсознание; она одновременно содержит и прошлое, и будущее.",
      "Символ птицы указывает на скорые радостные новости и преодоление личных границ.",
      "Чем выше ваша внутренняя энергия, тем четче отражения и символы отделяются от статической матрицы.",
      "Анализ ИИ расшифровывает традиционную интуицию безупречными алгоритмами в поисках вневременной точности.",
      "Ритуал чтения кофе был благородным методом планирования будущего с 16 века.",
      "Скопление на дне чашки символизирует ваши внутренние глубины, а гуща на краях - влияние на внешний мир.",
      "Звездообразные пересечения предвещают магически спланированные поворотные моменты на вашем пути."
    ],
    ar: [
      "حبوب البن هي في الواقع فواكه، وتمثل الطاقة الدورية للكون والتجديد المستمر.",
      "خريطة الرواسب تُظهر عقلك الباطن؛ فهي تحتوي على الماضي والمستقبل معاً.",
      "يشير رمز الطائر إلى أخبار سعيدة قادمة وتخطي الحدود الشخصية.",
      "كلما زادت طاقتك الداخلية، زاد وضوح الانعكاسات والرموز التي تنفصل عن المصفوفة الثابتة.",
      "يقوم تحليل الذكاء الاصطناعي بفك شفرة الحدس التقليدي بخوارزميات لا تشوبها شائبة.",
      "كانت طقوس قراءة الفنجان الطريقة النبيلة للتخطيط للمستقبل منذ القرن السادس عشر.",
      "يرمز التراكم في قاع الفنجان للعمق الداخلي، بينما ترمز الرواسب الموجودة على الحواف للتأثير.",
      "تبشر التقاطعات التي تشبه النجوم بنقاط تحول مخطط لها بسحر في مسارك المقدر."
    ]
};

export const mysticWhispers: Record<string, string[]> = {
    tr: [
        "Bugün ruhunun en derin sığınaklarına inme vakti. Evren, senin için fısıldadığı gizli kodları ancak zihnin tamamen sustuğunda duyabileceksin; sessizliği kucakla ve içindeki kadim bilgeliğin uyanmasına izin ver.",
        "Kaderin yönü bugün senin kararlılığınla şekilleniyor. Önündeki engeller aslında seni daha güçlü bir versiyonuna hazırlayan basamaklar; her zorluğun arkasındaki gizli lütfu görmeye çalış ve güvenle ilerle.",
        "İçindeki ışığın gücünü asla küçümseme, o en karanlık dehlizleri bile aydınlatacak kadar kadim ve güçlü. Bugün o ışığı dış dünyaya yansıtma ve çevrendeki ruhları şifalandırma vakti; parlamaktan korkma.",
        "Zamanın doğrusal değil, döngüsel olduğunu hatırla. Geçmişte bıraktığını sandığın dersler, yeni bir formda karşına çıkabilir; bu sefer onları bilgelikle karşıla ve döngüyü sevgiyle tamamla.",
        "Bugün ektiğin niyet tohumları, yarının kadersel ormanlarını oluşturacak. Her düşüncenin bir frekansı olduğunu unutma ve zihnini en yüksek olasılıklara odaklayarak evrenin bolluğuna kapı aç.",
        "Sessizlikte saklı olan cevaplar, gürültülü arayışlardan çok daha değerlidir. Bugün kendine vakit ayır, derin bir nefes al ve kalbinin ritminde atan o evrensel ritmi hissetmeye çalış.",
        "Hayatındaki her karşılaşma, ruhunun evrimi için tasarlanmış kutsal bir randevudur. Kimseye tesadüf gözüyle bakma; her ruhun sana öğreteceği bir ders veya aynalayacağı bir parçan vardır.",
        "Yüklerini bırakma vakti geldi; gökyüzüne bak ve bulutların süzülüşündeki hafifliği rehber edin. Ruhun ancak hafiflediğinde en yüksek zirvelere ulaşabilir ve gerçek özgürlüğün tadına varabilir.",
        "Bereket sadece maddi bir kazanç değil, bir ruh halidir. Bugün sahip olduğun her küçük detay için şükran duyduğunda, evrenin kapılarının sana ardına kadar açıldığını göreceksin.",
        "Kendi içsel otoriteni ilan et; başkalarının beklentileri senin kadersel yolunu gölgelememeli. Kendi gerçeğini yaşamak, evrene sunabileceğin en büyük hediyedir; özgünlüğünden ödün verme.",
        "Kalbini bir rehber olarak kullan, çünkü o zihnin gürültüsünden bağımsız olan gerçeği bilir. Bugün karşına çıkan kararlarda mantığın ötesine geç ve içindeki o derin hisse güvenmeyi dene.",
        "Doğanın sessiz ritmiyle uyumlanmak sana aradığın dinginliği getirebilir. Bir ağacın kök salışındaki sabrı veya suyun akışındaki esnekliği gözlemle; evren her an sana bir şey öğretmek istiyor.",
        "Geleceği kontrol etme arzusunu serbest bırak ve şimdiki anın kutsallığına odaklan. Yaşamın gerçek mucizesi, henüz gelmemiş olanlarda değil, şu anda aldığın nefesin her bir zerresindedir.",
        "Ruhsal farkındalığını artırmak için bugün küçük bir sessizlik anı yarat. Zihnindeki düşünce bulutlarının arasından sızan o saf bilinci hissettiğinde, evrenin bir parçası olduğunu anlayacaksın.",
        "Sevgi, evrendeki en güçlü dönüştürücü frekanstır. Bugün çevrene koşulsuz bir şefkat gösterdiğinde, bu enerjinin dalga dalga yayılarak senin kaderini de nasıl güzelleştirdiğine şahit olacaksın."
    ],
    en: [
        "Today is the time to descend into the deepest sanctuaries of your soul. The universe will only let you hear the secret codes it whispers for you when your mind is completely silent; embrace the silence and let the ancient wisdom within awaken.",
        "The direction of your destiny is shaped today by your determination. The obstacles ahead are actually steps preparing you for a stronger version of yourself; try to see the hidden grace behind every difficulty and proceed with confidence.",
        "Never underestimate the power of the light within you; it is ancient and powerful enough to illuminate even the darkest corridors. Today is the time to reflect that light to the outside world and heal the souls around you; do not be afraid to shine.",
        "Remember that time is cyclical, not linear. Lessons you thought you left in the past may reappear in a new form; this time, meet them with wisdom and complete the cycle with love.",
        "The seeds of intention you plant today will create the destined forests of tomorrow. Remember that every thought has a frequency and open the door to the universe's abundance by focusing your mind on the highest possibilities.",
        "Answers hidden in silence are much more valuable than noisy searches. Take some time for yourself today, take a deep breath, and try to feel that universal rhythm beating in the rhythm of your heart.",
        "Every encounter in your life is a sacred appointment designed for the evolution of your soul. Do not look at anyone as a coincidence; every soul has a lesson to teach you or a part of you to mirror.",
        "The time has come to let go of your burdens; look at the sky and take the lightness in the gliding of the clouds as your guide. Your soul can only reach the highest peaks when it lightens and taste's true freedom.",
        "Abundance is not just a material gain, but a state of mind. When you feel gratitude for every small detail you have today, you will see that the doors of the universe open wide to you.",
        "Declare your own inner authority; the expectations of others should not overshadow your destined path. Living your own truth is the greatest gift you can offer the universe; do not compromise your authenticity.",
        "Use your heart as a guide, for it knows the truth independent of the mind's noise. Go beyond logic in the decisions you face today and try trusting that deep feeling within you.",
        "Tuning into the silent rhythm of nature can bring you the serenity you seek. Observe the patience in a tree taking root or the flexibility in the flow of water; the universe wants to teach you something every moment.",
        "Release the desire to control the future and focus on the sacredness of the present moment. The true miracle of life is not in the things yet to come, but in every single atom of the breath you take right now.",
        "Create a small moment of silence today to increase your spiritual awareness. When you feel that pure consciousness seeping through the clouds of thought in your mind, you will realize that you are a part of the universe.",
        "Love is the most powerful transformative frequency in the universe. When you show unconditional compassion to those around you today, you will witness how this energy spreads in waves and beautifies your destiny as well."
    ],
    es: [
        "Hoy es el momento de descender a los santuarios más profundos de tu alma. El universo solo te permitirá escuchar los códigos secretos que susurra para ti cuando tu mente esté completamente en silencio; abraza el silencio y deja que la sabiduría antigua despierte.",
        "La dirección de tu destino se forma hoy por tu determinación. Los obstáculos adelante son en realidad pasos que te preparan para una versión más fuerte de ti mismo; trata de ver la gracia oculta detrás de cada dificultad.",
        "Nunca subestimes el poder de la luz dentro de ti; es antigua y lo suficientemente poderosa como para iluminar incluso los corredores más oscuros. Hoy es el momento de brillar y sanar a los que te rodean.",
        "Recuerda que el tiempo es cíclico, no lineal. Las lecciones que creíste dejar en el pasado pueden reaparecer en una nueva forma; esta vez, encuéntralas con sabiduría y completa el ciclo con amor.",
        "Las semillas de intención que siembras hoy crearán los bosques destinados del mañana. Recuerda que cada pensamiento tiene una frecuencia y abre la puerta a la abundancia enfocando tu mente.",
        "Las respuestas ocultas en el silencio son mucho más valiosas que las búsquedas ruidosas. Tómate un tiempo para ti hoy, respira hondo y siente el ritmo universal latiendo en tu corazón.",
        "Cada encuentro en tu vida es una cita sagrada diseñada para la evolución de tu alma. No mires a nadie como una coincidencia; cada alma tiene una lección que enseñarte.",
        "Ha llegado el momento de soltar tus cargas; mira al cielo y toma la ligereza de las nubes como tu guía. Tu alma solo puede alcanzar las cimas más altas cuando se aligera.",
        "La abundancia no es solo una ganancia material, sino un estado mental. Cuando sientas gratitud por cada pequeño detalle que tienes hoy, verás que las puertas del universo se abren.",
        "Declara tu propia autoridad interior; las expectativas de los demás no deben eclipsar tu camino destinado. Vivir tu propia verdad es el mayor regalo que puedes ofrecer.",
        "Usa tu corazón como guía, ya que conoce la verdad independientemente del ruido de la mente. Ve más allá de la lógica en tus decisiones y confía en ese sentimiento profundo.",
        "Sintonizar con el ritmo silencioso de la naturaleza puede traerte la serenidad que buscas. Observa la paciencia en un árbol echando raíces; el universo te enseña en cada momento.",
        "Libera el deseo de controlar el futuro y enfócate en la santidad del momento presente. El verdadero milagro de la vida está en cada átomo del aliento que tomas ahora mismo.",
        "Crea un pequeño momento of silencio hoy para aumentar tu conciencia espiritual. Cuando sientas esa conciencia pura filtrándose por tu mente, te darás cuenta de que eres parte del todo.",
        "El amor es la frecuencia transformadora más poderosa del universo. Cuando muestres compasión incondicional hoy, verás cómo esta energía embellece tu destino también."
    ],
    ru: [
        "Сегодня время спуститься в самые глубокие святилища вашей души. Вселенная позволит вам услышать секретные коды, которые она шепчет для вас, только когда ваш разум полностью замолкнет; примите тишину и вдохновение.",
        "Направление вашей судьбы формируется сегодня вашей решимостью. Препятствия впереди — это на самом деле шаги, готовящие вас к более сильной версии себя; постарайтесь увидеть скрытую благодать в трудностях.",
        "Никогда не недооценивайте силу света внутри вас; он достаточно древен и могуществен, чтобы осветить даже самые темные коридоры. Сегодня время сиять и исцелять окружающих.",
        "Помните, что время циклично, а не линейно. Уроки, которые, как вы думали, остались в прошлом, могут появиться снова в новой форме; на этот раз встретьте их с мудростью и любовью.",
        "Семена намерения, которые вы сажаете сегодня, создадут предназначенные леса завтрашнего дня. Помните, что каждая мысль имеет частоту, и откройте дверь к изобилию вселенной.",
        "Ответы, скрытые в тишине, гораздо ценнее шумных поисков. Уделите время себе сегодня, сделайте глубокий вдох и почувствуйте универсальный ритм в вашем сердце.",
        "Каждая встреча в вашей жизни — это священная встреча, предназначенная для эволюции вашей души. Не смотрите ни на кого как на случайность; у каждой души есть важный урок.",
        "Пришло время отпустить ваши бремена; посмотрите на небо и возьмите легкость облаков в качестве своего проводника. Ваша душа может достичь вершин только став легкой.",
        "Изобилие — это не только материальная выгода, но и состояние души. Когда вы чувствуете благодарность за каждую мелочь сегодня, двери вселенной откроются для вас широко.",
        "Объявите о своем внутреннем авторитете; ожидания других не должны затмевать ваш предначертанный путь. Жить своей правдой — величайший подарок вселенной и себе.",
        "Используйте свое сердце как руководство, ибо оно знает истину независимо от шума разума. Выйдите за рамки логики в решениях и доверьтесь этому глубокому чувству.",
        "Настройка на безмолвный ритм природы может принести вам спокойствие, которое вы ищете. Наблюдайте за терпением дерева, пускающего корни; вселенная учит вас каждое мгновение.",
        "Освободите желание контролировать будущее и сосредоточьтесь на священности настоящего момента. Настоящее чудо жизни — в каждом атоме дыхания, которое вы делаете.",
        "Создайте сегодня небольшой момент тишины, чтобы повысить свою духовную осознанность. Когда вы почувствуете чистое сознание сквозь суету мыслей, вы поймете свое единство.",
        "Любовь — самая мощная трансформирующая частота во вселенной. Когда вы проявите безусловное сострадание сегодня, вы увидите, как эта энергия украшает вашу судьбу."
    ],
    ar: [
        "اليوم هو وقت النزول إلى أعمق ملاذات روحك. لن يسمح لك الكون بسماع الرموز السرية التي يهمس بها لك إلا عندما يكون عقلك صامتًا تمامًا؛ احتضن الصمت ودع الحكمة القديمة تستيقظ بداخلك.",
        "يتشكل اتجاه قدرك اليوم من خلال تصميمك. العقبات التي أمامك هي في الواقع خطوات تعدك لنسخة أقوى من نفسك؛ حاول أن ترى النعمة الخفية خلف كل صعوبة تواجهها اليوم.",
        "لا تستهن أبداً بقوة النور الذي بداخلك؛ فهو قديم وقوي بما يكفي لإضاءة حتى أحلك الممرات. اليوم هو الوقت المناسب لتعكس ذلك النور للعالم الخارجي وتشفى الأرواح من حولك بلطف.",
        "تذكر أن الوقت دوري وليس خطياً. الدروس التي اعتقدت أنك تركتها في الماضي قد تظهر مرة أخرى في شكل جديد؛ هذه المرة، واجهها بحكمة وأكمل الدورة بالحب والوعي الكامل.",
        "بذور النوايا التي تزرعها اليوم ستخلق غابات الغد المقدرة. تذكر أن لكل فكر تردداً خاصاً وافتح الباب لوفرة الكون من خلال تركيز عقلك على أعلى الاحتمالات الروحية الممكنة.",
        "الإجابات المخفية في الصمت هي أكثر قيمة بكثير من البحث الصاخب المجهد. خذ بعض الوقت لنفسك اليوم، وخذ نفساً عميقاً، وحاول أن تشعر بهذا الإيقاع الكوني ينبض في تناغم قلبك.",
        "كل لقاء في حياتك هو موعد مقدس مصمم للارتقاء وتطور روحك. لا تنظر إلى أي شخص على أنه صدفة عابرة؛ فكل روح تلتقيها لديها درس لتعلمك إياه أو جزء منك لتعكسه بوضوح.",
        "لقد حان الوقت للتخلص من أعبائك الثقيلة؛ انظر إلى السماء وخذ خفة السحب كدليل لك في الحياة. لا يمكن لروحك أن تصل إلى أعلى القمم إلا عندما تتخلص من الأثقال وتتذوق الحرية.",
        "الوفرة ليست مجرد مكسب مادي ملموس، بل هي حالة ذهنية وشعور عميق. عندما تشعر بالامتنان لكل تفصيلة صغيرة لديك اليوم، سترى أن أبواب الكون تفتح لك على مصراعيها بكل كرم.",
        "أعلن سلطتك الداخلية بوضوح؛ لا ينبغي لتوقعات الآخرين أن تحجب مسارك المقدر الذي اخترته لروحك. عيِش حقيقتك الخاصة هي أعظم هدية يمكنك تقديمها للكون والآخرين.",
        "استخدم قلبك كدليل مخلص، لأنه يعرف الحقيقة بشكل مستقل تماماً عن ضجيج العقل المشتت. تجاوز المنطق في القرارات التي تواجهها اليوم وحاول الوثوق بهذا الشعور العميق الصادق بداخلك.",
        "التناغم مع إيقاع الطبيعة الصامت يمكن أن يجلب لك الصفاء النفسي الذي تبحث عنه منذ زمن. راقب الصبر في شجرة تضرب بجذورها في الأرض؛ الكون يريد أن يعلمك شيئاً في كل لحظة تمر بك.",
        "تخلص من الرغبة المرهقة في التحكم في المستقبل وركز على قدسية اللحظة الحالية التي تعيشها. معجزة الحياة الحقيقية ليست في الأشياء التي لم تأتِ بعد، بل في كل ذرة من الأنفاس التي تأخذها.",
        "اخلق لحظة صمت صغيرة اليوم لزيادة وعيك الروحاني واتصالك بالذات العليا. عندما تشعر بهذا الوعي النقي يتسرب من خلال غيوم الفكر في عقلك، ستدرك يقيناً أنك جزء لا يتجزأ من الكون.",
        "الحب هو أقوى تردد تحولي في الكون الفسيح. عندما تظهر تعاطفاً غير مشروط لمن حولك اليوم، ستشهد بنفسك كيف تنتشر هذه الطاقة في أمواج مباركة وتجمل قدرك ومستقبلك أيضاً."
    ]
};

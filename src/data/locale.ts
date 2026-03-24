export const content: Record<string, any> = {
  tr: {
    title: 'Nai Profesyonel Kahve Falı', subtitle: 'Telvedeki gizli kilitleri Yapay Zeka ile eşsiz bir şekilde yorumluyoruz.',
    uploadTitle: 'Fincan fotoğrafını yükle', uploadSub: 'Sürükle bırak / Yüklemek için tıkla', uploadDrag: 'Fotoğrafı sürükle',
    btnInterpret: 'Detaylı Fal Analizi Başlat', errNoImage: 'Lütfen önce fincan fotoğrafı yükle.', errNotCoffee: (r:number, c:number) => `[HATA] Nesne Algılanamadı - %${c} Eşleşme. Ciddi Uyarınız Kaldı: ${r}`,
    analyzingCoffee: 'Tarama başlatıldı...', analyzingFortune: 'Evrensel ağa bağlanılıyor, telve ritüeli çözümleniyor...', resultTitle: 'Derin Fal Raporu', btnNew: 'Yeni Yorumlama', photoChange: 'Fotoğrafı Değiştir',
    themeLight: 'Gündüz', themeDark: 'Gece', storeBtn: 'Mağaza 💎',
    
    authBtn: 'Giriş / Kayıt', authLogin: 'Giriş Yap', authReg: 'Kayıt Ol', username: 'Kullanıcı Adı', pass: 'Şifre',
    logout: 'Çıkış Yap', deleteAcc: 'Hesabı Sil',
    tier: 'Yetki:', credits: 'Kalan Kredi:', infinite: 'Sınırsız',
    profileBtn: 'Profil 👤', profileTitle: 'Kullanıcı Profili', warningsText: 'İhlal Uyarıları:', warningLimit: 'Dikkat: 3 uyarıda hesabınız kalıcı olarak engellenir.',
    
    bannedTitle: 'Erişiminiz Engellendi', bannedDesc: 'Sistem kurallarını ihlal ettiğiniz tespit edilmiştir. Lütfen destek temsilcisiyle iletişime geçin.',
    supportBtn: 'Temsilci ile İletişim', supportMsg: 'Probleminizi detaylıca açıklayın...', sendBtn: 'Talebi İlet',
    
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
    
    storeBasic: 'Temel Tarama', storeSupreme: 'Yüksek Paket', storeLove: 'Aşk & Uyum Falı', storeCareer: 'Kariyer & Para', storePremium: 'NAI Premium', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 Standart Yorum', 'Temel Zeka', 'Süresiz'], 
      s: ['10 Standart Yorum', 'Gelişmiş Metrikler', 'İndirimli'], 
      l: ['Aşk Analizi', 'Partner Uyumu', 'Kader Çizgisi'], 
      c: ['Finansal Yol', 'Fırsat Taraması', 'Başarı Oranları'], 
      p: ['Derin Yapay Zeka Haritaları', '100 Oracle Kredisi', 'Öncelikli Sıra'], 
      e: ['Sınırsız Kredi', 'Doğrudan VIP Erişim', 'Özel Taramalar'] 
    }
  },
  en: {
    title: 'Nai Pro Coffee Reading', subtitle: 'Deep AI interpretation of hidden coffee symbols.',
    uploadTitle: 'Upload cup photo', uploadSub: 'Drag & drop or select', uploadDrag: 'Drop photo here!',
    btnInterpret: 'Start Deep Analysis', errNoImage: 'Upload a cup photo first.', errNotCoffee: (r:number, c:number) => `[ERROR] Unknown Object - ${c}% Match. Strikes left: ${r}`,
    analyzingCoffee: 'Initiating scan...', analyzingFortune: 'Connecting to cosmic grid, deciphering ritual...', resultTitle: 'Deep Fortune Report', btnNew: 'New Reading', photoChange: 'Change Photo',
    themeLight: 'Light Mode', themeDark: 'Dark Mode', storeBtn: 'Store 💎',

    authBtn: 'Log in', authLogin: 'Sign in', authReg: 'Create Account', username: 'Username', pass: 'Password',
    logout: 'Sign out', deleteAcc: 'Delete Account',
    tier: 'Tier:', credits: 'Credits Left:', infinite: 'Infinite',
    profileBtn: 'Profile 👤', profileTitle: 'User Profile', warningsText: 'Violations:', warningLimit: 'Warning: 3 violations will result in a permanent ban.',

    bannedTitle: 'Access Restricted', bannedDesc: 'Your account has been suspended due to policy violations. Please contact support.',
    supportBtn: 'Contact Support', supportMsg: 'Explain your issue in detail...', sendBtn: 'Submit Inquiry',
    
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
    
    storeBasic: 'Basic Scan', storeSupreme: 'Supreme Pack', storeLove: 'Love & Romance', storeCareer: 'Career Path', storePremium: 'NAI Premium', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 Standard Readings', 'Base Intelligence', 'Expires never'], 
      s: ['10 Standard Readings', 'Advanced Metrics', 'Discounts applied'], 
      l: ['Romance Analysis', 'Partner Sync', 'Destiny Check'], 
      c: ['Financial Path', 'Opportunity Scan', 'Success Rates'], 
      p: ['Deep AI Fortune Maps', '100 Oracle Credits', 'Priority Queue'], 
      e: ['Infinite Credits', 'Direct VIP Access', 'Exclusive Scans'] 
    }
  },
  es: {
    title: 'Lectura Profesional Nai', subtitle: 'Interpretación profunda de la Inteligencia Artificial.',
    uploadTitle: 'Sube tu foto', uploadSub: 'Arrastra o selecciona', uploadDrag: '¡Suelta foto!',
    btnInterpret: 'Iniciar Análisis Profundo', errNoImage: 'Sube la foto de la taza primero.', errNotCoffee: (r:number, c:number) => `[ERROR] Objeto no detectado - ${c}% Coincidencia. Intentos restantes: ${r}`,
    analyzingCoffee: 'Iniciando escaneo...', analyzingFortune: 'Conectando a la red cósmica, descifrando el ritual...', resultTitle: 'Reporte de Fortuna', btnNew: 'Nueva Lectura', photoChange: 'Cambiar',
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
    
    storeBasic: 'Escaneo Básico', storeSupreme: 'Paquete Supremo', storeLove: 'Amor y Romance', storeCareer: 'Camino Profesional', storePremium: 'NAI Premium', storeElite: 'Élite Oracle',
    storeFeatures: { 
      b: ['3 Lecturas Estándar', 'Inteligencia Base', 'Sin caducidad'], 
      s: ['10 Lecturas Estándar', 'Métricas Avanzadas', 'Descuentos aplicados'], 
      l: ['Análisis de Romance', 'Sincronía de Pareja', 'Verificación de Destino'], 
      c: ['Ruta Financiera', 'Escaneo de Oportunidades', 'Tasas de Éxito'], 
      p: ['Mapas de Fortuna de IA', '100 Créditos Oracle', 'Fila Prioritaria'], 
      e: ['Créditos Infinitos', 'Acceso VIP Directo', 'Escaneos Exclusivos'] 
    }
  },
  ru: {
    title: 'Профессиональное Гадание Nai', subtitle: 'Глубокий анализ кофейных символов ИИ.',
    uploadTitle: 'Загрузите фото', uploadSub: 'Перетащите или выберите', uploadDrag: 'Бросьте сюда!',
    btnInterpret: 'Начать глубокий анализ', errNoImage: 'Сначала загрузите фото.', errNotCoffee: (r:number, c:number) => `[Ошибка] Объект не распознан - ${c}% совпадения. Осталось предупреждений: ${r}`,
    analyzingCoffee: 'Инициализация...', analyzingFortune: 'Подключение к космической сети, расшифровка ритуала...', resultTitle: 'Отчет От Судьбе', btnNew: 'Новое гадание', photoChange: 'Изменить',
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
    
    storeBasic: 'Базовый', storeSupreme: 'Особый пакет', storeLove: 'Любовь и Романтика', storeCareer: 'Карьерный Путь', storePremium: 'NAI Premium', storeElite: 'Oracle Elite',
    storeFeatures: { 
      b: ['3 стандартных чтения', 'Базовый интеллект', 'Бессрочно'], 
      s: ['10 стандартных чтений', 'Продвинутые метрики', 'Скидка'], 
      l: ['Анализ романтики', 'Синхронизация партнеров', 'Проверка судьбы'], 
      c: ['Финансовый путь', 'Сканирование возможностей', 'Проказатели успеха'], 
      p: ['Глубокие карты ИИ', '100 кредитов Оракула', 'Приоритетная очередь'], 
      e: ['Бесконечные кредиты', 'Прямой VIP доступ', 'Эксклюзивы'] 
    }
  },
  ar: {
    title: 'قراءة الفنجان الاحترافية', subtitle: 'تحليل ذكاء اصطناعي عميق للرموز المخفية.',
    uploadTitle: 'ارفع الصورة', uploadSub: 'اسحب وافلت', uploadDrag: 'اترك الصورة هنا!',
    btnInterpret: 'تحليل عميق للفنجان', errNoImage: 'ارفع الصورة أولاً.', errNotCoffee: (r:number, c:number) => `[خطأ] لم يتم التعرف على الكائن - تطابق ${c}٪. المحاولات المتبقية: ${r}`,
    analyzingCoffee: 'بدء المسح...', analyzingFortune: 'جارٍ الاتصال بالشبكة الكونية وفك تشفير الطقوس...', resultTitle: 'تقرير الطالع', btnNew: 'قراءة جديدة', photoChange: 'تغيير',
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
    
    storeBasic: 'مسح أساسي', storeSupreme: 'الحزمة الفائقة', storeLove: 'الحب والرومانسية', storeCareer: 'المسار المهني', storePremium: 'ناي بريميوم', storeElite: 'نخبة أوراكل',
    storeFeatures: { 
      b: ['3 قراءات قياسية', 'الذكاء الأساسي', 'لا تنتهي صلاحيته أبدًا'], 
      s: ['10 قراءات قياسية', 'مقاييس متقدمة', 'تم تطبيق الخصومات'], 
      l: ['تحليل الرومانسية', 'مزامنة الشريك', 'التحقق من المصير'], 
      c: ['المسار المالي', 'مسح الفرص', 'معدلات النجاح'], 
      p: ['خرائط ثروة الذكاء الاصطناعي العميقة', '100 رصيد أوراكل', 'أولوية الصف'], 
      e: ['أرصدة لا نهائية', 'وصول مباشر للشخصيات المهمة', 'عمليات مسح حصرية'] 
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

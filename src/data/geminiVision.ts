// Gemini AI Vision - Coffee Cup Detection
// Uses Google Gemini API to analyze images and determine if they contain a coffee cup

const GEMINI_API_KEY = 'AIzaSyD21_Vif7pV2R7AyqP8zDhLI2X9PzQu7zI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiValidationResult {
  isCoffee: boolean;
  confidence: number;
  reason: string;
}

/**
 * Convert an image URL (blob/data URL) to base64 string
 */
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Send image to Gemini AI for coffee cup validation
 */
export async function geminiValidateCoffeeCup(imageUrl: string): Promise<GeminiValidationResult> {
  try {
    const base64Image = await imageUrlToBase64(imageUrl);
    
    const requestBody = {
      contents: [{
        parts: [
          {
            text: `Sen bir "Mistik Kahve Falı" uzmanısın ve fotoğrafın uygunluğunu denetleyensin. 
Fotoğrafa bak ve şu kriterlere göre karar ver:

1. Fotoğraf bir Türk Kahvesi fincanı mı? (Ters çevrilmiş veya açık)
2. Fincan içinde veya tabakta belirgin kahve telvesi (kurumuş/ıslak) var mı?
3. Fotoğraf bir fal yorumu yapmaya uygun mu?

ERİŞİM KURALLARI:
- Kahve fincanı, tabağı veya telvesi varsa: "YES - [Kısa bir onay mesajı]"
- Eğer tamamen alakasızsa (Masa, odun, insan, yemek, manzara vb.): "NO - [Neden uygun olmadığını açıklayan kısa bir cümle]"

ÖRNEK CEVAPLAR:
- YES - Geleneksel kahve telvesi ve fincan tespit edildi.
- NO - Bu fotoğraf bir tahta parçasına benziyor, kahve fincanı değil.
- NO - Görüntü çok karanlık veya belirsiz, telveler seçilemiyor.

LÜTFEN CEVABI BU FORMATTA VER.`
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return { isCoffee: false, confidence: 0, reason: 'SİSTEM HATASI: AI ŞU AN MEŞGUL' };
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    console.log('[Gemini 2.0 Guard]:', aiResponse);

    const isCoffee = aiResponse.toUpperCase().startsWith('YES');
    const reasonText = aiResponse.split('-')[1]?.trim() || aiResponse;
    
    return {
      isCoffee,
      confidence: isCoffee ? 99 : 5,
      reason: isCoffee ? `✓ ${reasonText}` : `✗ ${reasonText}`
    };

  } catch (error) {
    console.error('Gemini Vision error:', error);
    return { isCoffee: false, confidence: 0, reason: 'BAĞLANTI HATASI: TARAMA YAPILAMADI' };
  }
}

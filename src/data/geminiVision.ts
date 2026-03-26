// Gemini AI Vision - Coffee Cup Detection
// Uses Google Gemini API to analyze images and determine if they contain a coffee cup

const GEMINI_API_KEY = 'AIzaSyD21_Vif7pV2R7AyqP8zDhLI2X9PzQu7zI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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
            text: `Bu fotoğrafa dikkatlice bak. Bu fotoğrafta bir Türk kahvesi fincanı, kahve telvesi, veya kahve falı için ters çevrilmiş bir fincan var mı?

KURALLAR:
- Eğer fotoğrafta kahve fincanı, telve, veya kahve ile ilgili bir görüntü VARSA → "YES" yaz
- Eğer fotoğrafta kahve ile ALAKASI OLMAYAN bir şey varsa (yemek, odun, manzara, insan, hayvan, nesne vb.) → "NO" yaz

SADECE tek kelime cevap ver: YES veya NO`
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
      console.error('Gemini API error:', response.status, response.statusText);
      // On API error, allow the image through (don't punish user for API issues)
      return { isCoffee: true, confidence: 75, reason: 'API_FALLBACK_ALLOWED' };
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || '';
    
    console.log('[Gemini AI Response]:', aiResponse);

    const isCoffee = aiResponse.includes('YES');
    
    return {
      isCoffee,
      confidence: isCoffee ? 95 : 15,
      reason: isCoffee ? 'GEMINI_AI_CONFIRMED_COFFEE' : 'GEMINI_AI_REJECTED_NOT_COFFEE'
    };

  } catch (error) {
    console.error('Gemini Vision error:', error);
    // On network/parsing error, allow the image through
    return { isCoffee: true, confidence: 70, reason: 'NETWORK_FALLBACK_ALLOWED' };
  }
}

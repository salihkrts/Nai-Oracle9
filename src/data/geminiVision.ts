// Gemini AI Vision - Coffee Cup Detection
// Uses Google Gemini API to analyze images and determine if they contain a coffee cup

const GEMINI_API_KEY = 'AIzaSyD21_Vif7pV2R7AyqP8zDhLI2X9PzQu7zI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiValidationResult {
  isCoffee: boolean;
  confidence: number;
  reason: string;
}

/**
 * Send image BASE64 to Gemini AI for coffee cup validation
 */
export async function geminiValidateCoffeeCup(base64Image: string): Promise<GeminiValidationResult> {
  try {
    const requestBody = {
      contents: [{
        parts: [
          {
            text: `Sen bir "Mistik Kahve Falı" uzmanısın. İlk görevin bu fotoğrafın falan bakmaya UYGUN olup olmadığını anlamak.
Fotoğrafta şunları ara:
1. Türk Kahvesi fincanı (ters çevrilmiş, dik veya iç tarafı görünen).
2. Kahve telveleri (cup interior or plate).
3. Görüntü çok bulanık veya karanlık olsa bile, eğer kahve fincanı olduğuna dair bir kanıt varsa onay ver.

KURALLAR:
- Uygunsa: "YES - [Kısa onay]"
- Alakasızsa (Odun, masa, insan vb.): "NO - [Kısa neden]"

CEVAP FORMATI: YES - Mesaj veya NO - Mesaj.`
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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return { isCoffee: false, confidence: 0, reason: `API HATASI (${response.status})` };
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    console.log('[Gemini Guard]:', aiResponse);

    const isCoffee = aiResponse.toUpperCase().startsWith('YES');
    const reasonText = aiResponse.split('-')[1]?.trim() || aiResponse;
    
    return {
      isCoffee,
      confidence: isCoffee ? 99 : 5,
      reason: isCoffee ? `✓ ${reasonText}` : `✗ ${reasonText}`
    };

  } catch (error) {
    console.error('Gemini Vision error:', error);
    return { isCoffee: false, confidence: 0, reason: 'BAĞLANTI HATASI' };
  }
}

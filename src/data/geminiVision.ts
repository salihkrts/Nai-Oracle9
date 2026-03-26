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
            text: `[STRICT SECURITY GATEWAY - TASK: IMAGE VALIDATION]
Analyze the provided image with maximum scientific accuracy.

TARGET: Turkish Coffee Cup (Fincan) or Coffee Grounds (Telve).
VALID CRITERIA:
- A coffee cup on a saucer (overturned or upright).
- Dark brown/black coffee grounds inside a cup.
- A saucer with coffee stains/patterns.

INVALID CRITERIA (IMMEDIATE REJECTION):
- Wood, lumber, furniture, or construction materials.
- Scenery, buildings, or outdoor environments.
- People, animals, faces, or body parts.
- General objects (cars, phones, computers, food that is NOT coffee).
- Blank screens, blurry or unidentifiable noise.

DECISION RULE:
If the image contains CLEAR EVIDENCE of a coffee cup or grounds, respond: "YES".
If the image contains ANYTHING ELSE (even if dark or textured), respond: "NO".

RESPONSE FORMAT: Respond ONLY with one word: YES or NO.`
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
      // FAIL-CLOSED: Reject on API error to prevent exploitation
      return { isCoffee: false, confidence: 0, reason: 'SYSTEM_ERROR: AI_OFFLINE' };
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || '';
    
    console.log('[Gemini Guard Response]:', aiResponse);

    const isCoffee = aiResponse === 'YES';
    
    return {
      isCoffee,
      confidence: isCoffee ? 98 : 5,
      reason: isCoffee ? 'GEMINI_VERIFIED_AUTHENTIC' : 'GEMINI_SECURITY_REJECTED'
    };

  } catch (error) {
    console.error('Gemini Vision error:', error);
    // FAIL-CLOSED: Reject on network error
    return { isCoffee: false, confidence: 0, reason: 'NETWORK_ERROR_NO_SCAN' };
  }
}

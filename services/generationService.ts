import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, GenerationModel } from "../types";

// --- Gemini ---

/**
 * Handles image generation using the powerful Imagen model, which supports aspect ratios.
 * Throws a specific error for billing issues.
 */
async function _generateWithImagen(ai: GoogleGenAI, prompt: string, aspectRatio: AspectRatio, negativePrompt?: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
              negativePrompt: negativePrompt,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
          const base64ImageBytes = response.generatedImages[0].image.imageBytes;
          return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
          throw new Error("Gemini API (Imagen) did not return an image.");
        }
    } catch (error) {
        console.error("Error calling Google Gemini API (Imagen):", error);
        if (error instanceof Error && (error.message.includes('billed users') || error.message.includes('billing required'))) {
            throw new Error("ASPECT_RATIO_BILLING_ERROR");
        }
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("Your Google API Key is not valid. Please check it in the settings.");
        }
        throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
}

/**
 * Handles image generation using the accessible Flash model for 1:1 images.
 */
async function _generateWithFlash(ai: GoogleGenAI, prompt: string, negativePrompt?: string): Promise<string> {
    try {
        const finalPrompt = negativePrompt 
            ? `${prompt}\n\n---\nNegative Prompt: Do not include the following elements: ${negativePrompt}` 
            : prompt;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: finalPrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("Gemini API (Flash) did not return an image.");
    } catch (error) {
        console.error("Error calling Google Gemini API (Flash):", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("Your Google API Key is not valid. Please check it in the settings.");
        }
        throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
}

async function _generateWithGemini(prompt: string, apiKey: string, aspectRatio: AspectRatio, negativePrompt?: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  if (aspectRatio !== '1:1') {
      return _generateWithImagen(ai, prompt, aspectRatio, negativePrompt);
  } else {
      return _generateWithFlash(ai, prompt, negativePrompt);
  }
}

function parseDataUrl(dataUrl: string): { data: string; mimeType: string } | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function editImageWithGemini(originalImageSrc: string, editPrompt: string, apiKey: string): Promise<string> {
  const imageParts = parseDataUrl(originalImageSrc);
  if (!imageParts) {
    throw new Error("Invalid image source format. Must be a data URL.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageParts.data,
              mimeType: imageParts.mimeType,
            },
          },
          {
            text: editPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/jpeg';
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("Gemini API did not return an edited image.");

  } catch (error) {
    console.error("Error calling Google Gemini API for image editing:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Your Google API Key is not valid. Please check it in the settings.");
    }
    throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
  }
}

// --- Hugging Face ---
const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

async function _generateWithHuggingFace(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'false'
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Hugging Face API rate limit or quota exceeded.');
        }

        if (response.status === 503) {
             const errorData = await response.json().catch(() => null);
             if (errorData && errorData.error) {
                throw new Error(errorData.error);
             }
             throw new Error('The Hugging Face model is currently loading. Please try again in a few moments.');
        }
        
        const errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `Hugging Face API request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(errorText || `Hugging Face API request failed with status ${response.status}`);
        }
    }

    const blob = await response.blob();
    
    if (blob.type === 'application/json') {
        const errorText = await blob.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'The Hugging Face model returned an unexpected error.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw error;
  }
}

// --- Stability AI ---
const STABILITY_API_URL = "https://clipdrop-api.co/text-to-image/v1";

async function _generateWithStabilityAI(prompt: string, apiKey: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
        let errorMessage = `Stability AI API request failed with status ${response.status}.`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        
        if (response.status === 401) {
            throw new Error('Your Stability AI API Key is not valid. Please check it in the settings.');
        }
        if (response.status === 402 || response.status === 429) {
            throw new Error('Stability AI API quota exceeded. Please check your account billing.');
        }

        throw new Error(errorMessage);
    }

    const blob = await response.blob();
    
    if (blob.type === 'application/json') {
        const errorText = await blob.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'The Stability AI model returned an unexpected error.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error("Error calling Stability AI API:", error);
    throw error;
  }
}


// --- Main Service Function ---

interface GenerationParams {
    prompt: string;
    model: GenerationModel;
    aspectRatio: AspectRatio;
    negativePrompt?: string;
    geminiApiKey?: string | null;
    huggingFaceApiKey?: string | null;
    stabilityApiKey?: string | null;
}

export async function generateImage({
    prompt,
    model,
    aspectRatio,
    negativePrompt,
    geminiApiKey,
    huggingFaceApiKey,
    stabilityApiKey,
}: GenerationParams): Promise<string> {
    
    // For non-Gemini models, force aspect ratio to 1:1 as they don't support others.
    const finalAspectRatio = model === 'gemini' ? aspectRatio : '1:1';

    if (model === 'gemini') {
        if (!geminiApiKey) throw new Error("Gemini API Key is not set.");
        try {
            return await _generateWithGemini(prompt, geminiApiKey, finalAspectRatio, negativePrompt);
        } catch (geminiErr) {
            // Smart Failover: If Gemini fails with a quota error, try Stability AI if key exists.
            const isGeminiQuotaError = geminiErr instanceof Error && (geminiErr.message.includes('quota') || geminiErr.message.includes('billing') || geminiErr.message.includes("ASPECT_RATIO_BILLING_ERROR"));
            if (isGeminiQuotaError && stabilityApiKey) {
                console.log("Gemini quota error, attempting fallback to Stability AI...");
                // Force 1:1 for stability
                return await _generateWithStabilityAI(prompt, stabilityApiKey);
            }
            // Re-throw if it's not a quota error or if there's no fallback key
            throw geminiErr; 
        }
    } else if (model === 'stabilityai') {
        if (!stabilityApiKey) throw new Error("Stability AI API Key is not set.");
        return await _generateWithStabilityAI(prompt, stabilityApiKey);
    } else if (model === 'huggingface') {
        if (!huggingFaceApiKey) throw new Error("Hugging Face API Key is not set.");
        return await _generateWithHuggingFace(prompt, huggingFaceApiKey);
    }

    throw new Error("Invalid model selected.");
}
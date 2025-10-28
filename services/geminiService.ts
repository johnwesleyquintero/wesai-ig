import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

/**
 * Handles image generation using the powerful Imagen model, which supports aspect ratios.
 * Throws a specific error for billing issues.
 */
async function generateWithImagen(ai: GoogleGenAI, prompt: string, aspectRatio: AspectRatio): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
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
async function generateWithFlash(ai: GoogleGenAI, prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
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

/**
 * Generates an image using the Google Gemini API.
 * It intelligently switches between models: `gemini-2.5-flash-image` for standard 1:1 images
 * and `imagen-4.0` for requests with specific aspect ratios.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Google AI API key.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImageWithGemini(prompt: string, apiKey: string, aspectRatio: AspectRatio): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  // If a specific aspect ratio is requested, use the powerful Imagen model.
  // Otherwise, use the more accessible Flash model for standard 1:1 generation.
  if (aspectRatio !== '1:1') {
      return generateWithImagen(ai, prompt, aspectRatio);
  } else {
      return generateWithFlash(ai, prompt);
  }
}

/**
 * Converts a data URL to a base64 string and its MIME type.
 * @param dataUrl The data URL string.
 * @returns An object with the base64 data and MIME type, or null if parsing fails.
 */
function parseDataUrl(dataUrl: string): { data: string; mimeType: string } | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}


/**
 * Edits an image using the Google Gemini API (gemini-2.5-flash-image model).
 * @param originalImageSrc The data URL of the original image.
 * @param editPrompt The text prompt describing the desired edit.
 * @param apiKey The Google AI API key.
 * @returns A promise that resolves to a data URL of the edited image.
 */
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
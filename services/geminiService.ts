import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

/**
 * Generates an image using the Google Gemini API (Imagen model).
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Google AI API key.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImageWithGemini(prompt: string, apiKey: string, aspectRatio: AspectRatio): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
      throw new Error("Gemini API did not return an image.");
    }

  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    // Re-throw a more user-friendly error message.
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Your Google API Key is not valid. Please check it in the settings.");
    }
    throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
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
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an image using the Google Gemini API (Imagen model).
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Google AI API key.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImageWithGemini(prompt: string, apiKey: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
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

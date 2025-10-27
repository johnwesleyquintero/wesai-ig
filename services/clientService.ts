import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Generates an image using the Gemini 2.5 Flash Image model directly from the client.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The user-provided Google Gemini API key.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string, apiKey: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    // Initialize the AI client with the user's API key for each request.
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imageUrls: string[] = [];
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          imageUrls.push(`data:${mimeType};base64,${base64ImageBytes}`);
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("No images were generated. The prompt may have been blocked or the API key is invalid.");
    }
    
    return imageUrls;
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        // Provide more specific feedback for common errors
        if (error.message.includes('API key not valid')) {
            return Promise.reject(new Error('The provided API key is not valid. Please check it and try again.'));
        }
        if (error.message.includes('Quota exceeded')) {
            return Promise.reject(new Error("You've reached the free request limit for this key. Please try again later or use a different key."));
        }
        return Promise.reject(new Error(`Gemini API Error: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the image."));
  }
}
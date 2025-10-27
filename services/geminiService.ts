import { GoogleGenAI, Modality } from "@google/genai";

// This check ensures this code only runs in a server-like environment where process.env is available.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

// Initialize the AI client once with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Gemini 2.5 Flash Image model.
 * This function is intended to be called from a secure, server-side environment.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string): Promise<string[]> {
  try {
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
        if (error.message.includes('API key not valid')) {
            throw new Error('The API key configured on the server is not valid.');
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown server error occurred while generating the image.");
  }
}
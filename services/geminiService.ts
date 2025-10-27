import { GoogleGenAI } from "@google/genai";

// This check ensures this code only runs in a server-like environment where process.env is available.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

// Initialize the AI client once with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Imagen 4 model.
 * This function is intended to be called from a secure, server-side environment.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string): Promise<string[]> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No images were generated. The prompt may have been blocked or the API key is invalid.");
    }

    const imageUrls = response.generatedImages.map(img => {
      const base64ImageBytes = img.image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    });
    
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

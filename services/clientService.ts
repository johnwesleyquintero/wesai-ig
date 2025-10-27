// FIX: Import ModelType to be used in the function signature.
import type { ModelType } from '../types';

/**
 * Generates an image by sending a request to our backend API endpoint which uses Google Gemini.
 * @param prompt The text prompt to generate an image from.
 * @param model The AI model to use for the generation.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string, model: ModelType, aspectRatio: string): Promise<string[]> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model, aspectRatio }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Use the message from the API response if available, otherwise provide a generic error.
        const errorMessage = data.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    
    if (!data.imageUrls || data.imageUrls.length === 0) {
       throw new Error('API returned no images. The prompt may have been blocked.');
    }

    return data.imageUrls;

  } catch (error) {
    console.error("Error calling /api/generate:", error);
    throw error;
  }
}

import { ModelType } from "../types";

/**
 * Generates an image by sending a request to our own serverless API endpoint.
 * This acts as a proxy to the Gemini API.
 * @param prompt The text prompt to generate an image from.
 * @param model The model to use for generation.
 * @param aspectRatio The desired aspect ratio (optional).
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string, model: ModelType, aspectRatio?: string): Promise<string[]> {
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
      throw new Error(JSON.stringify(data));
    }

    if (!data.imageUrls || data.imageUrls.length === 0) {
      throw new Error("API returned no images. The prompt may have been blocked or the API is misconfigured.");
    }
    
    return data.imageUrls;
  } catch (error) {
    console.error("Error calling /api/generate:", error);
    throw error;
  }
}

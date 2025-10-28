import { AspectRatio } from "../types";

const STABILITY_API_URL = "https://clipdrop-api.co/text-to-image/v1";

/**
 * Generates an image by calling the Stability AI (ClipDrop) API.
 * This API currently only supports 1:1 aspect ratio images.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Stability AI API key.
 * @param aspectRatio The desired aspect ratio for the image (Note: this is ignored by the API).
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImageWithStabilityAI(prompt: string, apiKey: string, aspectRatio: AspectRatio): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    // Note: The ClipDrop API for text-to-image does not support the 'aspect_ratio' parameter.
    // It is omitted from the request to prevent errors. All generated images will be 1:1.

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
            // Not a JSON response, use the status text.
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
    
    // The API returns an image buffer on success, so if we get JSON it's an error.
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

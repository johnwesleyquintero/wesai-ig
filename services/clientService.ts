// This service is now specifically for Hugging Face.
const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

/**
 * Generates an image by calling the Hugging Face Inference API.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Hugging Face API key.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImageWithHuggingFace(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'false' // Disables caching to get new images
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

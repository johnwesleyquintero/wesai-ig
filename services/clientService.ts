// This is the recommended model for this task.
const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

/**
 * Generates an image by calling the Hugging Face Inference API directly from the client.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The Hugging Face API key.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImage(prompt: string, apiKey: string): Promise<string> {
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
            throw new Error('API rate limit or quota exceeded. Please check your Hugging Face plan and billing details.');
        }
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const blob = await response.blob();
    
    // Check if the blob is of type JSON, which indicates an error from the API
    if (blob.type === 'application/json') {
        const errorText = await blob.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'The model returned an unexpected error.');
    }

    // Convert the image blob to a data URL to display it
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    // Re-throw the error to be handled by the App component
    throw error;
  }
}

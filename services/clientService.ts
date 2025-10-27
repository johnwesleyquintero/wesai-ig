/**
 * Generates an image by calling the Hugging Face Inference API.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The user's Hugging Face API key.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from Hugging Face API.' }));
      // The API often returns a helpful error message in the `error` property
      const errorMessage = errorData.error || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const blob = await response.blob();

    // Convert blob to a data URL to display the image
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image blob to data URL.'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error reading image blob.'));
      };
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    // Re-throw the error to be handled by the App component
    throw error;
  }
}
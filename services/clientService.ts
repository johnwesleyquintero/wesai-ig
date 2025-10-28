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

        // Handle model loading error (503) specifically
        if (response.status === 503) {
             const errorData = await response.json().catch(() => null);
             if (errorData && errorData.error) {
                // e.g., "Model stabilityai/stable-diffusion-2-1 is currently loading"
                throw new Error(errorData.error);
             }
             // Fallback for 503 if JSON parsing fails
             throw new Error('The model is currently loading on the server. Please try again in a few moments.');
        }
        
        // For other errors, attempt to read the response as text first for better diagnostics
        const errorText = await response.text();
        try {
            // See if the text is valid JSON with an error message
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `API request failed with status ${response.status}`);
        } catch (e) {
            // If it's not JSON, the errorText itself is the message
            throw new Error(errorText || `API request failed with status ${response.status}`);
        }
    }

    const blob = await response.blob();
    
    // Check if the blob is of type JSON, which indicates an error from the API (e.g. during a successful request but invalid input)
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
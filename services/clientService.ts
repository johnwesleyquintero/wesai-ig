/**
 * Generates an image by sending a request to our own serverless API endpoint.
 * This acts as a proxy to the Google Gemini API, enhancing security and avoiding browser-based restrictions.
 * @param prompt The text prompt to generate an image from.
 * @param apiKey The user-provided Google Gemini API key.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export async function generateImage(prompt: string, apiKey: string): Promise<string[]> {
  if (!apiKey) {
    // This client-side check prevents an unnecessary API call if the key is missing.
    throw new Error("API Key is missing.");
  }

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, apiKey }),
    });

    // The response from our own API endpoint needs to be parsed as JSON.
    const data = await response.json();

    if (!response.ok) {
      // If the server returned an error (e.g., 4xx or 5xx), 'data.message' should contain the reason.
      // This propagates the error from the serverless function to the UI.
      throw new Error(data.message || 'An unknown error occurred from the server.');
    }

    if (!data.imageUrls || data.imageUrls.length === 0) {
      throw new Error("API returned no images. The prompt may have been blocked or the API key is invalid.");
    }
    
    return data.imageUrls;
  } catch (error) {
    console.error("Error calling /api/generate:", error);
    // Re-throw the error so it can be caught by the App component and displayed to the user.
    throw error;
  }
}

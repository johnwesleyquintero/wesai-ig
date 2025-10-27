import type { ApiKeyStatus } from '../types';

/**
 * Calls our internal API endpoint to generate an image securely.
 * @param prompt The text prompt to send to the backend.
 * @returns A promise that resolves to an array of image data URLs.
 */
export async function generateImageFromApi(prompt: string): Promise<string[]> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    // If the server responded with an error, throw it so the UI can catch it.
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data.imageUrls;
}

/**
 * Calls our internal API endpoint to get the status of the server-side API key.
 * @returns A promise that resolves to an object containing the masked API key.
 */
export async function getApiKeyStatus(): Promise<ApiKeyStatus> {
    const response = await fetch('/api/status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
}
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

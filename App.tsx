import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { useApiKey } from './contexts/ApiKeyContext';
import { generateImage } from './services/clientService';
import type { GeneratedImage } from './types';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useApiKey();

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setError("Please set your Google Gemini API key in the settings first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const generatedImageUrls = await generateImage(prompt, apiKey);
      const formattedImages = generatedImageUrls.map(url => ({ src: url }));
      setImages(formattedImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header />
        <main className="mt-8">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} isApiKeySet={!!apiKey} />
          <div className="mt-12">
            <ImageDisplay images={images} isLoading={isLoading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

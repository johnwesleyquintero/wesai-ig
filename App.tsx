import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import ApiKeyStatus from './components/ApiKeyStatus';
import { generateImageFromApi } from './services/clientService';
import type { GeneratedImage } from './types';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const generatedImageUrls = await generateImageFromApi(prompt);
      const formattedImages = generatedImageUrls.map(url => ({ src: url }));
      setImages(formattedImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header />
        <ApiKeyStatus />
        <main className="mt-8">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          <div className="mt-12">
            <ImageDisplay images={images} isLoading={isLoading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
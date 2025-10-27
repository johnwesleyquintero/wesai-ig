import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import SettingsModal from './components/SettingsModal';
import { useApiKey } from './contexts/ApiKeyContext';
import { generateImage } from './services/clientService';
import type { GeneratedImage } from './types';

function App() {
  const { apiKey } = useApiKey();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  
  const handleGenerate = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setError("Please set your Hugging Face API key in the settings before generating images.");
      setIsSettingsModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);
    setImages([]);
    setLastPrompt('');

    try {
      const imageUrl = await generateImage(prompt, apiKey);
      setImages([{ src: imageUrl }]);
      setLastPrompt(prompt);
    } catch (err) {
      let finalMessage = "Failed to generate image: An unknown error occurred.";
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('rate limit')) {
            finalMessage = "You may have exceeded your Hugging Face API quota or hit a rate limit.";
            setIsQuotaError(true);
        } else if (err.message.includes("is currently loading")) {
            finalMessage = "The model is loading. Please try again in a few moments.";
        }
        else {
            finalMessage = `Failed to generate image: ${err.message}`;
        }
      }
      setError(finalMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header onOpenSettings={() => setIsSettingsModalOpen(true)} />
        <main className="mt-8 space-y-12">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} isApiKeySet={!!apiKey} />
          <ImageDisplay images={images} isLoading={isLoading} error={error} prompt={lastPrompt} isQuotaError={isQuotaError} />
        </main>
        <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      </div>
    </div>
  );
}

export export default App;
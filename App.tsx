import React, { useState, useCallback, useContext } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import SettingsModal from './components/SettingsModal';
import { generateImage } from './services/clientService';
import { ApiKeyContext } from './contexts/ApiKeyContext';
import type { GeneratedImage } from './types';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const { apiKey } = useContext(ApiKeyContext);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setError("API Key is not set. Please add it in the settings.");
      setIsSettingsOpen(true);
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
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      if (message.includes("quota")) {
        setIsQuotaError(true);
      }
      setError(`Failed to generate image: ${message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header onSettingsClick={() => setIsSettingsOpen(true)} />
        <main className="mt-8 space-y-12">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          <ImageDisplay 
            images={images} 
            isLoading={isLoading} 
            error={error} 
            isQuotaError={isQuotaError}
            prompt={lastPrompt} 
          />
        </main>
        {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      </div>
    </div>
  );
}

export default App;

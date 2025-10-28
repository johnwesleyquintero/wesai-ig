import React, { useState, useCallback, useContext, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import SettingsModal from './components/SettingsModal';
import { generateImage } from './services/clientService';
import { ApiKeyContext } from './contexts/ApiKeyContext';
import type { GeneratedImage } from './types';
import { InfoIcon } from './components/Icons';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { apiKey, isLoading: isKeyLoading } = useContext(ApiKeyContext);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setError("API Key is not set. Please add it in the settings.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);

    try {
      const imageUrl = await generateImage(prompt, apiKey);
      setImages(prevImages => [{ src: imageUrl, prompt }, ...prevImages]);
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
        <main className="mt-8 space-y-8">
          {!isKeyLoading && !apiKey && (
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600/50 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm" role="alert">
              <div className="flex items-center">
                <InfoIcon />
                <p className="ml-3 font-medium">
                  Your Hugging Face API key is not set.
                  <button onClick={() => setIsSettingsOpen(true)} className="ml-2 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">Set it here</button> to begin.
                </p>
              </div>
            </div>
          )}
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          <ImageDisplay 
            images={images} 
            isLoading={isLoading} 
            error={error} 
            isQuotaError={isQuotaError}
          />
        </main>
        {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      </div>
    </div>
  );
}

export default App;
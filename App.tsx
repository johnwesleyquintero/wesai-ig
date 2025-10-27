import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/clientService';
// FIX: Import ModelType to manage model selection state.
import type { GeneratedImage, ModelType } from './types';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  
  // FIX: Removed state related to settings modal and API key UI.
  // FIX: Added state for model and aspect ratio selection.
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash-image');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');


  // FIX: Updated handleGenerate to call the new Gemini backend service via clientService.
  // It no longer requires an API key from the client.
  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages([]);
    setLastPrompt('');

    try {
      const generatedImageUrls = await generateImage(prompt, model, aspectRatio);
      const formattedImages = generatedImageUrls.map(url => ({ src: url }));
      setImages(formattedImages);
      setLastPrompt(prompt);
    } catch (err) {
      let finalMessage = "Failed to generate image: An unknown error occurred.";
      if (err instanceof Error) {
          finalMessage = `Failed to generate image: ${err.message}`;
      }
      setError(finalMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [model, aspectRatio]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        {/* FIX: Header no longer needs onOpenSettings prop. */}
        <Header />
        <main className="mt-8 space-y-12">
          {/* FIX: Pass model and aspect ratio props to PromptInput. */}
          <PromptInput
            onGenerate={handleGenerate}
            isLoading={isLoading}
            selectedModel={model}
            onSelectModel={setModel}
            selectedRatio={aspectRatio}
            onSelectRatio={setAspectRatio}
          />
          {/* FIX: Removed isQuotaError prop as it was specific to the old API. */}
          <ImageDisplay images={images} isLoading={isLoading} error={error} prompt={lastPrompt} />
        </main>
        {/* FIX: Removed SettingsModal component. */}
      </div>
    </div>
  );
}

export default App;

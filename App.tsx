import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { useApiKey } from './contexts/ApiKeyContext';
import { generateImage } from './services/clientService';
import type { GeneratedImage } from './types';

export type ModelType = 'gemini-2.5-flash-image' | 'imagen-4.0-generate-001';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-2.5-flash-image');
  const { apiKey } = useApiKey();

  const handleGenerate = useCallback(async (prompt: string, aspectRatio: string, model: ModelType) => {
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
    setIsQuotaError(false);
    setImages([]);
    setLastPrompt('');
    setSelectedModel(model);

    try {
      const generatedImageUrls = await generateImage(prompt, apiKey, aspectRatio, model);
      const formattedImages = generatedImageUrls.map(url => ({ src: url }));
      setImages(formattedImages);
      setLastPrompt(prompt);
    } catch (err) {
      const defaultMessage = "Failed to generate image: An unknown error occurred.";
      let finalMessage = defaultMessage;
      let isQuota = false;

      if (err instanceof Error) {
          try {
              // Errors from our clientService are stringified JSON from our API route
              const errorData = JSON.parse(err.message);
              // Our API route returns an object like { message: "...", error: {...} }
              const messageFromServer = errorData.message || 'No specific error message provided.';

              if (messageFromServer.includes('billed users')) {
                  finalMessage = "Billing required: The Imagen API is only accessible to billed users. Please enable billing in your Google Cloud project.";
                  isQuota = true;
              } else if (messageFromServer.includes('quota') || messageFromServer.includes('RESOURCE_EXHAUSTED')) {
                  finalMessage = "You've exceeded your current API quota.";
                  isQuota = true;
              } else {
                  finalMessage = `Failed to generate image: ${messageFromServer}`;
              }
          } catch (parseError) {
              // Not a JSON error from our API, just show the raw message
              finalMessage = `Failed to generate image: ${err.message}`;
          }
      }
      
      setError(finalMessage);
      setIsQuotaError(isQuota);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header model={selectedModel} />
        <main className="mt-8 space-y-12">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} isApiKeySet={!!apiKey} />
          <ImageDisplay images={images} isLoading={isLoading} error={error} isQuotaError={isQuotaError} prompt={lastPrompt} model={selectedModel} />
        </main>
      </div>
    </div>
  );
}

export default App;
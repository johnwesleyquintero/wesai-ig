import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/clientService';
import type { GeneratedImage, ModelType } from './types';
import ModelSelector from './components/ModelSelector';
import AspectRatioSelector from './components/AspectRatioSelector';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash-image');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

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
      // FIX: Pass model and aspectRatio to the updated generateImage service.
      const generatedImageUrls = await generateImage(
        prompt,
        model,
        model === 'imagen-4.0-generate-001' ? aspectRatio : undefined
      );
      const formattedImages = generatedImageUrls.map(url => ({ src: url }));
      setImages(formattedImages);
      setLastPrompt(prompt);
    } catch (err) {
      let finalMessage = "Failed to generate image: An unknown error occurred.";

      if (err instanceof Error) {
          try {
              // Errors from our clientService are stringified JSON from our API route
              const errorData = JSON.parse(err.message);
              // Our API route returns an object like { message: "...", error: {...} }
              const messageFromServer = errorData.message || 'No specific error message provided.';
              
              if (messageFromServer.includes('API key not valid')) {
                  finalMessage = "Authorization failed. Please ensure the server API key is configured correctly.";
              } else {
                  finalMessage = `Failed to generate image: ${messageFromServer}`;
              }
          } catch (parseError) {
              // Not a JSON error from our API, just show the raw message
              finalMessage = `Failed to generate image: ${err.message}`;
          }
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
        <Header />
        <main className="mt-8 space-y-12">
          <div className="flex flex-col items-center gap-8">
            <ModelSelector selectedModel={model} onSelectModel={setModel} />
            {model === 'imagen-4.0-generate-001' && (
                <AspectRatioSelector selectedRatio={aspectRatio} onSelectRatio={setAspectRatio} />
            )}
          </div>
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          <ImageDisplay images={images} isLoading={isLoading} error={error} prompt={lastPrompt} />
        </main>
      </div>
    </div>
  );
}

export default App;

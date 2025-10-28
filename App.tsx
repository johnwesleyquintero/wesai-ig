import React, { useState, useCallback, useContext, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { generateImageWithGemini } from './services/geminiService';
import { generateImageWithHuggingFace } from './services/clientService';
import { ApiKeyContext } from './contexts/ApiKeyContext';
import type { GeneratedImage, GenerationModel, AspectRatio } from './types';
import { InfoIcon } from './components/Icons';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { geminiApiKey, huggingFaceApiKey, isKeyLoading } = useContext(ApiKeyContext);

  // Load images from localStorage on initial render
  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('wesai_image_library');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    } catch (e) {
      console.error("Failed to parse images from localStorage", e);
      localStorage.removeItem('wesai_image_library'); // Clear corrupted data
    }
  }, []);

  const handleGenerate = useCallback(async (prompt: string, model: GenerationModel, aspectRatio: AspectRatio) => {
    const activeApiKey = model === 'gemini' ? geminiApiKey : huggingFaceApiKey;
    if (!activeApiKey) {
      setError(`API Key for ${model === 'gemini' ? 'Google Gemini' : 'Hugging Face'} is not set.`);
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);

    try {
      let imageUrl;
      if (model === 'gemini') {
        try {
          imageUrl = await generateImageWithGemini(prompt, geminiApiKey!, aspectRatio);
        } catch (geminiErr) {
          // Smart Failover: If Gemini fails with a quota error and HF key exists, try HF.
          const isGeminiQuotaError = geminiErr instanceof Error && (geminiErr.message.includes('quota') || geminiErr.message.includes('billing'));
          if (isGeminiQuotaError && huggingFaceApiKey) {
            console.log("Gemini quota error, attempting fallback to Hugging Face...");
            imageUrl = await generateImageWithHuggingFace(prompt, huggingFaceApiKey);
          } else {
            throw geminiErr; // Re-throw other Gemini errors
          }
        }
      } else {
        imageUrl = await generateImageWithHuggingFace(prompt, huggingFaceApiKey!);
      }

      setImages(prevImages => {
        const newImage: GeneratedImage = { id: Date.now().toString(), src: imageUrl, prompt };
        const updatedImages = [newImage, ...prevImages];
        localStorage.setItem('wesai_image_library', JSON.stringify(updatedImages));
        return updatedImages;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("billing")) {
        setIsQuotaError(true);
      }
      setError(`Failed to generate image: ${message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [geminiApiKey, huggingFaceApiKey]);

  const handleDeleteImage = (idToDelete: string) => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter(img => img.id !== idToDelete);
      localStorage.setItem('wesai_image_library', JSON.stringify(updatedImages));
      return updatedImages;
    });
  };

  const handleSaveEditedImage = (originalPrompt: string, editPrompt: string, editedSrc: string) => {
    setImages(prevImages => {
      const newPrompt = `Edit: "${editPrompt}" -- (Original: ${originalPrompt})`;
      const newImage: GeneratedImage = { id: Date.now().toString(), src: editedSrc, prompt: newPrompt };
      const updatedImages = [newImage, ...prevImages];
      localStorage.setItem('wesai_image_library', JSON.stringify(updatedImages));
      return updatedImages;
    });
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col items-center font-sans p-4 sm:p-6">
      <div className="w-full max-w-4xl" aria-busy={isLoading}>
        <Header 
          onSettingsClick={() => setIsSettingsOpen(true)} 
          onHelpClick={() => setIsHelpOpen(true)}
        />
        <main className="mt-8 space-y-8">
          {!isKeyLoading && !geminiApiKey && !huggingFaceApiKey && (
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600/50 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm" role="alert">
              <div className="flex items-center">
                <InfoIcon />
                <p className="ml-3 font-medium">
                  No API keys are set. 
                  <button onClick={() => setIsSettingsOpen(true)} className="ml-2 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">Set one here</button> to begin.
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
            onDeleteImage={handleDeleteImage}
            onSaveEditedImage={handleSaveEditedImage}
          />
        </main>
        {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />} 
      </div>
    </div>
  );
}

export default App;
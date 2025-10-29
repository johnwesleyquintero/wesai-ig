import React, { useState, useCallback, useContext, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { generateImageWithGemini } from './services/geminiService';
import { generateImageWithHuggingFace } from './services/clientService';
import { generateImageWithStabilityAI } from './services/stabilityService';
import { ApiKeyContext } from './contexts/ApiKeyContext';
import type { GeneratedImage, GenerationModel, AspectRatio } from './types';
import { InfoIcon } from './components/Icons';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [images, setImages] = useLocalStorage<GeneratedImage[]>('wesai_image_library', []);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { geminiApiKey, huggingFaceApiKey, stabilityApiKey, isKeyLoading } = useContext(ApiKeyContext);
  const [hasVisited, setHasVisited] = useLocalStorage<boolean>('wesai_has_visited', false);

  // Proactive onboarding for first-time users
  useEffect(() => {
    if (!isKeyLoading && !geminiApiKey && !huggingFaceApiKey && !stabilityApiKey && !hasVisited) {
      setIsSettingsOpen(true);
      setHasVisited(true);
    }
  }, [isKeyLoading, geminiApiKey, huggingFaceApiKey, stabilityApiKey, hasVisited, setHasVisited]);


  const handleGenerate = useCallback(async (promptToGenerate: string, model: GenerationModel, aspectRatio: AspectRatio) => {
    let activeApiKey: string | null = null;
    if (model === 'gemini') activeApiKey = geminiApiKey;
    if (model === 'huggingface') activeApiKey = huggingFaceApiKey;
    if (model === 'stabilityai') activeApiKey = stabilityApiKey;
    
    if (!activeApiKey) {
      setError(`API Key for ${model} is not set.`);
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);

    try {
      let imageUrl;
      // For non-Gemini models, force aspect ratio to 1:1 as they don't support others.
      const finalAspectRatio = model === 'gemini' ? aspectRatio : '1:1';

      if (model === 'gemini') {
        try {
          imageUrl = await generateImageWithGemini(promptToGenerate, geminiApiKey!, finalAspectRatio);
        } catch (geminiErr) {
          // Smart Failover: If Gemini fails, try Stability AI if key exists.
          const isGeminiQuotaError = geminiErr instanceof Error && (geminiErr.message.includes('quota') || geminiErr.message.includes('billing'));
          if (isGeminiQuotaError && stabilityApiKey) {
            console.log("Gemini quota error, attempting fallback to Stability AI...");
            imageUrl = await generateImageWithStabilityAI(promptToGenerate, stabilityApiKey, '1:1');
          } else {
            throw geminiErr; // Re-throw other Gemini errors
          }
        }
      } else if (model === 'stabilityai') {
        imageUrl = await generateImageWithStabilityAI(promptToGenerate, stabilityApiKey!, '1:1');
      }
      else {
        imageUrl = await generateImageWithHuggingFace(promptToGenerate, huggingFaceApiKey!);
      }

      setImages(prevImages => {
        const newImage: GeneratedImage = { id: Date.now().toString(), src: imageUrl, prompt: promptToGenerate };
        return [newImage, ...prevImages];
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";

      if (message === "ASPECT_RATIO_BILLING_ERROR") {
        setError("Aspect ratio selection uses a Pro model that requires a billed Google AI account. Please enable billing or use the default 1:1 ratio.");
        setIsQuotaError(true);
      } else {
        if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("billing")) {
          setIsQuotaError(true);
        }
        setError(`Failed to generate image: ${message}`);
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [geminiApiKey, huggingFaceApiKey, stabilityApiKey, setImages]);

  const handleDeleteImage = (idToDelete: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== idToDelete));
  };
  
  const handleUsePrompt = (newPrompt: string) => {
    setPrompt(newPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEditedImage = (originalPrompt: string, editPrompt: string, editedSrc: string) => {
    setImages(prevImages => {
      const newPrompt = `Edit: "${editPrompt}" -- (Original: ${originalPrompt})`;
      const newImage: GeneratedImage = { id: Date.now().toString(), src: editedSrc, prompt: newPrompt };
      return [newImage, ...prevImages];
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
          {!isKeyLoading && !geminiApiKey && !huggingFaceApiKey && !stabilityApiKey && (
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
          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />
          <ImageDisplay 
            images={images} 
            isLoading={isLoading}
            prompt={prompt}
            error={error} 
            isQuotaError={isQuotaError}
            onDeleteImage={handleDeleteImage}
            onSaveEditedImage={handleSaveEditedImage}
            onUsePrompt={handleUsePrompt}
          />
        </main>
        <footer className="text-center mt-12">
            <p className="text-xs text-slate-400 dark:text-slate-500">
                WesAI Image Generator v3.1
            </p>
        </footer>
        {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />} 
      </div>
    </div>
  );
}

export default App;
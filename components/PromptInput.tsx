import React, { useState, useContext, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import SamplePrompts from './SamplePrompts';
import ModelSelector from './ModelSelector';
import AspectRatioSelector from './AspectRatioSelector';
import { ApiKeyContext } from '../contexts/ApiKeyContext';
import { GenerationModel, AspectRatio } from '../types';
import { ClearInputIcon, MagicWandIcon } from './Icons';
import { enhancePrompt } from '../services/promptService';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (prompt: string, model: GenerationModel, aspectRatio: AspectRatio, negativePrompt?: string) => void;
  isLoading: boolean;
  showToast: (message: string) => void;
}

const PROMPT_MAX_LENGTH = 1000;
const NEGATIVE_PROMPT_MAX_LENGTH = 1000;

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading, showToast }) => {
  const [selectedModel, setSelectedModel] = useState<GenerationModel>('gemini');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [showNegativePrompt, setShowNegativePrompt] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const { geminiApiKey, huggingFaceApiKey, stabilityApiKey } = useContext(ApiKeyContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  let isApiKeySet = false;
  if (selectedModel === 'gemini') isApiKeySet = !!geminiApiKey;
  else if (selectedModel === 'huggingface') isApiKeySet = !!huggingFaceApiKey;
  else if (selectedModel === 'stabilityai') isApiKeySet = !!stabilityApiKey;
  
  const isGenerating = isLoading || isEnhancing;

  // Auto-resize textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 112; // h-28 in pixels
      const maxHeight = 240; // max height in pixels before scrolling
      textarea.style.height = `${Math.max(minHeight, Math.min(scrollHeight, maxHeight))}px`;
    }
  }, [prompt]);


  // Reset aspect ratio and hide negative prompt if they become unsupported by the selected model
  useEffect(() => {
    if (selectedModel !== 'gemini') {
        if (selectedAspectRatio !== '1:1') {
          setSelectedAspectRatio('1:1');
        }
        if (showNegativePrompt) {
          setShowNegativePrompt(false);
        }
    }
  }, [selectedModel, selectedAspectRatio, showNegativePrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGenerating && isApiKeySet) {
      const finalNegativePrompt = selectedModel === 'gemini' ? negativePrompt : '';
      onGenerate(prompt, selectedModel, selectedAspectRatio, finalNegativePrompt);
    }
  };
  
  const handleSelectSample = (sample: string) => {
    setPrompt(sample);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || !geminiApiKey) {
        showToast("Enter a prompt and set your Gemini key to use Magic Prompt.");
        return;
    }
    setIsEnhancing(true);
    try {
        const enhanced = await enhancePrompt(prompt, geminiApiKey);
        setPrompt(enhanced);
        showToast("Prompt enhanced with AI magic!");
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        showToast(`Magic Prompt Error: ${message}`);
        console.error(error);
    } finally {
        setIsEnhancing(false);
    }
  };

  const getPlaceholderText = () => {
    if (!geminiApiKey && !huggingFaceApiKey && !stabilityApiKey) {
      return "Please set an API key in the settings to start...";
    }
    if (!isApiKeySet) {
      const modelName = {
        gemini: 'Google Gemini',
        huggingface: 'Hugging Face',
        stabilityai: 'Stability AI'
      }[selectedModel];
      return `Please set your ${modelName} key in settings...`;
    }
    return "e.g., A majestic lion wearing a crown, studio lighting...";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
      <div className="w-full">
        {/* Main Prompt */}
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full h-28 p-4 pr-10 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-all duration-150 ease-in-out dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-500 overflow-y-auto"
            disabled={isGenerating || (!geminiApiKey && !huggingFaceApiKey && !stabilityApiKey)}
            aria-label="Image generation prompt"
            maxLength={PROMPT_MAX_LENGTH}
            style={{ minHeight: '112px' }}
          />
          {prompt && !isGenerating && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Clear prompt"
            >
              <ClearInputIcon />
            </button>
          )}
        </div>
        <div className="flex justify-between items-center mt-1 pr-1">
            {selectedModel === 'gemini' ? (
                 <button 
                    type="button" 
                    onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                    className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                 >
                   {showNegativePrompt ? '- Hide negative prompt' : '+ Add negative prompt'}
                 </button>
            ) : <div />}
            <p className="text-right text-xs text-slate-400 dark:text-slate-500">
                {prompt.length} / {PROMPT_MAX_LENGTH}
            </p>
        </div>
        
        {/* Negative Prompt (Conditional) */}
        {showNegativePrompt && selectedModel === 'gemini' && (
            <div className="mt-2 animate-fade-in-scale">
                <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g., Deformed, blurry, extra limbs, text..."
                    className="w-full h-20 p-3 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-500"
                    disabled={isGenerating}
                    aria-label="Negative prompt"
                    maxLength={NEGATIVE_PROMPT_MAX_LENGTH}
                />
                 <p className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1 pr-1">
                    {negativePrompt.length} / {NEGATIVE_PROMPT_MAX_LENGTH}
                </p>
            </div>
        )}
      </div>
      
      <SamplePrompts prompts={samplePrompts} onSelect={handleSelectSample} />
      
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            <AspectRatioSelector 
                selectedRatio={selectedAspectRatio} 
                onRatioChange={setSelectedAspectRatio} 
                selectedModel={selectedModel}
            />
        </div>
        <div className="flex items-center justify-center gap-3">
            <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isGenerating || !prompt.trim() || !geminiApiKey}
                className="p-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                title="Enhance prompt with AI (Gemini required)"
            >
                {isEnhancing ? <Spinner /> : <MagicWandIcon />}
            </button>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim() || !isApiKeySet}
              className="w-full sm:w-auto px-8 py-3 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 focus:shadow-lg focus:shadow-purple-500/50"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                'Generate Image'
              )}
            </button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput;
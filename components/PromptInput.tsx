import React, { useState, useContext } from 'react';
import Spinner from './Spinner';
import SamplePrompts from './SamplePrompts';
import ModelSelector from './ModelSelector';
import AspectRatioSelector from './AspectRatioSelector';
import { ApiKeyContext } from '../contexts/ApiKeyContext';
import { GenerationModel, AspectRatio } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (prompt: string, model: GenerationModel, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
}

const PROMPT_MAX_LENGTH = 1000;

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  const [selectedModel, setSelectedModel] = useState<GenerationModel>('gemini');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
  const { geminiApiKey, huggingFaceApiKey, stabilityApiKey } = useContext(ApiKeyContext);

  let isApiKeySet = false;
  if (selectedModel === 'gemini') isApiKeySet = !!geminiApiKey;
  else if (selectedModel === 'huggingface') isApiKeySet = !!huggingFaceApiKey;
  else if (selectedModel === 'stabilityai') isApiKeySet = !!stabilityApiKey;

  // Reset aspect ratio if it becomes unsupported by the selected model
  React.useEffect(() => {
    if (selectedModel !== 'gemini' && selectedAspectRatio !== '1:1') {
      setSelectedAspectRatio('1:1');
    }
  }, [selectedModel, selectedAspectRatio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && isApiKeySet) {
      onGenerate(prompt, selectedModel, selectedAspectRatio);
    }
  };
  
  const handleSelectSample = (sample: string) => {
    setPrompt(sample);
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
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getPlaceholderText()}
          className="w-full h-28 p-4 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-500"
          disabled={isLoading || (!geminiApiKey && !huggingFaceApiKey && !stabilityApiKey)}
          aria-label="Image generation prompt"
          maxLength={PROMPT_MAX_LENGTH}
        />
        <p className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1 pr-1">
          {prompt.length} / {PROMPT_MAX_LENGTH}
        </p>
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
        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || !isApiKeySet}
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
    </form>
  );
};

export default PromptInput;
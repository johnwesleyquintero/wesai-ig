import React, { useState } from 'react';
import Spinner from './Spinner';
import SamplePrompts from './SamplePrompts';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  isApiKeySet: boolean;
}

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const PromptInput: React.FC<PromptInputProps> = ({ 
  onGenerate, 
  isLoading,
  isApiKeySet
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onGenerate(prompt);
    }
  };
  
  const handleSelectSample = (sample: string) => {
    setPrompt(sample);
  };

  const placeholderText = isApiKeySet
    ? "e.g., A majestic lion wearing a crown, studio lighting..."
    : "Please set your API key in settings before generating...";

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholderText}
        className="w-full h-28 p-4 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-500"
        disabled={isLoading || !isApiKeySet}
        aria-label="Image generation prompt"
      />
      
      <SamplePrompts prompts={samplePrompts} onSelect={handleSelectSample} />
      
      <button
        type="submit"
        disabled={isLoading || !prompt.trim() || !isApiKeySet}
        className="w-full sm:w-auto px-8 py-3 mt-2 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
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
    </form>
  );
};

export default PromptInput;
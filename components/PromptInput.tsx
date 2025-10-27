import React, { useState } from 'react';
import Spinner from './Spinner';
import SamplePrompts from './SamplePrompts';
import AspectRatioSelector from './AspectRatioSelector';

interface PromptInputProps {
  onGenerate: (prompt: string, aspectRatio: string) => void;
  isLoading: boolean;
  isApiKeySet: boolean;
}

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading, isApiKeySet }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && isApiKeySet) {
      onGenerate(prompt, aspectRatio);
    }
  };
  
  const handleSelectSample = (sample: string) => {
    setPrompt(sample);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={isApiKeySet ? "e.g., A majestic lion wearing a crown, studio lighting..." : "Please set your API key in the settings (gear icon) to enable generation."}
        className="w-full h-28 p-4 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
        disabled={isLoading || !isApiKeySet}
      />
      
      <SamplePrompts prompts={samplePrompts} onSelect={handleSelectSample} />
      
      <AspectRatioSelector selectedRatio={aspectRatio} onSelectRatio={setAspectRatio} />

      <button
        type="submit"
        disabled={isLoading || !prompt.trim() || !isApiKeySet}
        className="w-full sm:w-auto px-8 py-3 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
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
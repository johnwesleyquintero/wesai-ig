import React, { useState } from 'react';
import Spinner from './Spinner';
import SamplePrompts from './SamplePrompts';
// FIX: Import new components for model and aspect ratio selection.
import ModelSelector from './ModelSelector';
import AspectRatioSelector from './AspectRatioSelector';
import type { ModelType } from '../types';


interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  // FIX: Removed isApiKeySet and added props for model and aspect ratio management.
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading, selectedModel, onSelectModel, selectedRatio, onSelectRatio }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Simplified condition to check only for loading state.
    if (!isLoading) {
      onGenerate(prompt);
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
        // FIX: Updated placeholder text as API key is no longer required from the user.
        placeholder={"e.g., A majestic lion wearing a crown, studio lighting..."}
        className="w-full h-28 p-4 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
        // FIX: Removed isApiKeySet from disabled logic.
        disabled={isLoading}
      />
      
      <SamplePrompts prompts={samplePrompts} onSelect={handleSelectSample} />
      
      {/* FIX: Added Model and Aspect Ratio selectors to the UI. */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-8 my-4">
          <ModelSelector selectedModel={selectedModel} onSelectModel={onSelectModel} />
          {/* FIX: Conditionally render AspectRatioSelector only for the 'imagen' model which supports it. */}
          {selectedModel === 'imagen-4.0-generate-001' && (
            <AspectRatioSelector selectedRatio={selectedRatio} onSelectRatio={onSelectRatio} />
          )}
      </div>

      <button
        type="submit"
        // FIX: Removed isApiKeySet from disabled logic.
        disabled={isLoading || !prompt.trim()}
        className="w-full sm:w-auto px-8 py-3 mt-4 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
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

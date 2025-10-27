import React, { useState } from 'react';
import Spinner from './Spinner';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A majestic lion wearing a crown, studio lighting, hyperrealistic..."
        className="w-full h-28 p-4 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
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
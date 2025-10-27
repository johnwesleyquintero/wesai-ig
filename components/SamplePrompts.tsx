import React from 'react';

interface SamplePromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

const SamplePrompts: React.FC<SamplePromptsProps> = ({ prompts, onSelect }) => {
  return (
    <div className="w-full text-center my-2">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Need inspiration? Try one of these:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(prompt)}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {prompt.split(',')[0]}...
          </button>
        ))}
      </div>
    </div>
  );
};

export default SamplePrompts;
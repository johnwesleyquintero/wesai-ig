import React from 'react';

interface SamplePromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

const SamplePrompts: React.FC<SamplePromptsProps> = ({ prompts, onSelect }) => {
  return (
    <div className="w-full text-center my-2">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Need inspiration? Try one of these:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(prompt)}
            className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {prompt.split(',')[0]}...
          </button>
        ))}
      </div>
    </div>
  );
};

export default SamplePrompts;
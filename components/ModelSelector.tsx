import React from 'react';
import { GenerationModel } from '../types';

interface ModelSelectorProps {
  selectedModel: GenerationModel;
  onModelChange: (model: GenerationModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const getButtonClasses = (model: GenerationModel) => {
    return `w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
      selectedModel === model
        ? 'bg-pink-600 text-white shadow'
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
    }`;
  };

  return (
    <div className="w-full max-w-xs mx-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex space-x-1">
      <button
        onClick={() => onModelChange('gemini')}
        className={getButtonClasses('gemini')}
        aria-pressed={selectedModel === 'gemini'}
      >
        Gemini <span className="text-xs font-normal opacity-80">(Recommended)</span>
      </button>
      <button
        onClick={() => onModelChange('huggingface')}
        className={getButtonClasses('huggingface')}
        aria-pressed={selectedModel === 'huggingface'}
      >
        Hugging Face
      </button>
    </div>
  );
};

export default ModelSelector;

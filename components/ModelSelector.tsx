import React from 'react';
// FIX: Corrected the import path for ModelType. It's now imported from types.ts.
import type { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
}

const models: { id: ModelType; name: string; tier: string }[] = [
    { id: 'gemini-2.5-flash-image', name: 'Gemini Flash', tier: 'Free Tier' },
    { id: 'imagen-4.0-generate-001', name: 'Imagen 4', tier: 'Pro' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Model</label>
      <div className="flex flex-wrap justify-center gap-3">
        {models.map(model => (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelectModel(model.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-slate-900 ${
              selectedModel === model.id
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
            aria-pressed={selectedModel === model.id}
          >
            {model.name} <span className="text-xs opacity-80">({model.tier})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
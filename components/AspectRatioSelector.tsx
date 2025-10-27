import React from 'react';
// FIX: Import AspectRatioType for strong typing of props and local variables.
import type { AspectRatioType } from '../types';

interface AspectRatioSelectorProps {
  // FIX: Use the specific AspectRatioType for selectedRatio and the onSelectRatio callback.
  selectedRatio: AspectRatioType;
  onSelectRatio: (ratio: AspectRatioType) => void;
}

// FIX: Type the ratios array with AspectRatioType.
const ratios: AspectRatioType[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Aspect Ratio</label>
      <div className="flex flex-wrap justify-center gap-3">
        {ratios.map(ratio => (
          <button
            key={ratio}
            type="button"
            onClick={() => onSelectRatio(ratio)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-slate-900 ${
              selectedRatio === ratio
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
            aria-pressed={selectedRatio === ratio}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
import React from 'react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const ratios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Aspect Ratio</label>
      <div className="flex flex-wrap justify-center gap-3">
        {ratios.map(ratio => (
          <button
            key={ratio}
            type="button"
            onClick={() => onSelectRatio(ratio)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-900 ${
              selectedRatio === ratio
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
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
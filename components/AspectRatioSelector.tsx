import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  isDisabled: boolean;
}

const ratios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '3:4', label: 'Portrait' },
  { value: '16:9', label: 'Landscape' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, isDisabled }) => {
  const getButtonClasses = (ratio: AspectRatio) => {
    return `w-1/3 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
      selectedRatio === ratio && !isDisabled
        ? 'bg-pink-600 text-white shadow'
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
    }`;
  };

  return (
    <div 
        className={`w-full max-w-xs mx-auto transition-opacity duration-300 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isDisabled ? "Aspect ratio is only available for the Gemini model." : "Select aspect ratio"}
    >
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex space-x-1">
            {ratios.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onRatioChange(value)}
                    className={getButtonClasses(value)}
                    aria-pressed={selectedRatio === value}
                    disabled={isDisabled}
                >
                    {value} <span className="text-xs font-normal opacity-80 hidden sm:inline">{`(${label})`}</span>
                </button>
            ))}
        </div>
    </div>
  );
};

export default AspectRatioSelector;

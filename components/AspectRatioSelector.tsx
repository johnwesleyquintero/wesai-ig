import React from 'react';
import { AspectRatio, GenerationModel } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  selectedModel: GenerationModel;
}

const ratios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '3:4', label: 'Portrait' },
  { value: '16:9', label: 'Landscape' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, selectedModel }) => {
  
  const getButtonClasses = (ratioValue: AspectRatio, isSupported: boolean) => {
    const baseClasses = 'w-1/3 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
    if (!isSupported) {
        return `${baseClasses} bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60`;
    }
    if (selectedRatio === ratioValue) {
        return `${baseClasses} bg-pink-600 text-white shadow`;
    }
    return `${baseClasses} bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600`;
  };

  return (
    <div className="w-full max-w-xs mx-auto">
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex space-x-1">
            {ratios.map(({ value, label }) => {
                const isSupported = selectedModel === 'gemini' || value === '1:1';
                return (
                    <button
                        key={value}
                        onClick={() => onRatioChange(value)}
                        className={getButtonClasses(value, isSupported)}
                        aria-pressed={selectedRatio === value}
                        disabled={!isSupported}
                        title={!isSupported ? `Aspect ratio ${value} is only available for the Gemini model.` : `Set aspect ratio to ${value} (${label})`}
                    >
                        {value} <span className="text-xs font-normal opacity-80 hidden sm:inline">{`(${label})`}</span>
                    </button>
                )
            })}
        </div>
    </div>
  );
};

export default AspectRatioSelector;
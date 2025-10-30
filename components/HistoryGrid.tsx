import React from 'react';
import type { GeneratedImage } from '../types';
import { EyeIcon, UsePromptIcon, TrashIcon, BroomIcon } from './Icons';

interface HistoryGridProps {
  historyImages: GeneratedImage[];
  onClearHistory: () => void;
  setPreviewImage: (image: GeneratedImage) => void;
  onUsePrompt: (prompt: string) => void;
  onDeleteImage: (id: string) => void;
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ historyImages, onClearHistory, setPreviewImage, onUsePrompt, onDeleteImage }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Image History</h2>
        <button
          onClick={onClearHistory}
          className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200"
        >
          <BroomIcon /> Clear History
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {historyImages.map((image) => (
          <div
            key={image.id}
            className="group relative rounded-lg overflow-hidden shadow-md aspect-square bg-slate-100 dark:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
          >
            <img
              src={image.src}
              alt={image.prompt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPreviewImage(image)}
                  className="p-1.5 bg-black/50 rounded-full text-white hover:bg-pink-500 hover:scale-110 transition-all duration-200"
                  aria-label="Preview image"
                  title="Preview Image"
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => onUsePrompt(image.prompt)}
                  className="p-1.5 bg-black/50 rounded-full text-white hover:bg-purple-500 hover:scale-110 transition-all duration-200"
                  aria-label="Use as prompt"
                  title="Use as Prompt"
                >
                  <UsePromptIcon />
                </button>
                <button
                  onClick={() => onDeleteImage(image.id)}
                  className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 hover:scale-110 transition-all duration-200"
                  aria-label="Delete image"
                  title="Delete Image"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;

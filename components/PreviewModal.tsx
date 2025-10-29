import React from 'react';
import type { GeneratedImage } from '../types';
import { CloseIcon, DownloadIcon, UsePromptIcon } from './Icons';

interface PreviewModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ image, onClose, onUsePrompt }) => {

  const handleUsePrompt = () => {
    onUsePrompt(image.prompt);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 flex flex-col gap-4 max-h-[90vh] animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <h2 id="preview-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
                {image.prompt}
            </h2>
            <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0 ml-4"
                aria-label="Close preview"
            >
                <CloseIcon />
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900">
            <img
                src={image.src}
                alt={image.prompt}
                className="max-w-full max-h-full object-contain"
            />
        </div>
        
        <div className="flex-shrink-0 flex justify-end gap-3">
             <button
                onClick={handleUsePrompt}
                className="inline-flex items-center justify-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
            >
                <UsePromptIcon />
                <span className="ml-2">Use as Prompt</span>
             </button>
             <a
                href={image.src}
                download={`generated-image-${image.id}.jpeg`}
                className="inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-pink-600 rounded-lg shadow-md hover:bg-pink-700 transition-colors duration-200"
            >
                <DownloadIcon />
                <span>Download Image</span>
            </a>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
import React, { useState, useContext, useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { ApiKeyContext } from '../contexts/ApiKeyContext';
import { editImageWithGemini } from '../services/geminiService';
import { CloseIcon, RevertIcon, EditIcon } from './Icons';
import Spinner from './Spinner';

interface CanvasModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onSave: (originalPrompt: string, editPrompt: string, editedSrc: string) => void;
}

const CanvasModal: React.FC<CanvasModalProps> = ({ image, onClose, onSave }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [currentSrc, setCurrentSrc] = useState(image.src);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { geminiApiKey } = useContext(ApiKeyContext);

  const hasBeenEdited = currentSrc !== image.src;

  const handleGenerateEdit = async () => {
    if (!editPrompt.trim() || !geminiApiKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const newImageSrc = await editImageWithGemini(currentSrc, editPrompt, geminiApiKey);
      setCurrentSrc(newImageSrc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during editing.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if (hasBeenEdited) {
      onSave(image.prompt, editPrompt, currentSrc);
    }
    onClose();
  };

  const handleRevert = () => {
    setCurrentSrc(image.src);
    setError(null);
  };
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="canvas-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl p-4 sm:p-6 flex flex-col gap-4 max-h-[95vh] animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <h2 id="canvas-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Edit Image on The Canvas
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Original: {image.prompt}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0 ml-4"
            aria-label="Close editor"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Main Content: Image + Controls */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow min-h-0">
          {/* Image Display */}
          <div className="flex-grow flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 relative overflow-hidden md:w-2/3">
            <img
              src={currentSrc}
              alt={editPrompt || image.prompt}
              className="max-w-full max-h-full object-contain"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                <Spinner size="large" />
                <p className="mt-4">Applying your edit...</p>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col gap-4 md:w-1/3 flex-shrink-0">
            <div className="flex-grow flex flex-col gap-4">
              <label htmlFor="edit-prompt" className="font-semibold text-slate-700 dark:text-slate-200">
                Describe your edit
              </label>
              <textarea
                id="edit-prompt"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g., Change the background to a sunny beach..."
                className="w-full flex-grow p-3 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-colors duration-200 ease-in-out dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-500"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex-shrink-0 flex flex-col gap-2">
              <button
                onClick={handleGenerateEdit}
                disabled={isLoading || !editPrompt.trim() || !geminiApiKey}
                className="w-full flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? <Spinner /> : <EditIcon />}
                <span className="ml-2">{hasBeenEdited ? 'Generate Another Edit' : 'Generate Edit'}</span>
              </button>
              {hasBeenEdited && (
                  <button
                    onClick={handleRevert}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <RevertIcon />
                    Revert to Original
                  </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex-shrink-0 flex justify-end items-center gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
           <button onClick={onClose} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:underline">
            Cancel
           </button>
           <button
             onClick={handleSave}
             className="px-6 py-2.5 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
           >
            {hasBeenEdited ? 'Save & Close' : 'Close'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasModal;

import React from 'react';
import type { GeneratedImage } from '../types';
import useMockup from '../hooks/useMockup';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import MockupDisplay from './MockupDisplay';
import PreviewModal from './PreviewModal';
import CanvasModal from './CanvasModal';
import { CopyIcon, DownloadIcon, ImageIcon, TrashIcon, EditIcon, UsePromptIcon, MockupIcon, EyeIcon, BroomIcon } from './Icons';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  prompt: string;
  error: string | null;
  isQuotaError: boolean;
  onDeleteImage: (id: string) => void;
  onSaveEditedImage: (originalPrompt: string, editPrompt: string, editedSrc: string) => void;
  onUsePrompt: (prompt: string) => void;
  onClearHistory: () => void;
  showToast: (message: string) => void;
}

// Corresponds to the sample prompts in PromptInput.tsx
const sampleGallery = [
  {
    prompt: "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a1 1 0 100 2 1 1 0 000-2zm7 9a1 1 0 100 2 1 1 0 000-2zM5 11a1 1 0 100 2 1 1 0 000-2zM4.2 7.2a1 1 0 10-1.4 1.4 1 1 0 001.4-1.4zm17 0a1 1 0 10-1.4-1.4 1 1 0 001.4 1.4z'/%3E%3Cpath d='M2 18s4-3 8-1 8 1 8 1M2 21s4-3 8-1 8 1 8 1'/%3E%3C/svg%3E"
  },
  {
    prompt: "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 22V10M6 22V12M14 22V8M18 22V14'/%3E%3Cpath d='M12 10a2 2 0 00-2-2 2 2 0 00-2 2h4zm-4 4a2 2 0 00-2-2 2 2 0 00-2 2h4zm8-6a2 2 0 00-2-2 2 2 0 00-2 2h4zm4 6a2 2 0 00-2-2 2 2 0 00-2 2h4z'/%3E%3Cpath d='M4 4l4 4M20 4l-4 4'/%3E%3C/svg%3E"
  },
  {
    prompt: "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 22v-8M8 22v-12M12 22V2M16 22v-6M20 22v-10'/%3E%3Cpath d='M2 10h8M14 8h8M3 6l4-2M15 4l4-2'/%3E%3C/svg%3E"
  },
  {
    prompt: "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12h12v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zM18 12h2v4h-2zM6 8s1-4 4-4 4 4 4 4M8 4s1-4 4-4 4 4 4 4'/%3E%3C/svg%3E"
  }
];

const LatestImageSkeleton: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="space-y-12">
      <div>
        <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Generating...</h2>
            {prompt && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 truncate">Your prompt: "{prompt}"</p>}
        </div>
        <div className="relative p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md">
                <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-md bg-[length:200%_200%] animate-pulse-gradient"></div>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
                        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-md w-full sm:w-32"></div>
                        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-md w-full sm:w-32"></div>
                        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-md w-full sm:w-32"></div>
                        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-md w-full sm:w-32"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );


const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, prompt, error, isQuotaError, onDeleteImage, onSaveEditedImage, onUsePrompt, onClearHistory, showToast }) => {
  const [latestImage, ...historyImages] = images;
  const { mockupSrc, isCreatingMockup, createMockup } = useMockup(latestImage ? latestImage.src : null);
  const [previewImage, setPreviewImage] = React.useState<GeneratedImage | null>(null);
  const [editingImage, setEditingImage] = React.useState<GeneratedImage | null>(null);

  const handleCopyPrompt = () => {
      if (latestImage) {
        navigator.clipboard.writeText(latestImage.prompt);
        showToast('Prompt copied to clipboard!');
      }
  };
  
  const handleDownloadImage = (src: string, name: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Download started!");
  };


  return (
    <div aria-live="polite">
      {isLoading && <LatestImageSkeleton prompt={prompt} />}

      {error && <ErrorAlert message={error} isQuotaError={isQuotaError} />}

      {!isLoading && !error && latestImage && (
        <div className="space-y-12">
          {/* Original Image Display */}
          <div key={latestImage.id} className="animate-fade-in-scale">
            <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Latest Image</h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                   <img
                      src={latestImage.src}
                      alt={`Generated image for prompt: ${latestImage.prompt}`}
                      className="w-full h-auto object-cover rounded-md"
                   />
                   <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
                        <button onClick={handleCopyPrompt} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-transform duration-200 hover:scale-105">
                            <CopyIcon />
                            <span className="ml-2">Copy Prompt</span>
                        </button>
                        <button 
                            onClick={createMockup}
                            disabled={isCreatingMockup}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-transform duration-200 hover:scale-105"
                        >
                            {isCreatingMockup ? <Spinner /> : <MockupIcon />}
                            <span className="ml-1">{isCreatingMockup ? 'Creating...' : 'Mockup'}</span>
                        </button>
                        <button 
                            onClick={() => setEditingImage(latestImage)}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-transform duration-200 hover:scale-105"
                        >
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button
                           onClick={() => handleDownloadImage(latestImage.src, `generated-image-${Date.now()}.jpeg`)}
                           className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-transform duration-200 hover:scale-105"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </button>
                   </div>
                </div>
            </div>
          </div>
          
          {/* A+ Mockup Display (appears here when created) */}
          {mockupSrc && (
            <div className="animate-fade-in-scale">
              <MockupDisplay mockupSrc={mockupSrc} showToast={showToast} />
            </div>
          )}
          
          {/* Image Library */}
          {historyImages.length > 0 && (
            <div className="mt-16">
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
                    className="group relative rounded-lg overflow-hidden shadow-md aspect-square bg-slate-100 dark:bg-slate-800"
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
          )}
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="text-center p-8 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <ImageIcon />
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">Start with an Idea</p>
          <p className="text-slate-500 text-sm mt-1">Enter a prompt above or click an example below to begin.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sampleGallery.map((sample, index) => (
              <button
                key={index}
                onClick={() => onUsePrompt(sample.prompt)}
                className="group relative aspect-square bg-slate-200 dark:bg-slate-700/50 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-slate-800"
                title={`Use prompt: "${sample.prompt.substring(0, 50)}..."`}
              >
                <img
                  src={sample.src}
                  alt={sample.prompt.substring(0, 30)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 p-4"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold text-center p-1">Use Prompt</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {previewImage && (
        <PreviewModal 
          image={previewImage} 
          onClose={() => setPreviewImage(null)} 
          onUsePrompt={onUsePrompt} 
          showToast={showToast}
        />
      )}

      {editingImage && (
        <CanvasModal 
            image={editingImage} 
            onClose={() => setEditingImage(null)}
            onSave={onSaveEditedImage}
        />
      )}
    </div>
  );
};

export default ImageDisplay;
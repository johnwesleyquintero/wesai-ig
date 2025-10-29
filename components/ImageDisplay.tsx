import React from 'react';
import type { GeneratedImage } from '../types';
import useMockup from '../hooks/useMockup';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import MockupDisplay from './MockupDisplay';
import PreviewModal from './PreviewModal';
import CanvasModal from './CanvasModal';
import { CopyIcon, DownloadIcon, ImageIcon, TrashIcon, EditIcon, UsePromptIcon, MockupIcon } from './Icons';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  prompt: string;
  error: string | null;
  isQuotaError: boolean;
  onDeleteImage: (id: string) => void;
  onSaveEditedImage: (originalPrompt: string, editPrompt: string, editedSrc: string) => void;
  onUsePrompt: (prompt: string) => void;
  showToast: (message: string) => void;
}

const samplePrompts = [
  "A photorealistic portrait of an elderly fisherman with a weathered face, looking out at a stormy sea.",
  "An enchanted forest at twilight, glowing mushrooms, ethereal light filtering through ancient trees, fantasy art.",
  "A sleek, futuristic cityscape in the style of cyberpunk, flying vehicles and neon signs, cinematic lighting.",
  "A watercolor painting of a cozy cafe in Paris on a rainy day, people visible through the steamy window.",
];

const LatestImageSkeleton: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="space-y-12">
      <div>
        <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Generating...</h2>
            {prompt && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 truncate">Your prompt: "{prompt}"</p>}
        </div>
        <div className="relative p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg bg-[length:200%_200%] animate-pulse-gradient">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md">
                <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-md"></div>
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


const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, prompt, error, isQuotaError, onDeleteImage, onSaveEditedImage, onUsePrompt, showToast }) => {
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
  
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent parent button (preview) from being clicked
    action();
  };
  
  const handleTrySample = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    onUsePrompt(randomPrompt);
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
                        <a
                           href={latestImage.src}
                           download={`generated-image-${Date.now()}.jpeg`}
                           className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-transform duration-200 hover:scale-105"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </a>
                   </div>
                </div>
            </div>
          </div>
          
          {/* A+ Mockup Display (appears here when created) */}
          {mockupSrc && (
            <div className="animate-fade-in-scale">
              <MockupDisplay mockupSrc={mockupSrc} />
            </div>
          )}
          
          {/* Image Library */}
          {historyImages.length > 0 && (
            <div className="mt-16">
              <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Image Library</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {historyImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setPreviewImage(image)}
                    className="group relative rounded-lg overflow-hidden shadow-md aspect-square bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    aria-label="Preview image"
                  >
                    <img
                      src={image.src}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                      <p className="text-white text-xs text-center line-clamp-4">{image.prompt}</p>
                    </div>
                     <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-end gap-2 z-10">
                        <button
                            onClick={(e) => handleActionClick(e, () => onUsePrompt(image.prompt))}
                            className="p-1.5 bg-black/50 rounded-full text-white hover:bg-purple-500 hover:scale-110 transition-all duration-200"
                            aria-label="Use as prompt"
                            title="Use as Prompt"
                        >
                            <UsePromptIcon />
                        </button>
                        <button
                            onClick={(e) => handleActionClick(e, () => onDeleteImage(image.id))}
                            className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 hover:scale-110 transition-all duration-200"
                            aria-label="Delete image"
                            title="Delete Image"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="text-center p-12 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <ImageIcon />
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">Your masterpiece awaits.</p>
          <p className="text-slate-500 text-sm mt-1">Enter a prompt above or try one of our samples to begin.</p>
          <div className="mt-6">
            <button
                onClick={handleTrySample}
                className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
                Try a Sample Prompt
            </button>
          </div>
        </div>
      )}

      {previewImage && (
        <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} onUsePrompt={onUsePrompt} />
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
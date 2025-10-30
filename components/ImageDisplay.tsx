import React from 'react';
import type { GeneratedImage } from '../types';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import PreviewModal from './PreviewModal';
import CanvasModal from './CanvasModal';
import HistoryGrid from './HistoryGrid';
import EmptyState from './EmptyState';
import useMockup from '../hooks/useMockup';
import MockupDisplay from './MockupDisplay';
import { CopyIcon, DownloadIcon, EditIcon, MockupIcon } from './Icons';


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

const ImageDisplay: React.FC<ImageDisplayProps> = (props) => {
  const { images, isLoading, prompt, error, isQuotaError, onUsePrompt, showToast, onSaveEditedImage, onDeleteImage, onClearHistory } = props;
  
  const [latestImage, ...historyImages] = images;
  const [previewImage, setPreviewImage] = React.useState<GeneratedImage | null>(null);
  const [editingImage, setEditingImage] = React.useState<GeneratedImage | null>(null);
  
  const { mockupSrc, isCreatingMockup, createMockup } = useMockup(latestImage ? latestImage.src : null);

  const handleCopyPrompt = () => {
    if (!latestImage) return;
    let textToCopy = latestImage.prompt;
    if (latestImage.negativePrompt) {
        textToCopy += `\n\nNegative Prompt: ${latestImage.negativePrompt}`;
    }
    navigator.clipboard.writeText(textToCopy);
    showToast('Prompt copied to clipboard!');
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

  const renderResults = () => {
    if (!latestImage) return null;
    return (
        <div className="space-y-16">
            {/* Latest Image Section */}
            <div key={latestImage.id} className="animate-fade-in-scale">
                <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Latest Result</h2>
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

            {/* A+ Mockup Display */}
            {mockupSrc && (
                <div className="animate-fade-in-scale">
                    <MockupDisplay mockupSrc={mockupSrc} showToast={showToast} />
                </div>
            )}
            
            {/* History Grid */}
            {historyImages.length > 0 && (
                <HistoryGrid
                    historyImages={historyImages}
                    onClearHistory={onClearHistory}
                    onDeleteImage={onDeleteImage}
                    onUsePrompt={onUsePrompt}
                    setPreviewImage={setPreviewImage}
                />
            )}
        </div>
    );
  };

  return (
    <div aria-live="polite">
      {isLoading && <LatestImageSkeleton prompt={prompt} />}
      {error && <ErrorAlert message={error} isQuotaError={isQuotaError} />}

      {!isLoading && !error && images.length > 0 && renderResults()}
      {!isLoading && !error && images.length === 0 && <EmptyState onUsePrompt={onUsePrompt} />}

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
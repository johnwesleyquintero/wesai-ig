import React from 'react';
import type { GeneratedImage } from '../types';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import PreviewModal from './PreviewModal';
import CanvasModal from './CanvasModal';
import LatestImage from './LatestImage';
import HistoryGrid from './HistoryGrid';
import EmptyState from './EmptyState';

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
  const { images, isLoading, prompt, error, isQuotaError, onUsePrompt, showToast, onSaveEditedImage } = props;
  const [latestImage, ...historyImages] = images;
  const [previewImage, setPreviewImage] = React.useState<GeneratedImage | null>(null);
  const [editingImage, setEditingImage] = React.useState<GeneratedImage | null>(null);

  return (
    <div aria-live="polite">
      {isLoading && <LatestImageSkeleton prompt={prompt} />}
      {error && <ErrorAlert message={error} isQuotaError={isQuotaError} />}

      {!isLoading && !error && latestImage && (
        <div className="space-y-16">
            <LatestImage
                latestImage={latestImage}
                showToast={showToast}
                setEditingImage={setEditingImage}
            />

            {historyImages.length > 0 && (
                <HistoryGrid
                    historyImages={historyImages}
                    onClearHistory={props.onClearHistory}
                    onDeleteImage={props.onDeleteImage}
                    onUsePrompt={onUsePrompt}
                    setPreviewImage={setPreviewImage}
                />
            )}
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <EmptyState onUsePrompt={onUsePrompt} />
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
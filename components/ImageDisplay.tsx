import React from 'react';
import type { GeneratedImage } from '../types';
import useMockup from '../hooks/useMockup';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import MockupDisplay from './MockupDisplay';
import { CopyIcon, DownloadIcon, ImageIcon } from './Icons';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  isQuotaError: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, error, isQuotaError }) => {
  const [latestImage, ...historyImages] = images;
  const { mockupSrc, isCreatingMockup, createMockup } = useMockup(latestImage ? latestImage.src : null);
  const [copied, setCopied] = React.useState(false);

  const handleCopyPrompt = () => {
      if (latestImage) {
        navigator.clipboard.writeText(latestImage.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
  };
  
  // This wrapper will announce content changes to screen readers
  return (
    <div aria-live="polite">
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Spinner size="large" />
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Generating your masterpiece...</p>
          <p className="text-sm text-slate-500">This may take a moment.</p>
        </div>
      )}

      {error && <ErrorAlert message={error} isQuotaError={isQuotaError} />}

      {!isLoading && !error && latestImage && (
        <div className="space-y-12">
          {/* Original Image Display */}
          <div key={latestImage.src} className="animate-fade-in-scale">
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
                        <button onClick={handleCopyPrompt} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                            <CopyIcon />
                            <span className="ml-2">{copied ? 'Copied!' : 'Copy Prompt'}</span>
                        </button>
                        <a
                           href={latestImage.src}
                           download={`generated-image-${Date.now()}.jpeg`}
                           className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-colors duration-200"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </a>
                   </div>
                </div>
            </div>
          </div>

          {/* A+ Mockup Section */}
          <div className="text-center">
              {!mockupSrc && (
                  <button
                      onClick={createMockup}
                      disabled={isCreatingMockup}
                      className="px-8 py-3 flex items-center justify-center mx-auto font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                  >
                      {isCreatingMockup ? (
                          <>
                              <Spinner />
                              <span className="ml-2">Creating...</span>
                          </>
                      ) : (
                          'Create A+ Mockup'
                      )}
                  </button>
              )}
              
              {mockupSrc && <MockupDisplay mockupSrc={mockupSrc} />}
          </div>

          {/* Session History */}
          {historyImages.length > 0 && (
            <div className="mt-16">
              <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Session History</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {historyImages.map((image) => (
                  <div key={image.src} className="group relative rounded-lg overflow-hidden shadow-md aspect-square bg-slate-100 dark:bg-slate-800">
                    <img
                      src={image.src}
                      alt={`Generated image for prompt: ${image.prompt}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                      <p className="text-white text-xs text-center line-clamp-4">{image.prompt}</p>
                    </div>
                  </div>
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
          <p className="text-slate-500 text-sm mt-1">Enter a prompt above and let your imagination take flight.</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
import React from 'react';
import type { GeneratedImage } from '../types';
import type { ModelType } from '../App';
import useMockup from '../hooks/useMockup';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import MockupDisplay from './MockupDisplay';
import { CopyIcon, DownloadIcon, ImageIcon } from './Icons';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  prompt: string;
  isQuotaError?: boolean;
  model: ModelType;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, error, prompt, isQuotaError, model }) => {
  const { mockupSrc, isCreatingMockup, createMockup } = useMockup(images.length > 0 ? images[0].src : null);
  const [copied, setCopied] = React.useState(false);

  const handleCopyPrompt = () => {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };
  
  const isMockupDisabled = model === 'gemini-2.5-flash-image' || isCreatingMockup;
  
  // This wrapper will announce content changes to screen readers
  return (
    <div aria-live="polite">
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Spinner size="large" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Generating your masterpiece...</p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      )}

      {error && <ErrorAlert message={error} isQuotaError={isQuotaError} />}

      {!isLoading && !error && images.length > 0 && (
        <div className="space-y-12">
          {/* Original Image Display */}
          <div>
            <div className="flex justify-between items-center mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Generated Image</h2>
                <button onClick={handleCopyPrompt} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors duration-200">
                    <CopyIcon />
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {images.map((image, index) => (
                <div key={index} className="group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                   <img
                      src={image.src}
                      alt={`Generated image for prompt: ${prompt}`}
                      className="w-full h-auto object-cover rounded-md"
                   />
                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                     <a
                       href={image.src}
                       download={`generated-image-${Date.now()}.jpeg`}
                       className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95 hover:bg-gray-200"
                     >
                        <DownloadIcon />
                        Download
                     </a>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* A+ Mockup Section */}
          <div className="text-center">
              {!mockupSrc && (
                <div className="relative inline-block" title={isMockupDisabled && !isCreatingMockup ? "Mockup feature is optimized for the high-quality output of Imagen 4." : ""}>
                  <button
                      onClick={createMockup}
                      disabled={isMockupDisabled}
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
                </div>
              )}
              
              {mockupSrc && <MockupDisplay mockupSrc={mockupSrc} />}
          </div>
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <ImageIcon />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Your generated images will appear here.</p>
          <p className="text-gray-500 text-sm mt-1">Enter a prompt above and click "Generate Image" to start.</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
import React, { useState, useEffect, useCallback } from 'react';
import type { GeneratedImage } from '../types';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import MockupDisplay from './MockupDisplay';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  isQuotaError?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, error, isQuotaError }) => {
  const [mockupSrc, setMockupSrc] = useState<string | null>(null);
  const [isCreatingMockup, setIsCreatingMockup] = useState<boolean>(false);

  // When a new image is generated, clear the old mockup
  useEffect(() => {
    setMockupSrc(null);
  }, [images]);

  const handleCreateMockup = useCallback(async () => {
    if (images.length === 0) return;
    setIsCreatingMockup(true);

    try {
      const mockupDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for canvas with data URLs
        img.src = images[0].src;

        img.onload = () => {
          const A_PLUS_WIDTH = 970;
          const PADDING = 20;

          const scale = A_PLUS_WIDTH / img.width;
          const imgHeight = img.height * scale;

          const canvas = document.createElement('canvas');
          canvas.width = A_PLUS_WIDTH + PADDING * 2;
          canvas.height = imgHeight + PADDING * 2;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }

          // White background for the mockup page
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the generated image onto the canvas
          ctx.drawImage(img, PADDING, PADDING, A_PLUS_WIDTH, imgHeight);

          // Convert canvas to a high-quality JPEG
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        
        img.onerror = (err) => {
          reject(new Error('Failed to load image for mockup creation.'));
          console.error(err);
        };
      });
      setMockupSrc(mockupDataUrl);
    } catch (err) {
      console.error('Error creating mockup:', err);
      // We can add an error state for mockup creation if needed
    } finally {
      setIsCreatingMockup(false);
    }
  }, [images]);
  
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
  
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
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">Generated Image</h2>
            <div className="grid grid-cols-1 gap-8">
              {images.map((image, index) => (
                <div key={index} className="group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                   <img
                      src={image.src}
                      alt={`Generated image ${index + 1}`}
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
                  <button
                      onClick={handleCreateMockup}
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
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Your generated images will appear here.</p>
          <p className="text-gray-500 text-sm mt-1">Enter a prompt above and click "Generate Image" to start.</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
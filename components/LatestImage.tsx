import React from 'react';
import type { GeneratedImage } from '../types';
import useMockup from '../hooks/useMockup';
import Spinner from './Spinner';
import MockupDisplay from './MockupDisplay';
import { CopyIcon, DownloadIcon, EditIcon, MockupIcon } from './Icons';

interface LatestImageProps {
  latestImage: GeneratedImage;
  showToast: (message: string) => void;
  setEditingImage: (image: GeneratedImage) => void;
}

const LatestImage: React.FC<LatestImageProps> = ({ latestImage, showToast, setEditingImage }) => {
  const { mockupSrc, isCreatingMockup, createMockup } = useMockup(latestImage.src);
  
  const handleCopyPrompt = () => {
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

  return (
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
    </div>
  );
};

export default LatestImage;

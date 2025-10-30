import React from 'react';
import { ImageIcon } from './Icons';

interface EmptyStateProps {
  onUsePrompt: (prompt: string) => void;
}

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

const EmptyState: React.FC<EmptyStateProps> = ({ onUsePrompt }) => {
  return (
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
  );
};

export default EmptyState;

import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface HelpModalProps {
  onClose: () => void;
}

type ActiveTab = 'whats-new' | 'help-center';

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('whats-new');

  const tabButtonClasses = (tabName: ActiveTab) =>
    `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200 ${
      activeTab === tabName
        ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
          <h2 id="help-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Help & What's New
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close help modal"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2 mb-4">
                <button className={tabButtonClasses('whats-new')} onClick={() => setActiveTab('whats-new')}>What's New</button>
                <button className={tabButtonClasses('help-center')} onClick={() => setActiveTab('help-center')}>Help Center</button>
            </div>
        </div>

        <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300 overflow-y-auto max-h-[60vh]">
            {activeTab === 'whats-new' && (
                <div className="animate-fade-in-scale">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">v3.5: The Workflow & Polish Update</h3>
                    <ul className="list-disc list-inside space-y-3 mt-2">
                        <li>
                            <span className="font-semibold">Unified Results View:</span> Your latest image and history are now seamlessly combined into a single, unified results feed for a more intuitive browsing experience.
                        </li>
                        <li>
                            <span className="font-semibold">Streamlined Codebase:</span> We've consolidated our AI service logic, making the app faster, more reliable, and easier to maintain.
                        </li>
                        <li>
                           <span className="font-semibold">UI Refinements:</span> Small but meaningful design tweaks across the app create a cleaner and more polished interface.
                        </li>
                         <li>
                           <span className="font-semibold">Image Editing Canvas:</span> You can now perform iterative edits on your generated images in a dedicated editing canvas, powered by Gemini.
                        </li>
                    </ul>
                </div>
            )}

            {activeTab === 'help-center' && (
                <div className="animate-fade-in-scale space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">How do I get my API keys?</h4>
                        <p className="text-sm">This app requires API keys to function. They are stored securely in your browser.</p>
                        <ul className="text-sm list-disc list-inside mt-1">
                            <li><span className="font-semibold">Google Gemini:</span> Get your key from <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Google AI Studio</a>.</li>
                            <li><span className="font-semibold">Stability AI:</span> Get your key from the <a href="https://clipdrop.co/apis" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">ClipDrop API dashboard</a>.</li>
                             <li><span className="font-semibold">Hugging Face:</span> Get your key from your <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Hugging Face account settings</a>.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Which model should I use?</h4>
                        <p className="text-sm">We recommend starting with **Google Gemini** for speed and realism. **Stability AI** is excellent for more artistic and stylized images. **Hugging Face** is a solid fallback option.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">What is the 'A+ Mockup' feature?</h4>
                        <p className="text-sm">This feature takes your generated image and places it onto a white background, formatted for e-commerce A+ content modules, perfect for product listings.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Is it free to use?</h4>
                        <p className="text-sm">This application is free. However, image generation consumes credits on your provider accounts. All three services provide generous free tiers for getting started.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
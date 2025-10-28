import React, { useState } from 'react';

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Major Upgrade: Multi-Provider Engine</h3>
                    <ul className="list-disc list-inside space-y-3 mt-2">
                        <li>
                            <span className="font-semibold">Powered by Google Gemini:</span> We've integrated Google's powerful Imagen model as the new recommended engine for faster, higher-quality results.
                        </li>
                        <li>
                            <span className="font-semibold">Model Selection:</span> You can now choose between Google Gemini and Hugging Face models before generating an image.
                        </li>
                        <li>
                           <span className="font-semibold">Smart Failover:</span> If Gemini runs into a quota limit, the app will automatically try again with Hugging Face to keep you creating.
                        </li>
                         <li>
                            <span className="font-semibold">Persistent Image Library:</span> Your generated images are automatically saved to your browser. You can view your entire history and delete any images you no longer need.
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
                             <li><span className="font-semibold">Hugging Face:</span> Get your key from your <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Hugging Face account settings</a>.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Which model should I use?</h4>
                        <p className="text-sm">We recommend starting with **Google Gemini** for the best performance and quality. Hugging Face is an excellent fallback option.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">What is the 'A+ Mockup' feature?</h4>
                        <p className="text-sm">This feature takes your generated image and places it onto a white background, formatted for e-commerce A+ content modules, perfect for product listings.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Is it free to use?</h4>
                        <p className="text-sm">This application is free. However, image generation consumes credits on your Google and/or Hugging Face accounts. Both services provide generous free tiers for getting started.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

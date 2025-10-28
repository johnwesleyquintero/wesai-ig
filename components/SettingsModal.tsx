import React, { useState, useContext } from 'react';
import ApiKeyInput from './ApiKeyInput';
import { ApiKeyContext } from '../contexts/ApiKeyContext';
import { GenerationModel } from '../types';

interface SettingsModalProps {
  onClose: () => void;
}

type ActiveTab = GenerationModel;

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('gemini');
  const apiContext = useContext(ApiKeyContext);

  const tabButtonClasses = (tabName: ActiveTab) =>
    `px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200 w-1/3 ${
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
        aria-labelledby="settings-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
          <h2 id="settings-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Settings
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <button className={tabButtonClasses('gemini')} onClick={() => setActiveTab('gemini')}>Gemini</button>
                <button className={tabButtonClasses('stabilityai')} onClick={() => setActiveTab('stabilityai')}>Stability AI</button>
                <button className={tabButtonClasses('huggingface')} onClick={() => setActiveTab('huggingface')}>Hugging Face</button>
            </div>
        </div>

        <div>
            {activeTab === 'gemini' && (
                 <div className="animate-fade-in-scale">
                    <ApiKeyInput 
                        provider="gemini"
                        apiKey={apiContext.geminiApiKey}
                        setApiKey={apiContext.setGeminiApiKey}
                        isKeyValid={apiContext.isGeminiKeyValid}
                        isLoading={apiContext.isGeminiKeyLoading}
                        validateKey={apiContext.validateGeminiKey}
                    />
                 </div>
            )}
            {activeTab === 'stabilityai' && (
                 <div className="animate-fade-in-scale">
                    <ApiKeyInput 
                        provider="stabilityai"
                        apiKey={apiContext.stabilityApiKey}
                        setApiKey={apiContext.setStabilityApiKey}
                        isKeyValid={apiContext.isStabilityKeyValid}
                        isLoading={apiContext.isStabilityKeyLoading}
                        validateKey={apiContext.validateStabilityKey}
                    />
                 </div>
            )}
            {activeTab === 'huggingface' && (
                 <div className="animate-fade-in-scale">
                    <ApiKeyInput 
                        provider="huggingface"
                        apiKey={apiContext.huggingFaceApiKey}
                        setApiKey={apiContext.setHuggingFaceApiKey}
                        isKeyValid={apiContext.isHfKeyValid}
                        isLoading={apiContext.isHfKeyLoading}
                        validateKey={apiContext.validateHfKey}
                    />
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
import React, { useState, useContext, useEffect } from 'react';
import { ApiKeyContext } from '../contexts/ApiKeyContext';
import Spinner from './Spinner';

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey, isKeyValid, isLoading, validateKey } = useContext(ApiKeyContext);
  const [localKey, setLocalKey] = useState(apiKey || '');

  useEffect(() => {
    setLocalKey(apiKey || '');
  }, [apiKey]);
  
  const handleSave = () => {
    setApiKey(localKey);
    validateKey(localKey);
  };

  const getStatusIndicator = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (!apiKey) {
      return <span className="text-sm text-yellow-500">No key set</span>;
    }
    if (isKeyValid) {
      return <span className="text-sm text-green-500">✓ Valid</span>;
    }
    return <span className="text-sm text-red-500">✗ Invalid</span>;
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Hugging Face API Key
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="api-key-input"
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            className="flex-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-none rounded-l-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            placeholder="hf_..."
          />
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-l-0 border-pink-600 bg-pink-600 text-white rounded-r-md hover:bg-pink-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
         <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Get your key from your <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Hugging Face settings</a>. The key is stored only in your browser.
        </p>
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
        <span className="text-sm font-medium">Status:</span>
        {getStatusIndicator()}
      </div>
    </div>
  );
};

export default ApiKeyInput;

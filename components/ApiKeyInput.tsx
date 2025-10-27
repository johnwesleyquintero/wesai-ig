import React, { useState, useEffect } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

interface ApiKeyInputProps {
  onKeySaved?: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySaved }) => {
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setInputValue(apiKey || '');
  }, [apiKey]);
  
  const handleSave = () => {
    setApiKey(inputValue.trim());
    setIsSaved(true);
    // Hide the confirmation message and call the callback after a short delay
    setTimeout(() => {
        setIsSaved(false);
        if (onKeySaved) {
            onKeySaved();
        }
    }, 1500);
  };

  return (
    <div className="w-full">
      <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Google Gemini API Key
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          id="api-key-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your API key..."
          className="flex-grow p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={!inputValue.trim()}
        >
          Save & Close
        </button>
      </div>
       {isSaved && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
          API Key saved!
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Your key is stored only in your browser and is required to generate images.
      </p>
    </div>
  );
};

export default ApiKeyInput;

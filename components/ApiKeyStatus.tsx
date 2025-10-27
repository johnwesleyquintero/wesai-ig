import React, { useState, useCallback } from 'react';
import { getApiKeyStatus } from '../services/clientService';
import Spinner from './Spinner';

const ApiKeyStatus: React.FC = () => {
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMaskedKey(null);
    try {
      const status = await getApiKeyStatus();
      setMaskedKey(status.maskedKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="text-center mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleCheckStatus}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? <Spinner /> : 'Check API Key Status'}
        </button>
        <div className="h-8 flex items-center">
            {maskedKey && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Active Key:</span>{' '}
                <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">{maskedKey}</code>
            </p>
            )}
            {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
                <span className="font-semibold">Error:</span> {error}
            </p>
            )}
        </div>
      </div>
       <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        If you change your API key, redeploy and use this button to verify it has been updated on the server.
      </p>
    </div>
  );
};

export default ApiKeyStatus;

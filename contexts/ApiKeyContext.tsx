import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    // Get the key from localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('huggingface-api-key');
    }
    return null;
  });

  // Effect to update localStorage whenever the key changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('huggingface-api-key', apiKey);
    } else {
      localStorage.removeItem('huggingface-api-key');
    }
  }, [apiKey]);

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
  };

  const value = { apiKey, setApiKey };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
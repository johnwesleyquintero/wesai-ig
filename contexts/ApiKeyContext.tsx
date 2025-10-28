import React, { createContext, useState, useEffect, useCallback } from 'react';

// This is a lightweight model used just for validating the API key.
const VALIDATION_MODEL_ID = "google/flan-t5-small";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  isLoading: boolean;
  validateKey: (key: string) => void;
}

export const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  setApiKey: () => {},
  isKeyValid: false,
  isLoading: true,
  validateKey: () => {},
});

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const validateKey = useCallback(async (key: string) => {
    if (!key) {
      setIsKeyValid(false);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${VALIDATION_MODEL_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: "test" }),
      });
      // A successful ping (even with a model error for this input type) indicates the key is valid.
      // 401/403 means unauthorized.
      if (response.status !== 401 && response.status !== 403) {
        setIsKeyValid(true);
      } else {
        setIsKeyValid(false);
      }
    } catch (error) {
      console.error("API key validation failed:", error);
      setIsKeyValid(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    // On initial load, get key from localStorage and validate it.
    const storedKey = localStorage.getItem('hf_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
      validateKey(storedKey);
    } else {
      setIsLoading(false); // No key, not loading.
    }
  }, [validateKey]);

  const setApiKey = (key: string) => {
    if (key) {
      localStorage.setItem('hf_api_key', key);
      setApiKeyState(key);
    } else {
      localStorage.removeItem('hf_api_key');
      setApiKeyState(null);
    }
  };

  const value = { apiKey, setApiKey, isKeyValid, isLoading, validateKey };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

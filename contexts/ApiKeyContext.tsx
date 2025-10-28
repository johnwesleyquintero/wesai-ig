import React, { createContext, useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const HF_VALIDATION_MODEL_ID = "google/flan-t5-small";

interface ApiKeyContextType {
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
  isGeminiKeyValid: boolean;
  isGeminiKeyLoading: boolean;
  validateGeminiKey: (key: string) => void;
  
  huggingFaceApiKey: string | null;
  setHuggingFaceApiKey: (key: string) => void;
  isHfKeyValid: boolean;
  isHfKeyLoading: boolean;
  validateHfKey: (key: string) => void;

  isKeyLoading: boolean; // Overall loading status
}

export const ApiKeyContext = createContext<ApiKeyContextType>({
  geminiApiKey: null,
  setGeminiApiKey: () => {},
  isGeminiKeyValid: false,
  isGeminiKeyLoading: true,
  validateGeminiKey: () => {},

  huggingFaceApiKey: null,
  setHuggingFaceApiKey: () => {},
  isHfKeyValid: false,
  isHfKeyLoading: true,
  validateHfKey: () => {},
  
  isKeyLoading: true,
});

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);
  const [isGeminiKeyValid, setIsGeminiKeyValid] = useState<boolean>(false);
  const [isGeminiKeyLoading, setIsGeminiKeyLoading] = useState<boolean>(true);

  const [huggingFaceApiKey, setHuggingFaceApiKeyState] = useState<string | null>(null);
  const [isHfKeyValid, setIsHfKeyValid] = useState<boolean>(false);
  const [isHfKeyLoading, setIsHfKeyLoading] = useState<boolean>(true);

  const validateGeminiKey = useCallback(async (key: string) => {
    if (!key) {
      setIsGeminiKeyValid(false);
      setIsGeminiKeyLoading(false);
      return;
    }
    setIsGeminiKeyLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      // A lightweight call to list models to validate the key.
      await ai.models.list(); 
      setIsGeminiKeyValid(true);
    } catch (error) {
      console.error("Google Gemini API key validation failed:", error);
      setIsGeminiKeyValid(false);
    } finally {
      setIsGeminiKeyLoading(false);
    }
  }, []);

  const validateHfKey = useCallback(async (key: string) => {
    if (!key) {
      setIsHfKeyValid(false);
      setIsHfKeyLoading(false);
      return;
    }
    
    setIsHfKeyLoading(true);
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${HF_VALIDATION_MODEL_ID}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: "test" }),
      });
      if (response.status !== 401 && response.status !== 403) {
        setIsHfKeyValid(true);
      } else {
        setIsHfKeyValid(false);
      }
    } catch (error) {
      console.error("Hugging Face API key validation failed:", error);
      setIsHfKeyValid(false);
    } finally {
      setIsHfKeyLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('gemini_api_key');
    if (storedGeminiKey) {
      setGeminiApiKeyState(storedGeminiKey);
      validateGeminiKey(storedGeminiKey);
    } else {
      setIsGeminiKeyLoading(false);
    }

    const storedHfKey = localStorage.getItem('hf_api_key');
    if (storedHfKey) {
      setHuggingFaceApiKeyState(storedHfKey);
      validateHfKey(storedHfKey);
    } else {
      setIsHfKeyLoading(false);
    }
  }, [validateGeminiKey, validateHfKey]);

  const setGeminiApiKey = (key: string) => {
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setGeminiApiKeyState(key);
    } else {
      localStorage.removeItem('gemini_api_key');
      setGeminiApiKeyState(null);
    }
  };

  const setHuggingFaceApiKey = (key: string) => {
    if (key) {
      localStorage.setItem('hf_api_key', key);
      setHuggingFaceApiKeyState(key);
    } else {
      localStorage.removeItem('hf_api_key');
      setHuggingFaceApiKeyState(null);
    }
  };

  const value = {
    geminiApiKey,
    setGeminiApiKey,
    isGeminiKeyValid,
    isGeminiKeyLoading,
    validateGeminiKey,
    huggingFaceApiKey,
    setHuggingFaceApiKey,
    isHfKeyValid,
    isHfKeyLoading,
    validateHfKey,
    isKeyLoading: isGeminiKeyLoading || isHfKeyLoading,
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const HF_VALIDATION_MODEL_ID = "google/flan-t5-small";
const STABILITY_VALIDATION_URL = "https://clipdrop-api.co/text-to-image/v1";

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

  stabilityApiKey: string | null;
  setStabilityApiKey: (key: string) => void;
  isStabilityKeyValid: boolean;
  isStabilityKeyLoading: boolean;
  validateStabilityKey: (key: string) => void;

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
  
  stabilityApiKey: null,
  setStabilityApiKey: () => {},
  isStabilityKeyValid: false,
  isStabilityKeyLoading: true,
  validateStabilityKey: () => {},

  isKeyLoading: true,
});

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);
  const [isGeminiKeyValid, setIsGeminiKeyValid] = useState<boolean>(false);
  const [isGeminiKeyLoading, setIsGeminiKeyLoading] = useState<boolean>(true);

  const [huggingFaceApiKey, setHuggingFaceApiKeyState] = useState<string | null>(null);
  const [isHfKeyValid, setIsHfKeyValid] = useState<boolean>(false);
  const [isHfKeyLoading, setIsHfKeyLoading] = useState<boolean>(true);
  
  const [stabilityApiKey, setStabilityApiKeyState] = useState<string | null>(null);
  const [isStabilityKeyValid, setIsStabilityKeyValid] = useState<boolean>(false);
  const [isStabilityKeyLoading, setIsStabilityKeyLoading] = useState<boolean>(true);

  const validateGeminiKey = useCallback(async (key: string) => {
    if (!key) {
      setIsGeminiKeyValid(false);
      setIsGeminiKeyLoading(false);
      return;
    }
    setIsGeminiKeyLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
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

  const validateStabilityKey = useCallback(async (key: string) => {
    if (!key) {
      setIsStabilityKeyValid(false);
      setIsStabilityKeyLoading(false);
      return;
    }
    setIsStabilityKeyLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', 'test');
      const response = await fetch(STABILITY_VALIDATION_URL, {
        method: 'POST',
        headers: { 'x-api-key': key },
        body: formData,
      });
      // A 400 response means the key is valid but the prompt is bad (which is fine for a check).
      // A 401 means the key is invalid.
      if (response.status !== 401) {
        setIsStabilityKeyValid(true);
      } else {
        setIsStabilityKeyValid(false);
      }
    } catch (error) {
      console.error("Stability AI API key validation failed:", error);
      setIsStabilityKeyValid(false);
    } finally {
      setIsStabilityKeyLoading(false);
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

    const storedStabilityKey = localStorage.getItem('stability_api_key');
    if (storedStabilityKey) {
      setStabilityApiKeyState(storedStabilityKey);
      validateStabilityKey(storedStabilityKey);
    } else {
      setIsStabilityKeyLoading(false);
    }
  }, [validateGeminiKey, validateHfKey, validateStabilityKey]);

  const setGeminiApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setGeminiApiKeyState(key);
  };

  const setHuggingFaceApiKey = (key: string) => {
    localStorage.setItem('hf_api_key', key);
    setHuggingFaceApiKeyState(key);
  };
  
  const setStabilityApiKey = (key: string) => {
    localStorage.setItem('stability_api_key', key);
    setStabilityApiKeyState(key);
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
    stabilityApiKey,
    setStabilityApiKey,
    isStabilityKeyValid,
    isStabilityKeyLoading,
    validateStabilityKey,
    isKeyLoading: isGeminiKeyLoading || isHfKeyLoading || isStabilityKeyLoading,
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};
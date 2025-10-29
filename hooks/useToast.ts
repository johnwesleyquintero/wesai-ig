import { useState, useCallback, useEffect } from 'react';

const useToast = (duration: number = 2000) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  // Fix: Use ReturnType<typeof setTimeout> for browser-compatible timeout ID type.
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    setTimeoutId(newTimeoutId);
  }, [duration, timeoutId]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    isToastVisible: isVisible,
    toastMessage: message,
    showToast,
  };
};

export default useToast;

import React, { useState, useEffect } from 'react';
import { CheckIcon } from './Icons';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  const onAnimationEnd = () => {
    if (!isVisible) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full shadow-lg ${isVisible ? 'animate-toast-in' : 'animate-toast-out'}`}
      onAnimationEnd={onAnimationEnd}
      role="status"
      aria-live="polite"
    >
      <CheckIcon />
      <span className="ml-2 text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;

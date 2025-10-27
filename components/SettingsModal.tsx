import React from 'react';
import ApiKeyInput from './ApiKeyInput';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Use a state to control the animation classes for smooth transitions
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Use a short timeout to allow the component to mount before adding the 'show' class
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  // Effect for keyboard accessibility (closing with Escape key)
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-40 flex justify-center items-center transition-opacity duration-300 ease-in-out ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"></div>
        <div 
            className={`bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative transform transition-all duration-300 ease-in-out ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} 
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                <h2 id="settings-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Close settings"
                >
                    <CloseIcon />
                </button>
            </div>
            <ApiKeyInput onKeySaved={onClose} />
        </div>
    </div>
  );
};

export default SettingsModal;
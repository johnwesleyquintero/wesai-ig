import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import SettingsModal from './SettingsModal';
import type { ModelType } from '../App';

const GearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    model: ModelType;
}

const Header: React.FC<HeaderProps> = ({ model }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modelName = model === 'imagen-4.0-generate-001' ? 'Imagen 4' : 'Gemini Flash';

    return (
    <>
      <header className="text-center relative">
        <div className="absolute top-0 right-0 flex items-center gap-2">
            <ThemeSwitcher />
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200"
                aria-label="Open settings"
            >
                <GearIcon />
            </button>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          WesAI Image Generator
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Powered by Google's {modelName}
        </p>
      </header>
      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
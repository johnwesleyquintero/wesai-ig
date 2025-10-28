import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { SettingsIcon } from './Icons';

interface HeaderProps {
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
    return (
    <>
      <header className="text-center relative">
        <div className="absolute top-0 right-0 flex items-center gap-2">
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors duration-200"
                aria-label="Open settings"
            >
                <SettingsIcon />
            </button>
            <ThemeSwitcher />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          WesAI Image Generator
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Powered by Hugging Face
        </p>
      </header>
    </>
  );
};

export default Header;
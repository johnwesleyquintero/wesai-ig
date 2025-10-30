import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { SettingsIcon, HelpIcon } from './Icons';

interface HeaderProps {
    onSettingsClick: () => void;
    onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onHelpClick }) => {
    return (
      <header className="w-full flex flex-col items-center pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Actions group - right aligned at the top */}
        <div className="w-full flex items-center justify-end gap-2 mb-4">
            <ThemeSwitcher />
            <button
                onClick={onHelpClick}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors duration-200"
                aria-label="Open help and what's new"
            >
               <HelpIcon />
            </button>
            <button
                onClick={onSettingsClick}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors duration-200"
                aria-label="Open settings"
            >
               <SettingsIcon />
            </button>
        </div>

        {/* Title and Subtitle - centered */}
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              WesAI Image Generator
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Powered by Gemini, Stability AI & Hugging Face
            </p>
        </div>
      </header>
  );
};

export default Header;
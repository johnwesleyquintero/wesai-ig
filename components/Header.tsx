import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
// FIX: Removed SettingsIcon as the settings button is no longer needed.
// import { SettingsIcon } from './Icons';

// FIX: The component no longer needs props.
const Header: React.FC = () => {
    return (
    <>
      <header className="text-center relative">
        <div className="absolute top-0 right-0 flex items-center gap-2">
            {/* FIX: Removed the settings button. */}
            <ThemeSwitcher />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          WesAI Image Generator
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {/* FIX: Updated powered by attribution to Google Gemini. */}
          Powered by Google Gemini
        </p>
      </header>
    </>
  );
};

export default Header;

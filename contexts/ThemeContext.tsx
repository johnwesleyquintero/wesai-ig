import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'; // Default for SSR
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the user's explicit theme choice ('light', 'dark', or 'system')
  const [theme, setThemeState] = useState<Theme>(() => {
    // On initial load, try to get the theme from localStorage, otherwise default to 'system'
    return (localStorage.getItem('theme') as Theme | null) || 'system';
  });

  // State to track the system's current theme preference
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Effect to listen for changes in system preference and update our state
  // This is more idiomatic React than manipulating the DOM directly in the listener.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Memoized value that resolves the final theme ('system' becomes the actual system theme)
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    return theme === 'system' ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Effect to apply the theme class to the <html> element whenever the resolved theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Function to update the theme state and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  const value = { theme, setTheme, resolvedTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
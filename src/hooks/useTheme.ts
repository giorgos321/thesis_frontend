import { useEffect, useState } from 'react';

// Create a custom event for theme changes
export const THEME_CHANGE_EVENT = 'themeChange';

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // Check localStorage on hook initialization
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Return saved theme or use system preference as fallback
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      
      // If no theme is set, use system preference or env default
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to env variable or 'light' if nothing is found
    const defaultTheme = import.meta.env.VITE_DEFAULT_THEME as 'dark' | 'light';
    return defaultTheme || 'light';
  });

  // Apply theme changes to document and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
      
      // Also dispatch a storage event to notify other tabs/components
      window.dispatchEvent(new StorageEvent('storage', { 
        key: 'theme',
        newValue: theme
      }));
    }
  }, [theme]);

  // Listen for theme changes from other hooks/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        if (e.newValue === 'dark' || e.newValue === 'light') {
          setTheme(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      // Only update if there's no explicit user preference set
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener('change', handleMediaQueryChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (darkModeMediaQuery.removeEventListener) {
        darkModeMediaQuery.removeEventListener('change', handleMediaQueryChange);
      }
    };
  }, []);

  // Toggle between dark and light
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};

export default useTheme; 
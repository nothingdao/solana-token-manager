// src/components/StyleContext.tsx
import React, { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';

type StyleTheme = 'day' | 'night' | 'system';

interface StyleContextType {
  currentStyle: StyleTheme;
  setStyle: (style: StyleTheme) => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};

interface StyleProviderProps {
  children: ReactNode;
}

export const StyleProvider: FC<StyleProviderProps> = ({ children }) => {
  const [currentStyle, setCurrentStyle] = useState<StyleTheme>(() => {
    const saved = localStorage.getItem('wallet-ui-style');
    return (saved as StyleTheme) || 'system';
  });

  useEffect(() => {
    const applyTheme = (theme: StyleTheme) => {
      const effectiveTheme =
        theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'night'
            : 'day'
          : theme;

      document.documentElement.setAttribute('data-theme', effectiveTheme);
    };

    applyTheme(currentStyle);

    if (currentStyle === 'system') {
      const listener = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? 'night' : 'day');

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [currentStyle]);

  const setStyle = (style: StyleTheme) => {
    setCurrentStyle(style);
    localStorage.setItem('wallet-ui-style', style);
  };

  return (
    <StyleContext.Provider value={{ currentStyle, setStyle }}>
      {children}
    </StyleContext.Provider>
  );
};

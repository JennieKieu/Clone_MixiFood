import React, { createContext, useContext, ReactNode } from 'react';
import useTheme, { TTHemeResult } from '../hooks/useTheme';

const ThemeContext = createContext<TTHemeResult | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): TTHemeResult => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
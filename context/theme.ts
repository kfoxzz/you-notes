import { createContext } from 'react';

export const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}>({ theme: 'light', setTheme: () => {} });

import { createContext } from 'react';

export const TabContext = createContext<{
  tabUrl: string;
  setTabUrl: React.Dispatch<React.SetStateAction<string>>;
}>({ tabUrl: '', setTabUrl: () => {} });

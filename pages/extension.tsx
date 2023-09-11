import { useState, useMemo, useEffect } from 'react';
import { ThemeContext } from '../context/theme';
import { TabContext } from '../context/tab';
import { getCurrentTab } from '../helpers/tab';
import Header from '../components/header';
import Summary from '../components/summary';
import styles from '../styles/Extension.module.scss';

export default function Extension() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [tabUrl, setTabUrl] = useState<string>('');

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  const tabUrlValue = useMemo(
    () => ({
      tabUrl,
      setTabUrl,
    }),
    [tabUrl]
  );

  useEffect(() => {
    getCurrentTab((tab: chrome.tabs.Tab | undefined) => {
      if (tab?.url) {
        setTabUrl(tab.url);
      }
    });

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
      if (changeInfo.url) {
        setTabUrl(changeInfo.url);
      }
    });

    return () => {
      chrome.tabs.onUpdated.removeListener(() => {});
    };
  }, []);

  return (
    <TabContext.Provider value={tabUrlValue}>
      <ThemeContext.Provider value={themeValue}>
        <div className={`${styles.app} ${styles[theme]}`}>
          <Header />
          <Summary />
        </div>
      </ThemeContext.Provider>
    </TabContext.Provider>
  );
}

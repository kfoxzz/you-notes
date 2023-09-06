import { useState, useMemo } from 'react';
import { ThemeContext } from '../context/theme';
import Header from '../components/header';
import Summary from '../components/summary';
import styles from '../styles/Extension.module.scss';

export default function Extension() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={`${styles.app} ${styles[theme]}`}>
        <Header />
        <Summary />
      </div>
    </ThemeContext.Provider>
  );
}

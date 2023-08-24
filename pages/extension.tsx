import React, { useContext } from 'react';
import { ThemeContext } from '../context/theme';
import Header from '../components/header';
import styles from '../styles/Extension.module.scss';

export default function Extension() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={`${styles.container} ${styles[theme]}`}>
        <Header />
      </div>
    </ThemeContext.Provider>
  );
}

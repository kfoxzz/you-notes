import { useContext } from 'react';
import { ThemeContext } from '../context/theme';
import styles from '../styles/Menu.module.scss';

export default function Menu({ open }: { open: boolean }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${styles.container} ${!open ? styles.hidden : ''}`}>
      <ul>
        <li>Switch to {theme === 'light' ? 'dark' : 'light'} mode!!</li>
      </ul>
    </div>
  );
}

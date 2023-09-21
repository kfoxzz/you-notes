import styles from '../styles/Menu.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../context/theme';
import { MdOutlineDarkMode as MoonIcon } from 'react-icons/md';
import { MdOutlineLightMode as SunIcon } from 'react-icons/md';

export default function Menu({ open }: { open: boolean }) {
  const { theme, setTheme } = useContext(ThemeContext);

  const onSetTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className={`${styles.container} ${!open ? styles.hidden : ''}`}>
      <ul>
        <li onClick={onSetTheme}>
          {theme === 'light' ? <MoonIcon size={22} /> : <SunIcon size={22} />}
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </li>

        <li>
          <span>
            <a href='https://iconscout.com/icons/notes' target='_blank'>
              Free Notes Icon
            </a>{' '}
            by{' '}
            <a href='https://iconscout.com/contributors/scott-de-jonge' target='_blank'>
              Scott De jonge
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
}

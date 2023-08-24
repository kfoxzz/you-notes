import { useState } from 'react';
import styles from '../styles/Header.module.css';
import { BsThreeDotsVertical as Dots } from 'react-icons/bs';
import Icon from './icon';
import Menu from './menu';

export default function ExtensionHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo_text}>
        <img src='/icons/notes-32.png' alt='YouNotes Logo' width={32} height={32} />
        <h1>YouNotes</h1>
      </div>

      <Icon onClick={onToggleMenu}>
        <Dots size={24} />
      </Icon>

      <Menu open={menuOpen} />
    </div>
  );
}

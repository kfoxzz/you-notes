import styles from '../styles/Menu.module.css';

export default function Menu({ open }: { open: boolean }) {
  return (
    <div className={`${styles.container} ${!open ? styles.hidden : ''}`}>
      <ul>
        <li>Switch to dark mode</li>
      </ul>
    </div>
  );
}

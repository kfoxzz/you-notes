import { ReactNode } from 'react';
import styles from '../styles/Icon.module.css';

export default function Icon({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className={styles.container} onClick={onClick}>
      {children}
    </div>
  );
}

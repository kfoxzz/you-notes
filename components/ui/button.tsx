import React from 'react';
import styles from '../../styles/Button.module.scss';

export default function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode | React.ReactNode[];
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

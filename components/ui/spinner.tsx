import React from 'react';
import styles from '../../styles/Spinner.module.scss';

export default function LoadingSpinner() {
  return (
    <div className={styles['loader--ring']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

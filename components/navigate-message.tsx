import React from 'react';
import { CgBrowser as BrowserIcon } from 'react-icons/cg';
import styles from '../styles/NavigateMessage.module.scss';

export default function NavigateMessage() {
  return (
    <div className={styles['navigate-message']}>
      <BrowserIcon size={80} />
      <p>Navigate to a YouTube video to work some magic!</p>
    </div>
  );
}

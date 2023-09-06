import React, { useState } from 'react';
import OpenaiAPI from '../api/openai';
import styles from '../styles/Summary.module.scss';
import Button from './ui/button';
import LoadingSpinner from './ui/spinner';

export default function Summary() {
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('Summarize');

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      // TODO: Use selenium to parse transcript and concatenate into 1 string
      const response = await OpenaiAPI.summarize(
        'I like birds, and all animals. There are many species of birds, hundreds even. They live all over the world in every continent.'
      );
      setSummary(response.message);
      setButtonText('Try again');
    } catch (err) {
      console.error(err);
      setSummary('Uh oh! Something went wrong.');
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loadingSummary ? (
          <>
            <LoadingSpinner />
            <p>Fetching summary...</p>
          </>
        ) : summary.length > 0 ? (
          <>
            <p>Summary:</p>
            <p>{summary}</p>
          </>
        ) : (
          <></>
        )}
      </div>

      <Button onClick={fetchSummary} disabled={loadingSummary}>
        {buttonText}
      </Button>
    </div>
  );
}

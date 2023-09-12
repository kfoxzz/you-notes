import React, { useState, useContext, useEffect } from 'react';
import { TabContext } from '../context/tab';
import OpenaiAPI from '../api/openai';
import ScraperAPI from '../api/scraper';
import styles from '../styles/Summary.module.scss';
import Button from './ui/button';
import LoadingSpinner from './ui/spinner';
import NavigateMessage from './navigate-message';

export default function Summary() {
  const { tabUrl } = useContext(TabContext);
  const youtubeUrl = 'youtube.com/watch?v=';

  const [isOnYoutube, setIsOnYoutube] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('Summarize');

  const fetchSummary = async () => {
    setLoadingSummary(true);
    // this will likely take awhile - should warn the user
    try {
      // TODO: Use selenium to parse transcript and concatenate into 1 string
      const transcript = await ScraperAPI.scrapeTranscript(tabUrl);

      // const response = await OpenaiAPI.summarize(
      //   'I like birds, and all animals. There are many species of birds, hundreds even. They live all over the world in every continent.'
      // );
      // const response = await OpenaiAPI.summarize(transcript);
      // setSummary(response.message);
      setButtonText('Try again');
    } catch (err) {
      console.error(err);
      setSummary('Uh oh! Something went wrong.');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (tabUrl.includes(youtubeUrl)) {
      setIsOnYoutube(true);
    } else {
      setIsOnYoutube(false);
    }
  }, [tabUrl]);

  return (
    <div className={styles.container}>
      {!isOnYoutube && <NavigateMessage />}

      {isOnYoutube && (
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
            <p className={styles.prompt}>Hit Summarize to work the magic!</p>
          )}
        </div>
      )}

      <Button onClick={fetchSummary} disabled={loadingSummary || !isOnYoutube}>
        {buttonText}
      </Button>
    </div>
  );
}

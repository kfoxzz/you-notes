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
  const [summaryCompleted, setSummaryCompleted] = useState<boolean>(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    setSummaryCompleted(false);
    try {
      const transcript = await ScraperAPI.scrapeTranscript(tabUrl);
      const response = await OpenaiAPI.summarize(transcript);
      setSummary(response.message);
      // TODO: Maybe we should save summary to local storage? I accidentally clicked out of the summary and lost it several times, and it takes awhile to summarize.
      setSummaryCompleted(true);
    } catch (err) {
      console.error(err);
      // TODO: We should be setting an error, not setting the summary to an error message.
      setSummary('Uh oh! Something went wrong.');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    setSummaryCompleted(false);

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
              {/* add snippet here in small font - "Please allow 1-2 minutes for the AI to finish working." or something similar */}
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

      <Button onClick={fetchSummary} disabled={loadingSummary || !isOnYoutube || summaryCompleted}>
        Summarize!
      </Button>
    </div>
  );
}

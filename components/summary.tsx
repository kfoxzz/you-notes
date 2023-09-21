import React, { useState, useContext, useEffect } from 'react';
import { TabContext } from '../context/tab';
import OpenaiAPI from '../api/openaiapi';
import ScraperAPI from '../api/scraperapi';
import styles from '../styles/Summary.module.scss';
import Button from './ui/button';
import LoadingSpinner from './ui/spinner';
import NavigateMessage from './navigate-message';
import { MdErrorOutline as ErrorIcon } from 'react-icons/md';

export default function Summary() {
  const { tabUrl } = useContext(TabContext);
  const youtubeUrl = 'youtube.com/watch?v=';

  const [isOnYoutube, setIsOnYoutube] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [summaryCompleted, setSummaryCompleted] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchSummary = async () => {
    setError(false);
    setLoadingSummary(true);
    setSummaryCompleted(false);
    try {
      const transcript = await ScraperAPI.scrapeTranscript(tabUrl);
      const response = await OpenaiAPI.summarize(transcript);
      setSummary(response.message);
      // TODO: Add a database layer to save summary. It's really annoying that it gets cleared and request is canceled if user clicks out of extension. This should be a background process that saves the summary to the database after it is done.

      // Steps:
      // 1. Summary is requested.
      // 2. Summary is created in database, with status of 'processing' and a request date.
      // 3. Web socket connection waits for summary to be completed.
      // 4. When summary is completed, it is sent to frontend via web socket (if connection is still open), saved to the database object, and status in database is set to 'complete'.
      //    - This is so that if the user closes the extension, the request doesn't get canceled and the user can view the summary at a later time.
      // 5. All requested summaries (processing and complete) are displayed in the frontend.

      setSummaryCompleted(true);
    } catch (err) {
      setError(true);
      console.error(err);
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
              <p>Please allow 30 seconds for summary to be created.</p>
            </>
          ) : summary.length > 0 ? (
            <>
              <p>Summary:</p>
              <p>{summary}</p>
            </>
          ) : error ? (
            <>
              <ErrorIcon size={52} />
              <p>Error</p>
              <p> Something went wrong. Please try again.</p>
            </>
          ) : (
            <>
              <p className={styles.prompt}>Hit Summarize to work the magic!</p>
              <p className={styles.prompt}>
                Note: Due to increased demand, video must less than 30 minutes long.
              </p>
            </>
          )}
        </div>
      )}

      <Button onClick={fetchSummary} disabled={loadingSummary || !isOnYoutube || summaryCompleted}>
        Summarize!
      </Button>
    </div>
  );
}

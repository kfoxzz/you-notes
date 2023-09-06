import React, { useState } from 'react';
import OpenaiAPI from '../api/openai';

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
    <div>
      {loadingSummary ? (
        <p>Fetching summary...</p>
      ) : summary.length > 0 ? (
        <>
          <p>Summary:</p>
          <p>{summary}</p>
        </>
      ) : (
        <></>
      )}
      <button onClick={fetchSummary} disabled={loadingSummary}>
        {buttonText}
      </button>
    </div>
  );
}

export default class ScraperAPI {
  static scrapeTranscript = async (url: string) => {
    const response = await fetch(`${process.env.BASE_API_URL}/api/scraper`, {
      method: 'POST',
      body: JSON.stringify({
        url,
      }),
    });
    // return response.json();
  };
}

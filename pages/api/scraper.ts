import type { NextApiRequest, NextApiResponse } from 'next';
import { JSDOM } from 'jsdom';

type ResponseData = {
  message: string;
};

// Every API Route can export a config object to change the default configuration, which is the following
// The API object includes all config options available for API Routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Copied much of this logic from https://github.com/kazuki-sf/YouTube_Summary_with_ChatGPT
const scrape = async (url: string) => {
  try {
    const videoPageResponse = await fetch(url);
    const videoPageHtml = await videoPageResponse.text();
    const splittedHtml = videoPageHtml.split('"captions":');

    if (splittedHtml.length < 2) {
      console.log('No Caption Available');
      return;
    } // No Caption Available

    const captions_json = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));
    const captionTracks = captions_json.playerCaptionsTracklistRenderer.captionTracks;
    const languageOptions = Array.from(captionTracks).map((i: any) => {
      return i.name.simpleText;
    });

    const first = 'English'; // Sort by English first
    languageOptions.sort(function (x, y) {
      return x.includes(first) ? -1 : y.includes(first) ? 1 : 0;
    });
    languageOptions.sort(function (x, y) {
      return x == first ? -1 : y == first ? 1 : 0;
    });

    const langOptionArray = Array.from(languageOptions).map((langName, index) => {
      const link = captionTracks.find((i: any) => i.name.simpleText === langName).baseUrl;
      return {
        language: langName,
        link: link,
      };
    });

    const english = langOptionArray[0].link;

    console.log('LANG LINK =>', english);

    const rawTranscript = await fetch(english);
    const transcriptPageXml = await rawTranscript.text();

    const domParser = new JSDOM().window.DOMParser;
    const xmlDoc = new domParser().parseFromString(transcriptPageXml, 'text/xml');
    const textNodes = xmlDoc.childNodes;

    const finalRawTranscript = Array.from(textNodes).map(i => i.textContent);

    console.log('transcript => ', finalRawTranscript);
  } catch (err) {
    console.log('ERROR => ', err);
    return;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const { url } = JSON.parse(req.body);

      if (!url || typeof url !== 'string') {
        res.status(400).json({ message: 'Url is required and must be a valid string' });
      }

      await scrape(url);

      res.status(200).json({ message: 'Success' });
    } catch (err) {
      res.status(400).json({ message: 'Unknown error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}

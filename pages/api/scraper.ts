import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
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

const scrape = async (url: string) => {
  const { data } = await axios.get(url, {
    method: 'GET',
  });
  const dom = new JSDOM(data);
  const transcriptContainer = dom.window.document.querySelectorAll('ytd-transcript-segment-list-renderer');
  // NOTE: LEFT OFF HERE
  // console.log('transcriptContainer', transcriptContainer);
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

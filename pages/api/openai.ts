import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const summarize = async (text: string): Promise<{ error?: boolean; message: string }> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `Summarize the following: ${text}` }],
      model: 'gpt-3.5-turbo',
    });

    const message = chatCompletion.choices[0].message.content ?? '';
    return { message };
  } catch (err) {
    return { error: true, message: 'OpenAI request failed' };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const { text } = JSON.parse(req.body);

      if (!text || typeof text !== 'string') {
        res.status(400).json({ message: 'Text is required and must be a valid string' });
      }

      // TODO: Divide text into chunks of characters (need to determine amount of characters per chunk)

      const chunks = [text];
      const summaries = [];

      for (let chunk of chunks) {
        const summary = await summarize(chunk);
        if (summary.error) {
          res.status(400).json({ message: summary.message });
        } else {
          summaries.push(summary.message);
        }
      }

      const finalSummary = await summarize(summaries.join('\n'));

      if (finalSummary.error) {
        res.status(400).json({ message: 'OpenAI final summary request failed' });
      }

      res.status(200).json({ message: finalSummary.message });
    } catch (err) {
      res.status(400).json({ message: 'Unknown error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}

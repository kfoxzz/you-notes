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

const splitIntoChunks = (text: string) => {
  const words = text.split(' ');
  const chunks = [];
  let chunk = '';

  for (const word of words) {
    if (chunk.length + word.length <= 3000) {
      chunk += word + ' ';
    } else {
      chunks.push(chunk.trim());
      chunk = word + ' ';
    }
  }

  if (chunk) {
    chunks.push(chunk.trim());
  }

  return chunks;
};

const summarize = async (text: string): Promise<{ error?: boolean; message: string }> => {
  try {
    // TODO: Maybe include title of the video in the prompt for better results
    // TODO: It would be cool to let the user pick how long they want the summary to be in # of words
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `Summarize the following video in 100 words or less: ${text}` }],
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
      const body = await JSON.parse(req.body);
      const text = body.text.text;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ message: 'Text is required and must be a valid string' });
        return;
      }

      // TODO: Implement library to determine exact number of tokens: https://www.npmjs.com/package/gpt-3-encoder
      /**
       * https://platform.openai.com/tokenizer
       * "A helpful rule of thumb is that one token generally corresponds to ~4 characters of text for common English text. This translates to roughly ¾ of a word (so 100 tokens ~= 75 words)."
       */

      const chunks = splitIntoChunks(text);
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
      console.log('UNHANDLED ERROR /api/openai => ', err);
      res.status(400).json({ message: 'Unknown error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}

import { Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { Mistral } from '@mistralai/mistralai';

export class MistralService {
  async answerPrompt(@Body() body: { prompt: string }, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    try {
      const result = await client.chat.stream({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: body.prompt }]
      });

      for await (const chunk of result) {
        const streamText = chunk.data.choices[0].delta.content;
        res.write(streamText);
      }
    } catch {
      res.write('Error occurred');
    }
    res.end();
  }
}

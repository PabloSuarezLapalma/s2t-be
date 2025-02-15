import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeminiService } from '../services/gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('/prompt')
  async answerPrompt(@Body() body: { prompt: string }, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    try {
      for await (const chunk of this.geminiService.generateAIContent(
        body.prompt
      )) {
        res.write(chunk);
      }
    } catch {
      res.write('Error occurred');
    }
    res.end();
  }
}

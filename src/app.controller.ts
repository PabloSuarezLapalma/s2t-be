import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/prompt')
  async answerPrompt(@Body() body: { prompt: string }, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    try {
      for await (const chunk of this.appService.generateAIContent(
        body.prompt,
      )) {
        // Preserve newlines in the response
        const formattedChunk = chunk.replace(/\n/g, '\n');
        res.write(`data: ${formattedChunk}\n\n`);
      }
    } catch {
      res.write(`data: Error occurred\n\n`);
    }
    res.end();
  }
}

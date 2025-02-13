import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../services/app.service';

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
        res.write(chunk);
      }
    } catch {
      res.write('Error occurred');
    }
    res.end();
  }
}

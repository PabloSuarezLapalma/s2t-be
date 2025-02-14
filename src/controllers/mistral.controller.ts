import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MistralService } from '../services/mistral.service';

@Controller('/mistral')
export class MistralController {
  constructor(private readonly mistralService: MistralService) {}

  @Post('/prompt')
  async answerPrompt(@Body() body: { prompt: string }, @Res() res: Response) {
    this.mistralService.answerPrompt(body, res);
  }
}

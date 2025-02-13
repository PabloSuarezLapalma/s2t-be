import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // Modified method to stream AI content using generateContentStream
  async *generateAIContent(prompt: string): AsyncGenerator<string> {
    try {
      if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
        throw new Error('Missing GOOGLE_AI_STUDIO_API_KEY');
      }
      const genAI = new GoogleGenerativeAI(
        process.env.GOOGLE_AI_STUDIO_API_KEY,
      );
      // Updated model to "gemini-1.5-flash" per the example
      const model = genAI.getGenerativeModel({
        model: process.env.GOOGLE_AI_MODEL,
      });
      const result = await model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw new Error('Internal server error');
    }
  }
}

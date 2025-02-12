import * as dotenv from 'dotenv';
dotenv.config(); // Added to load .env variables
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Application listening on port ${port}`);
}
bootstrap();

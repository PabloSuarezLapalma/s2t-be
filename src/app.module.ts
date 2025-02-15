import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MistralService } from './services/mistral.service';
import { MistralController } from './controllers/mistral.controller';
import { GeminiController } from './controllers/gemini.controller';
import { GeminiService } from './services/gemini.service';

@Module({
  imports: [],
  controllers: [AppController, GeminiController, MistralController],
  providers: [AppService, GeminiService, MistralService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('protected');
  }
}

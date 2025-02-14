import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MistralService } from './services/mistral.service';
import { MistralController } from './controllers/mistral.controller';

@Module({
  imports: [],
  controllers: [AppController, MistralController],
  providers: [AppService, MistralService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('protected');
  }
}

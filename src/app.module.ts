import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}

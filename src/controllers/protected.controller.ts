import { Controller, Get, Req } from '@nestjs/common';
import { AuthRequest } from '../middleware/auth.middleware';

@Controller('protected')
export class ProtectedController {
  @Get()
  getProtectedData(@Req() req: AuthRequest) {
    return { message: 'Ruta protegida', user: req.user };
  }
}

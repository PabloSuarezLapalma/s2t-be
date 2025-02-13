import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.validateUser(body.username, body.password);
  }
}

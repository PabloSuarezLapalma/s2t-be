import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { auth } from '../common/firebase';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

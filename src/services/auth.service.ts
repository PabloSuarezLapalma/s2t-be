import { Injectable } from '@nestjs/common';

@Injectable()
//TODO: Use firebase auth
export class AuthService {
  async validateUser(username: string, password: string): Promise<any> {
    if (username === 'user' && password === 'password') {
      return { username: 'user' };
    }
    return null;
  }
}

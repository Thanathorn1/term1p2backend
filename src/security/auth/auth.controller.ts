import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: any) {
    const { username, password } = body;
    const token = this.authService.login(username, password);

    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { token };
  }
}

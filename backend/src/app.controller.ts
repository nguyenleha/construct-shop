import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './v1/auth/local-auth.guard';
import { AuthService } from './v1/auth/auth.service';
import { JwtAuthGuard } from './v1/auth/jwt-auth.guard';
import { Public } from './v1/decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

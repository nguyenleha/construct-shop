import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './modules-v1/auth/auth.service';
import { Public, User } from './common/decorators/public';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { IUser } from './interfaces/common.interface';
import { CreateUserDto } from './modules-v1/user/dto/create-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  handleLogin(@User() user: IUser) {
    return this.authService.login(user);
  }

  @Public()
  @Post('/register')
  handleRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Public()
  @Post('/refresh-token')
  getRefreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
  @Public()
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: IUser) {
    return user;
  }
}

import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, User } from 'src/common/decorators/public';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { IUser } from 'src/interfaces/common.interface';
import { RegisterUserDto } from '../user/dto/create-user.dto';
import { Response, Request } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: IUser) {
    return user;
  }
  @Public()
  @Post('register')
  register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(registerUserDto, response);
  }

  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  async logout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(response, user);
  }
}

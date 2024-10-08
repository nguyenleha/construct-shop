import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  encryptValue,
  handleResponseRemoveKey,
} from 'src/common/utils/handleResponse';
import { IPayloadJWT, IUser } from 'src/interfaces/common.interface';
import { RegisterUserDto } from '../user/dto/create-user.dto';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return handleResponseRemoveKey(user);
      }
    }
    throw new UnprocessableEntityException(
      'Tài khoản hoặc mật khẩu không hợp lệ',
    );
  }
  async login(user: IPayloadJWT, response: Response) {
    const key = this.configService.get<string>('SECRET_KEY');
    try {
      const payload = { jti: encryptValue(user, key) };
      const refresh_token = this.createRefreshToken(payload);

      //update user with refresh_token
      await this.usersService.updatedUserToken(user.id, refresh_token);

      //set refresh_token cookies
      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
      });
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token,
      };
    } catch {
      new UnauthorizedException('Token khong hop le!');
    }
  }
  async register(user: RegisterUserDto, response: Response) {
    const newUser = await this.usersService.register(user);
    delete user.confirmPassword;
    return await this.login(newUser, response);
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        //update refresh token
        const key = this.configService.get<string>('SECRET_KEY');
        try {
          const payload = { jti: encryptValue(user, key) };
          const refresh_token = this.createRefreshToken(payload);

          //update user with refresh_token
          await this.usersService.updatedUserToken(user.id, refresh_token);

          //set refresh_token cookies
          response.clearCookie('refresh_token');
          response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
          });
          return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
          };
        } catch {
          new UnauthorizedException('Token khong hop le!');
        }
      } else {
        throw new BadRequestException(
          `Refresh token khong hop le, vui long login`,
        );
      }
    } catch (e) {
      throw new BadRequestException(
        `Refresh token khong hop le, vui long login`,
      );
    }
  };
  async logout(response: Response, user: IUser) {
    await this.usersService.updatedUserToken(user.id, '');
    response.clearCookie('refresh_token');
    return 'OK';
  }
}

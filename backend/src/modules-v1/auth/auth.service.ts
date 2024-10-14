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
import { IUser } from 'src/interfaces/common.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUsername(email);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return {
          ...handleResponseRemoveKey(user),
          roles: this.usersService.handleConvertRole(user),
        };
      }
    }
    throw new UnprocessableEntityException(
      'Tài khoản hoặc mật khẩu không hợp lệ',
    );
  }
  async login(user: IUser) {
    const key = this.configService.get<string>('SECRET_KEY');
    const payload = { jti: encryptValue(user, key) };
    return {
      token_type: 'Bearer',
      expires_in:
        ms(this.configService.get<string>('JWT_ACCESS_EXPIRES')) / 1000,
      access_token: this.createAccessToken(payload),
      refresh_token: this.createRefreshToken(payload),
    };
  }
  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return await this.login(newUser);
  }
  createAccessToken(user: { jti: string }) {
    return this.jwtService.sign(user);
  }
  createRefreshToken = (user: { jti: string }) => {
    return this.jwtService.sign(user, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')) / 1000,
    });
  };

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      delete payload.iat;
      delete payload.exp;

      return {
        token_type: 'Bearer',
        expires_in:
          ms(this.configService.get<string>('JWT_ACCESS_EXPIRES')) / 1000,
        access_token: this.createAccessToken(payload),
        refresh_token: this.createRefreshToken(payload),
      };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
  // async logout(response: Response, user: IUser) {
  //   await this.usersService.updatedUserToken(user.id, '');
  //   response.clearCookie('refresh_token');
  //   return 'OK';
  // }
}

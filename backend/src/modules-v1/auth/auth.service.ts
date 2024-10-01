import {
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
import { IPayloadJWT } from 'src/interfaces/common.interface';
import { RegisterUserDto } from '../user/dto/create-user.dto';

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
  async login(user: IPayloadJWT) {
    const key = this.configService.get<string>('SECRET_KEY');
    try {
      const payload = { jti: encryptValue(user, key) };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch {
      new UnauthorizedException('Token khong hop le!');
    }
  }
  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);
    return {
      id: newUser?.id,
      createdAt: newUser?.created_at,
    };
  }
}

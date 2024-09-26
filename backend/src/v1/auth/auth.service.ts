import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUserByUsername(username);
    if (user) {
      const isValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      console.log('Password valid:', isValid);
      if (isValid === true) {
        return user;
      }
    } else {
      throw new UnprocessableEntityException(
        'Tài khoản hoặc mật khẩu không hợp lệ',
      );
    }
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

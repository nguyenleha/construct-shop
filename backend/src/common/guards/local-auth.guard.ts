import {
  Injectable,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = this.getRequest(context);
    const { email, password } = request.body;

    if (!email || !password) {
      throw new UnprocessableEntityException('Vui lòng nhập email và mật khẩu');
    }
    if (err) {
      throw new UnprocessableEntityException(
        err.message || 'Invalid credentials',
      );
    }

    return user;
  }
}

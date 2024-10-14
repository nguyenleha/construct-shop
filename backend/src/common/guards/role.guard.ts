import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public';
import { ROLES_KEY } from '../decorators/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // Lấy các vai trò (roles) từ cả class và method
    const classRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
    ]);
    const methodRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
    ]);

    // Gộp cả hai lại thành một mảng
    const requiredRoles = [...(classRoles || []), ...(methodRoles || [])];

    if (!requiredRoles.length) {
      return true; // Không yêu cầu role nào => cho phép truy cập
    }

    // Lấy thông tin người dùng từ request
    const { user } = context.switchToHttp().getRequest();
    if (!user?.roles?.length) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tài nguyên này.',
      );
    }
    const hasRole = requiredRoles.some((requiredRole) => {
      return user.roles?.some((userRole) => {
        // Kiểm tra nếu user có role với cả page và permission
        return (
          (!requiredRole.page || userRole.page === requiredRole.page) &&
          (!requiredRole.permission ||
            userRole.permission === requiredRole.permission)
        );
      });
    });
    if (!hasRole) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tài nguyên này.',
      );
    }
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_KEY } from './roles.decorators';
import { AccessLevel } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredAccess = this.reflector.getAllAndOverride<AccessLevel[]>(
      ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAccess) return true;
    const { login_status, user } = context.switchToHttp().getRequest();
    if (login_status === false) return true;
    return requiredAccess.some((level) => user.access_level?.includes(level));
  }
}

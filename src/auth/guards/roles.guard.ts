import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredData = this.reflector.getAllAndOverride<{
      roles: string[];
      matchAny?: boolean;
    }>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredData) {
      return true;
    }

    const { roles: requiredRoles, matchAny = false } = requiredData;

    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles ?? [];

    if (matchAny) {
      return userRoles.some((role) => requiredRoles.includes(role));
    } else {
      return requiredRoles.every((role) => userRoles.includes(role));
    }
  }
}

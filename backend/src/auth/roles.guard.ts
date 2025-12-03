import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from '../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true; // si no hay roles definidos, dejar pasar

    const request = context.switchToHttp().getRequest<{ user?: User }>();
    const user = request.user;

    if (!user) return false;

    return requiredRoles.includes(user.role); // compara el rol del usuario con los roles requeridos
  }
}


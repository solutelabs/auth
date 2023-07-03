import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!this.matchRoles(roles, user.role)) {
      throw new UnauthorizedException('You are not authorized to access');
    }
    return true;
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }
}
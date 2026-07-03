import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { RoleService } from 'src/modules/role/role.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission || requiredPermission.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    const permissions = await this.cachePermissionOfRole(user.role.trim().toUpperCase())

    const method = request.method;
    const path = request.route?.path;

    const hasPermission = permissions.some((permission) => {
      const [permMethod, permPath] = permission.split(' ');

      if (permMethod !== method) return false;

      // So sánh path với pattern matching
      return this.matchPath(permPath, path);
    });

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true;
  }

  private async cachePermissionOfRole(roleName: string) {
    const cacheKey = `role_permission:${roleName}`

    let permissions = await this.redisService.get<string[]>(cacheKey)

    if (!permissions) {
      permissions = await this.roleService.getPermissionByName(roleName)

      await this.redisService.set(cacheKey, permissions)
    }
    return permissions
  }

  private matchPath(pattern: string, path: string): boolean {
    const regexPath = pattern.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${regexPath}$`);
    return regex.test(path);
  }
}

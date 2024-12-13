import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
  import { Permission } from 'src/modules/roles/dtos/role.dto';
  import { UsersService } from 'src/modules/users/users.service';
  
  @Injectable()
  export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector,
       private userService: UsersService
      ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {

      const request = context.switchToHttp().getRequest();
  
      if (!request.userInfo.id) {
        throw new UnauthorizedException('User Id not found');
      }
  
      const routePermissions: Permission[] = await this.reflector.getAllAndOverride(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

      
      if (!routePermissions) {
          return true;
      }
  
      try {

        const userPermissions = await this.userService.getUserPermissions(
          request.userInfo.id,
        );
  
        for (const routePermission of routePermissions) {
          const userPermission = userPermissions.find(
            (perm) => perm.resource === routePermission.resource,
          );
  
          if (!userPermission) throw new ForbiddenException();
  
          const allActionsAvailable = routePermission.actions.every(
            (requiredAction) => userPermission.actions.includes(requiredAction),
          );
          if (!allActionsAvailable) throw new ForbiddenException();
        }
      } catch (e) {
        throw new ForbiddenException();
      }
      return true;
    }
  }
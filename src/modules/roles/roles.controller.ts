import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../../dtos/role.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';
import { UpdateRoleDto } from 'src/dtos/update-role.dto';
import { Action } from '../../libs/utils/enums/action.enum';

import { Permissions } from '../../common/decorators/permissions.decorator';
import { Resource } from '../../libs/utils/enums/resource.enum';
import { PermissionGuard } from 'src/common/Guards/permission.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @UseGuards(TenantAuthenticationGuard,PermissionGuard)
    @Permissions([
      {
        resource: Resource.roles,
        actions: [Action.create]
      }
    ])
  @Post()
  async createRole(@Req() request: Request, @Body() role: CreateRoleDto) {
    const tenantId = request.headers['x-tenant-id']?.toString();
    return this.rolesService.createRole(tenantId, role);
  }

  @Post('seed-roles')
  async seedRoles(@Req() request: Request, @Body() role: CreateRoleDto) {
    const tenantId = request.headers['x-tenant-id']?.toString();
    return this.rolesService.seedRole(tenantId, role);
  }

  @UseGuards(TenantAuthenticationGuard,PermissionGuard)
  @Permissions([
    {
      resource: Resource.roles,
      actions: [Action.update]
    }
  ])
  @Put(':id')
  async updateRole(@Req() request: Request,@Param('id') id: string, @Body() role: UpdateRoleDto) {
    const roleId = request.headers['x-role-id']?.toString();
    return this.rolesService.updateRole(id,roleId, role);
  }

  @UseGuards(TenantAuthenticationGuard)
  @Get()
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }
}



import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../../dtos/role.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';


@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @UseGuards(TenantAuthenticationGuard)
  @Post()
  async createRole(@Body() role:CreateRoleDto ) {
    return this.rolesService.createRole(role);
  }

  @Post('seed-roles')
  async seedRoles(@Req() request: Request,@Body() role:CreateRoleDto) {
    const tenantId = request.headers['x-tenant-id']?.toString();
    return this.rolesService.seedRole(tenantId,role);
  }

  @UseGuards(TenantAuthenticationGuard)
  @Put(':id')
  async updateRole(@Param('id') id: string,@Body() role:CreateRoleDto) {
    return this.rolesService.updateRole(id,role);
  }
}



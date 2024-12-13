import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/role.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Post()
  async createRole(@Body() role:CreateRoleDto ) {
    return this.rolesService.createRole(role);
  }
}



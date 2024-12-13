import { Inject, Injectable } from '@nestjs/common';
import { Role } from './schemas/roles.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dtos/role.dto';

@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_MODEL') private RoleModel: Model<Role>) { }

  async createRole(role: CreateRoleDto) {
    //TODO: Validate unique names
    return this.RoleModel.create(role);
  }

  async getRoleById(roleId: string) {
    return this.RoleModel.findById(roleId);
  }

  async getDefaultCutomerRole() {
    try {
      const defaultRole = await this.RoleModel.findOne({ name: 'customer' });      
      return defaultRole;
    } catch (error) {
      console.error('Error fetching default role:', error);
      throw error;
    }
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Role } from '../../schemas/roles.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../../dtos/role.dto';

@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_MODEL') private RoleModel: Model<Role>) { }

  async createRole(role: CreateRoleDto) {
    const existingRole = await this.RoleModel.findOne({ name: role.name });
    if (existingRole) {
      throw new BadRequestException(`Role with name '${role.name}' already exists`);
    }
    return this.RoleModel.create(role);
  }

  async seedRole(tenandId:string,role: CreateRoleDto) {
    const existingRole = await this.RoleModel.findOne({ name: role.name });
    if (existingRole) {
      throw new BadRequestException(`Role with name '${role.name}' already exists`);
    }
    return this.RoleModel.create({ ...role, tenantId: tenandId });
  }

  async getRoleById(roleId: string) {
    return this.RoleModel.findById(roleId);
  }

  async updateRole(roleId: string, updatedRole: CreateRoleDto) {
    return this.RoleModel.findByIdAndUpdate(roleId, updatedRole, { new: true });
  }

  async getDefaultCutomerRole() {
    try {
      return await this.RoleModel.findOne({ name: 'customer' });
    } catch (error) {
      console.error('Error fetching default role:', error);
      throw error;
    }
  }
}

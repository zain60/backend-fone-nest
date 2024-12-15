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
    const data =  this.RoleModel.create(role);
    return {
      data: data,
      message: "Role created successfully"
    }
  }

  async seedRole(tenandId:string,role: CreateRoleDto) {
    const existingRole = await this.RoleModel.findOne({ name: role.name });
    if (existingRole) {
      throw new BadRequestException(`Role with name '${role.name}' already exists`);
    }
    const data = await this.RoleModel.create({ ...role, tenantId: tenandId });
    return {
      data: data,
      message: "Role created successfully"
    }
  }

  async getRoleById(roleId: string) {
    const data = await this.RoleModel.findById(roleId);
    return {
      data: data,
      message: "Role fetched successfully"
    }
  }

  async updateRole(roleId: string, updatedRole: CreateRoleDto) {
    const data = await this.RoleModel.findByIdAndUpdate(roleId, updatedRole, { new: true });
    return {
      data: data,
      message: "Role updated successfully"
    }
  }

  async getDefaultCutomerRole() {
    try {
      const data =  await this.RoleModel.findOne({ name: 'customer' });
      return {
        data: data,
        message: "Role fetched successfully"
      }

    } catch (error) {
      console.error('Error fetching default role:', error);
      throw error;
    }
  }
}

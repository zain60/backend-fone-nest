import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Role } from '../../schemas/roles.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../../dtos/role.dto';
import { UpdateRoleDto } from 'src/dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_MODEL') private RoleModel: Model<Role>) { }

  async createRole(tenandId:string,role: CreateRoleDto) {
    const existingRole = await this.RoleModel.findOne({ name: role.name });
    if (existingRole) {
      throw new BadRequestException(`Role with name '${role.name}' already exists`);
    }
    const data =  this.RoleModel.create({...role,tenantId: tenandId});
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
  async updateRole(id: string,roleId:string, updatedRole: UpdateRoleDto) {
    const userRole = await this.RoleModel.findById(roleId);
    const targetRole = await this.RoleModel.findById(id);
    if (!targetRole) {
      throw new BadRequestException('roleId not found');
    }
    if (userRole.name === 'admin' && targetRole.name === 'superAdmin') {
      throw new BadRequestException('Admin can only modify admin and customer roles');
    }
    if (userRole.name === 'superAdmin') {
      const data = await this.RoleModel.findByIdAndUpdate(id, updatedRole, { new: true });
      return {
        data: data,
        message: "Role updated successfully"
      }
    }
    const data = await this.RoleModel.findByIdAndUpdate(id, updatedRole, { new: true });
    return {
      data: data,
      message: "Role updated successfully"
    }
  }
  async getAllRoles() {
    const roles = await this.RoleModel.find({});
    return {
      data: roles,
      message: "Roles fetched successfully"
    }
  }
  async getRoleByName(roleName: string) {
    const role = await this.RoleModel.findOne({ name: roleName });
    if (!role) {
      throw new BadRequestException(`Role with name '${roleName}' not found`);
    }
    return {
      data: role,
      message: "Role fetched successfully"
    }
  }
}

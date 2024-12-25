import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Role } from '../../schemas/roles.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../../dtos/role.dto';
import { UpdateRoleDto } from 'src/dtos/update-role.dto';
import { CustomLogger } from 'src/common/logger/custom.logger';

@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_MODEL') private RoleModel: Model<Role>) { }
    private readonly logger = new CustomLogger();
  
  async createRole(tenandId:string,role: CreateRoleDto) {
    const existingRole = await this.RoleModel.findOne({ name: role.name });
    if (existingRole) {
      this.logger.warn(`Role with name '${role.name}' already exists`);
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
      this.logger.warn(`Role with name '${role.name}' already exists`);
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
      this.logger.error(`Role with ID ${id} not found`);
      throw new BadRequestException('roleId not found');
    }
    if (userRole.name === 'admin' && targetRole.name === 'superAdmin') {
      this.logger.error('Super Admin cannot modify superAdmin role');
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
      this.logger.warn(`Role with name '${roleName}' not found`);
      throw new BadRequestException(`Role with name '${roleName}' not found`);
    }
    return {
      data: role,
      message: "Role fetched successfully"
    }
  }
}

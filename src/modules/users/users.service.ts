import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from '../../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserAppointmentSettingsDto } from '../../dtos/user-appointment-settings.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
    constructor(@Inject('USERS_MODEL') private userModel: Model<User>,
    private authService: AuthService,
    private jwtService: JwtService,
    private rolesService: RolesService,

) { }

    async getUsersByEmail(email: string) {
        return this.userModel.findOne({ email });

    }
    async createUser(userData: UserDto, tenantId: string) {
        const { name, email, password,role } = userData
        const user = await this.getUsersByEmail(email)
        if (user) throw new BadRequestException('User already exist and belongs to a company');
        const roleName = role || 'customer';
        const roleData = await this.rolesService.getRoleByName(roleName);        const roleId = roleData?.data?._id;
        const passwordStore  = await bcrypt.hash(password, 10);
        const response = await this.userModel.create({
            name,
            email,
            password: passwordStore,
            tenantId,
            roleId
        });

        return {
            name: response.name,
            email: response.email,
            message: `User created successfully`
        };
    }
    async loginUser(email: string, password: string) {
        const user = await this.getUsersByEmail(email);
        if (!user) throw new BadRequestException('User does not exist');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid password');
        const secretKey = await this.authService.fetchAccessTokenSecretSigningKey(user.tenantId);
        const accessToken = this.jwtService.sign(
            { userId: user._id.toString() },
            { secret: secretKey, expiresIn: '10h' }
        );
        const {role,data} = await this.getUserPermissions(user.id);
        return {
            userId: user._id,
            name:user.name,
            email:user.email,
            tenantId: user.tenantId,
            userPermissions : data,
            role,
            roleId: user.roleId,
            accessToken,
            message: "User loggedIn successfully",
        };
    }
    async saveSettings(userData: UserAppointmentSettingsDto) {
        const {userId, timezone, activeEventId, activeEventSlug, duration, apiKey } = userData
        const user = await this.userModel.findOne({_id:userId});
        if (!user) throw new BadRequestException('User does not exist');
        const response = await this.userModel.findOneAndUpdate({_id:userId}, {
            timezone,
            activeEventId,
            activeEventSlug,
            duration,
            apiKey
        });

        return {
            timezone: response.timezone,
            activeEventId: response.activeEventId,
            activeEventSlug: response.activeEventSlug,
            duration: response.duration,
            apiKey,
            message:"User information updated",
        };
    }
    async findById(id: string) {
        const data =  await this.userModel.findById(id).exec();
        return {
            data:data,
            message:"data against the id is following"
        }
    }
    async getUserPermissions(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new BadRequestException();
        if (!user.roleId) {
            throw new BadRequestException('No role assigned to this user');
        }   const role = await this.rolesService.getRoleById(user.roleId.toString());
        if (!role.data) {
            throw new BadRequestException('Role not found for this user');
        }
        return {data:role.data.permissions,
            role:role.data.name,    
        };
    }
    async getUsersByTenantId(tenantId: string) {
        const users = await this.userModel.aggregate([
            {
                $match: { tenantId }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $unwind: '$role'
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    tenantId: 1,
                    roleId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'role.name': 1
                }
            }
        ]);
        
        return {
            data: users,
            message: "Users retrieved successfully",
            count: users.length
        };
    }

    async updateUserRole(userId: string, roleName: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new BadRequestException('User not found');
    
        const roleData = await this.rolesService.getRoleByName(roleName);
        const roleId = roleData?.data?._id;
        if (!roleId) throw new BadRequestException('Role not found');
    
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { roleId },
            { new: true }
        ).select('-password');
    
        return {
            data: updatedUser,
            message: "User role updated successfully"
        };
    }

    async deleteUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new BadRequestException('User not found');
    
        await this.userModel.findByIdAndDelete(userId);
    
        return {
            message: "User deleted successfully"
        };
    }
          
}



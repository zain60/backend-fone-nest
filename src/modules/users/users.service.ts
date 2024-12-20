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
        const { name, email, password } = userData
        const user = await this.getUsersByEmail(email)
        if (user) throw new BadRequestException('User already exist and belongs to a company');
        const roledata = await this.rolesService.getDefaultCutomerRole();
        const roleId = roledata?.data?._id
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
        const userPermissions = await this.getUserPermissions(user.id);
        return {
            userId: user._id,
            name:user.name,
            email:user.email,
            tenantId: user.tenantId,
            userPermissions,
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
        const role = await this.rolesService.getRoleById(user.roleId.toString());
        return role.data.permissions;
    }

}



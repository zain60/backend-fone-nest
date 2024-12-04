import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@Inject('USERS_MODEL') private userModel: Model<User>) { }

    async getUsersByEmail(email: string) {
        return this.userModel.findOne({ email });

    }
    async createUser(userData: UserDto, tenantId: string) {
        const { name,email,password } = userData
        const user = await this.getUsersByEmail(email)
        if (user) throw new BadRequestException('User already exist and belongs to a company');
        const passwordStore  = await bcrypt.hash(password, 10);
        const response = this.userModel.create({
            name,
            email,
            password: passwordStore,
            tenantId

        });
        return response;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor( @InjectModel(User.name) private userModel: Model<User>) { }

    async getUsersByEmail(email: string){
       return this.userModel.findOne({ email });

    }
    async createUser(user:UserDto,tenantId: string){
        user.password = await bcrypt.hash(user.password, 10);
        return this.userModel.create({
            ...user,
            tenantId
        });
    }
}

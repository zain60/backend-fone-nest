import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { UserTenantsService } from 'src/user-tenants/user-tenants.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
       
    ) {

    }
      private userTenantService: UserTenantsService
    
    
    async getUsersByEmail(email: string) {
        return this.userModel.findOne({ email });

    }
    async createUser(user: UserDto, tenantId: string) {
        user.password = await bcrypt.hash(user.password, 10);
        const response = this.userModel.create({
            ...user,
            tenantId
        });
        await this.userTenantService.createUserTenanat(user.name, tenantId)
        return response
    }
}

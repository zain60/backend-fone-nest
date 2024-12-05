import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(@Inject('USERS_MODEL') private userModel: Model<User>,
    private authService: AuthService,
    private jwtService: JwtService,

) { }

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
        return { user, accessToken };
    }}

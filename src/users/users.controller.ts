import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  private jwtService: JwtService
  private authService: AuthService


  @Post('signup')
  async SignUp(@Body() userData: UserDto): Promise<any> {
    const { email, } = userData
    const user = this.usersService.getUsersByEmail(email)
    if (user) throw new BadRequestException('Email already exists');
    const tenantId = uuidv4();
    const response = await this.usersService.createUser(userData, tenantId)
    //Fetch tenant specific secret key
    const secretKey = await this.authService.fetchAccessTokenSecretSigningKey(
      response.tenantId,
    );
    //Generate JWT access token
    const accessToken = await this.jwtService.sign(
      { userId: response._id },
      { secret: secretKey, expiresIn: '10h' },
    );
    return { accessToken, user: response };
  }
}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    // private jwtService: JwtService,
    // private authService: AuthService
  ) { }



  @Post('signup')
  async SignUp( @Req()request: Request,@Body() userData: UserDto): Promise<any> {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.usersService.createUser(userData,tenandId);
  }
}

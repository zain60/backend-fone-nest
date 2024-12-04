import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {UserDto} from './dtos/user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
    @Post('signup')
    async SignUp(@Body() userData: UserDto): Promise<any> {

    }
}

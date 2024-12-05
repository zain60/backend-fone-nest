import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { logInDto } from './dtos/login.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post('signup')
  async SignUp( @Req()request: Request,@Body() userData: UserDto): Promise<any> {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.usersService.createUser(userData,tenandId);
  }

  @Post('login')
  async LogIn(@Body() loginData: logInDto): Promise<any> {
    const { email, password } = loginData;
    return this.usersService.loginUser(email, password);
  }
}

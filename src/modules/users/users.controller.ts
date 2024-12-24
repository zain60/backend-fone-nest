import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from '../../dtos/user.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UserAppointmentSettingsDto } from '../../dtos/user-appointment-settings.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post('signup')
  async SignUp(@Req() request: Request, @Body() userData: UserDto): Promise<any> {
    const tenantId = request['tenantId'];
    return this.usersService.createUser(userData, tenantId);
  }

  @Post('login')
  async LogIn(@Body() loginData: LoginDto): Promise<any> {
    const { email, password } = loginData;
    return this.usersService.loginUser(email, password);
  }

  @Post('save-settings')
  async saveSettings(@Body() userData: UserAppointmentSettingsDto) {
    return this.usersService.saveSettings(userData);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return this.usersService.findById(id);
  }
  @Get('users-by-tenant')
  async getUsersByTenant(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.usersService.getUsersByTenantId(tenantId);
  }

  @Patch(':userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body('roleName') roleName: string
  ) {
    return this.usersService.updateUserRole(userId, roleName);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}

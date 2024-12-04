import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async LogIn(@Body() loginData:LoginDto): Promise<any> {
        return this.authService.login(loginData);
    }

    @Post('register')
    async register(@Body() registerData: SignUpDto): Promise<any> {
        return this.authService.register(registerData);
    }
}

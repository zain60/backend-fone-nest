import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dtos/login.dto';
import { SignUpDto } from '../../dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
}

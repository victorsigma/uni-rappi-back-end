import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const response = this.authService.login(loginDto);
    return {
      status: HttpStatus.OK,
      message: 'Login exitoso',
      access_token: (await response).access_token,
    };
  }
}

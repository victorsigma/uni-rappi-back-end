import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    let user;
    
    // Si el valor parece un email, validamos el formato primero
    if (this.isEmail(usernameOrEmail)) {
      // Validación de correo
      user = await this.usersService.findByEmail(usernameOrEmail);
    } else {
      // Si no es un correo, buscamos por username
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private isEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value);
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;
    const user = await this.validateUser(usernameOrEmail, password);

    if (!user) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Credenciales inválidas',
      }, HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: user.username, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
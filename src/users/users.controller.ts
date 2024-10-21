import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users') 
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Usuario creado exitosamente',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Usuarios encontrados exitosamente',
      data: users
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Usuario encontrado exitosamente',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.usersService.remove(id);
    return {
      status: HttpStatus.OK,
      message: `Usuario con ID ${id} eliminado exitosamente`
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      status: HttpStatus.OK,
      message: `Usuario con ID ${id} actualizado exitosamente`,
      data: user
    };
  }
}

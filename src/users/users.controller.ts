import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users') 
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    const user = await this.usersService.create(createUserDto, file);
    return {
      message: 'Usuario creado exitosamente',
      data: user
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.usersService.remove(id);
    return {
      message: `Usuario con ID ${id} eliminado exitosamente`
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    const user = await this.usersService.update(id, updateUserDto, file);
    return {
      message: `Usuario con ID ${id} actualizado exitosamente`,
      data: user
    };
  }
}

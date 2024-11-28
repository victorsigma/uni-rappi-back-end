import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { SupabaseService } from 'src/utils/supabase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly supabaseService: SupabaseService,
  ) {}


  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });  // Buscar por correo
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado, no se pudo eliminar`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(userToUpdate, updateUserDto);

    return this.usersRepository.save(userToUpdate);
  }


  async updatePhoto(id: number, photoUrl: string): Promise<User> {
    const userToUpdate = await this.findOne(id);
    if (userToUpdate.photoUrl) {
      await this.supabaseService.deleteFile(userToUpdate.photoUrl,'Usuarios');
    }
    userToUpdate.photoUrl = photoUrl;
    return this.usersRepository.save(userToUpdate);
  }

  async uploadPhoto(file: Express.Multer.File, userId: number): Promise<string> {
    const user = await this.findOne(userId); // Verificar que el usuario existe
    if (!file) {
      throw new BadRequestException('No se ha recibido ninguna imagen.');
    }

    // Verificar si el archivo es una imagen
    const fileMimeType = file.mimetype;
    if (!fileMimeType || !fileMimeType.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen.');
    }

    // Si todo es válido, subimos la imagen
    const photoUrl = await this.supabaseService.uploadFile(file,'Usuarios'); // Usar el servicio de Supabase para cargar el archivo
    return photoUrl;
  }

  async removePhoto(id: number): Promise<void> {
    const userToUpdate = await this.findOne(id);
    if (userToUpdate.photoUrl) {
      await this.supabaseService.deleteFile(userToUpdate.photoUrl,'Usuarios');
      userToUpdate.photoUrl = null;
      await this.usersRepository.save(userToUpdate);
    }
  }

}
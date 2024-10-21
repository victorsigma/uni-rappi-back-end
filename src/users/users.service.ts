import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FirebaseService } from 'src/utils/firebase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
  ) {}


  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto,  file: Express.Multer.File): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let photoUrl = null;
    if (file) {
      photoUrl = await this.firebaseService.uploadFile(file);
    }
    const newUser = this.usersRepository.create({ ...createUserDto, password: hashedPassword, photoUrl });
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

  async update(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File): Promise<User> {
    const userToUpdate = await this.findOne(id);
    if (updateUserDto.photoUrl && file) {
      throw new BadRequestException('No puedes subir una foto y una URL al mismo tiempo');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (file) {
      const photoUrl = await this.firebaseService.uploadFile(file);
      updateUserDto.photoUrl = photoUrl;
    }
    Object.assign(userToUpdate, updateUserDto);

    return this.usersRepository.save(userToUpdate);
  }
}

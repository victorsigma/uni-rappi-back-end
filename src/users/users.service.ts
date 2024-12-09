import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { SupabaseService } from 'src/global/supabase.service';
import { Wallet } from 'src/wallet/wallet.entity';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(ShoppingCart)
    private readonly cartRepository: Repository<ShoppingCart>,
    private readonly supabaseService: SupabaseService,
  ) {}


  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByUsername = await this.findByUsername(createUserDto.username);
    if (existingUserByUsername) {
      throw new BadRequestException('El nombre de usuario ya está en uso.');
    }
    const existingUserByEmail = await this.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
      const savedUser = await this.usersRepository.save(newUser);

      const wallet = this.walletRepository.create({ user: savedUser, balance: 0 });
      const cart = this.cartRepository.create({ user: savedUser, balance: 0, cartProducts: [] });

      await this.walletRepository.save(wallet);

      await this.cartRepository.save(cart);

      savedUser.wallet = wallet;
      savedUser.shoppingCart = cart;

      await this.usersRepository.save(savedUser);

      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El nombre de usuario o el correo ya están en uso.');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
       where: { id },
       relations: ['wallet'],
      });
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

    if (updateUserDto.username && updateUserDto.username !== userToUpdate.username) {
      const existingUserByUsername = await this.findByUsername(updateUserDto.username);
      if (existingUserByUsername && existingUserByUsername.id !== id) {
        throw new BadRequestException('El nombre de usuario ya está en uso.');
      }
    }
  
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUserByEmail = await this.findByEmail(updateUserDto.email);
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new BadRequestException('El correo electrónico ya está en uso.');
      }
    }
  
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
  
    Object.assign(userToUpdate, updateUserDto);
    try {
      return await this.usersRepository.save(userToUpdate);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El nombre de usuario o el correo ya están en uso.');
      }
      throw error;
    }
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

    const photoUrl = await this.supabaseService.uploadFile(file,'Usuarios');
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
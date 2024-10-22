import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { FirebaseService } from 'src/utils/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, FirebaseService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

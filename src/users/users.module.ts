import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { SupabaseService } from 'src/utils/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, SupabaseService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

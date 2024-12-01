import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { SupabaseService } from 'src/global/supabase.service';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Wallet])],
  providers: [UsersService, SupabaseService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

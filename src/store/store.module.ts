import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { SupabaseService } from 'src/global/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreService, SupabaseService],
  controllers: [StoreController],
  exports: [StoreService]
})
export class StoreModule {}

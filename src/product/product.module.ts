import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { SupabaseService } from 'src/global/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService, SupabaseService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}

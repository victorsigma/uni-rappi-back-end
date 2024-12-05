import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './sales.entity';
import { User } from 'src/users/users.entity';
import { Product } from 'src/product/product.entity';
import { SaleProduct } from './sale-product.entity';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, User, Product, SaleProduct, Wallet])],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService]
})
export class SalesModule {}

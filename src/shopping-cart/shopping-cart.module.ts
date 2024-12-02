import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './shopping-cart.entity';
import { User } from 'src/users/users.entity';
import { Product } from 'src/product/product.entity';
import { CartProduct } from './cart-product.entity';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ShoppingCart, User, Product, CartProduct])],
    providers: [ShoppingCartService],
    controllers: [ShoppingCartController],
    exports: [ShoppingCartService]
})
export class ShoppingCartModule {}

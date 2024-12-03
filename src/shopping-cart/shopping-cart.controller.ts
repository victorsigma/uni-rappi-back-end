import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateShoppingCartDto } from './dto/createShoppingCart.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { UpdateShoppingCartDto } from './dto/updateShoppingCart.dto';

@ApiTags("Shopping Cart")
@Controller('shopping-cart')
@ApiBearerAuth()
export class ShoppingCartController {
    constructor(private readonly cartService: ShoppingCartService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor', 'comprador')
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateCartDto: UpdateShoppingCartDto) {
        const cart = await this.cartService.add(id, updateCartDto);
        return {
            message: `Cart con ID ${id} actualizado exitosamente`,
            data: cart
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor', 'comprador')
    @Delete(':id')
    async remove(@Param('id') id: number, @Body() updateCartDto: UpdateShoppingCartDto) {
        const cart = await this.cartService.remove(id, updateCartDto);
        return {
            message: `Cart con ID ${id} actualizado exitosamente`,
            data: cart
        };
    }
}

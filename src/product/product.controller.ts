import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        const product = await this.productService.create(createProductDto);
        return {
            message: 'Product creado exitosamente',
            data: product
        };
    }

    @UseGuards(RolesGuard)
    @Roles('admin', 'vendedor', 'comprador')
    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor')
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.productService.remove(id);
        return {
            message: `Product con ID ${id} eliminado exitosamente`
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        const product = await this.productService.update(id, updateProductDto);
        return {
            message: `Product con ID ${id} actualizado exitosamente`,
            data: product
        };
    }
}

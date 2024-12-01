import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('products')
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

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get("/search")
    findSearch(@Query('name') name: string) {
        return this.productService.findSearch(name);
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

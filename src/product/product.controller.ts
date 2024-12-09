import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/uploadImage.dto';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
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
    
    @Get('/menu/:id')
    findMenuId(@Param('id') id: number) {
        return this.productService.findMenuId(id);
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor')
    @Patch(':id/photo')
    @UseInterceptors(FileInterceptor('photo'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UploadImageDto,
    })
    async updatePhoto(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        const photoUrl = await this.productService.uploadPhoto(file, id);
        const updatedSale = await this.productService.updatePhoto(id, photoUrl);
        return {
            message: 'Foto de producto actualizada exitosamente',
            data: updatedSale,
        };
    }
}

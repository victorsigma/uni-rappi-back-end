import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { StoreService } from './store.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateStoreDto } from './dto/createStore.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/uploadImage.dto';

@ApiTags('Stores')
@Controller('store')
@ApiBearerAuth()
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() createStoreDto: CreateStoreDto) {
        const product = await this.storeService.create(createStoreDto);
        return {
            message: 'Store creado exitosamente',
            data: product
        };
    }

    @Get()
    findAll() {
        return this.storeService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor')
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.storeService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.storeService.remove(id);
        return {
            message: `Store con ID ${id} eliminado exitosamente`
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateStoreDto: UpdateStoreDto) {
        const product = await this.storeService.update(id, updateStoreDto);
        return {
            message: `Store con ID ${id} actualizado exitosamente`,
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
        const photoUrl = await this.storeService.uploadPhoto(file, id);
        const updatedSale = await this.storeService.updatePhoto(id, photoUrl);
        return {
            message: 'Foto de tienda actualizada exitosamente',
            data: updatedSale,
        };
    }
}

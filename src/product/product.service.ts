import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Like, QueryRunner, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Menu } from 'src/menu/menu.entity';
import { SupabaseService } from 'src/global/supabase.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly supabaseService: SupabaseService,
    ) { }

    async findByProductname(productname: string): Promise<Product | undefined> {
        return this.productRepository.findOne({ where: { productname } });
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const queryRunner: QueryRunner = this.productRepository.manager.connection.createQueryRunner();

        const menu = await queryRunner.manager.findOne(Menu, { where: { id: createProductDto.menu_id } });

        if (!menu) {
            throw new Error(`Menu con ID ${createProductDto.menu_id} no encontrado`);
        }


        const newProduct = this.productRepository.create({ ...createProductDto, menu });
        return this.productRepository.save(newProduct);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product con ID ${id} no encontrado`);
        }
        return product;
    }

    async findSearch(name: string): Promise<Product[]> {
        const products = await this.productRepository.find({where: { productname: Like(`%${name}%`)}});
        if(!products.length) {
            throw new NotFoundException(`Producto no disponible o no existe`);
        }
        return products;
    }

    async remove(id: number): Promise<void> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product con ID ${id} no encontrado, no se pudo eliminar`);
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const ProductToUpdate = await this.findOne(id);
        Object.assign(ProductToUpdate, updateProductDto);

        return this.productRepository.save(ProductToUpdate);
    }

    async updatePhoto(id: number, photoUrl: string): Promise<Product> {
        const productToUpdate = await this.findOne(id);
        if (productToUpdate.photoUrl) {
            await this.supabaseService.deleteFile(productToUpdate.photoUrl, 'Productos');
        }
        productToUpdate.photoUrl = photoUrl;
        return this.productRepository.save(productToUpdate);
    }

    async uploadPhoto(file: Express.Multer.File, productId: number): Promise<string> {
        const product = await this.findOne(productId); // Verificar que el usuario existe
        if (!file) {
            throw new BadRequestException('No se ha recibido ninguna imagen.');
        }

        // Verificar si el archivo es una imagen
        const fileMimeType = file.mimetype;
        if (!fileMimeType || !fileMimeType.startsWith('image/')) {
            throw new BadRequestException('El archivo debe ser una imagen.');
        }

        const photoUrl = await this.supabaseService.uploadFile(file, 'Productos');
        return photoUrl;
    }
}

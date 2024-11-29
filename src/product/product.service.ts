import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    async findByProductname(productname: string): Promise<Product | undefined> {
        return this.productRepository.findOne({ where: { productname } });
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = this.productRepository.create({ ...createProductDto });
        return this.productRepository.save(newProduct);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOne(id: number): Promise<Product> {
        const user = await this.productRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Product con ID ${id} no encontrado`);
        }
        return user;
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
}

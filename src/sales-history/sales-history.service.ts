import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesHistory } from './sales-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSalesHistoryDto } from './dto/createSaleHistory.dto';

@Injectable()
export class SalesHistoryService {
    constructor(
        @InjectRepository(SalesHistory)
        private readonly salesHistoryRepository: Repository<SalesHistory>
    ) { }


    async create(createSalesHistoryDto: CreateSalesHistoryDto): Promise<SalesHistory> {
        const newSalesHistory = this.salesHistoryRepository.create({ ...createSalesHistoryDto });
        return this.salesHistoryRepository.save(newSalesHistory);
    }

    async findAll(): Promise<SalesHistory[]> {
        return this.salesHistoryRepository.find();
    }

    async findOne(id: number): Promise<SalesHistory> {
        const product = await this.salesHistoryRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`SalesHistory con ID ${id} no encontrado`);
        }
        return product;
    }

    async remove(id: number): Promise<void> {
        const result = await this.salesHistoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`SalesHistory con ID ${id} no encontrado, no se pudo eliminar`);
        }
    }
}

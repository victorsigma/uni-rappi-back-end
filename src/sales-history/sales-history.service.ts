import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesHistory } from './sales-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSalesHistoryDto } from './dto/createSaleHistory.dto';

@Injectable()
export class SalesHistoryService {
}

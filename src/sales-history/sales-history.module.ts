import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesHistory } from './sales-history.entity';
import { SalesHistoryService } from './sales-history.service';
import { SalesHistoryController } from './sales-history.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SalesHistory])],
    providers: [SalesHistoryService],
    controllers: [SalesHistoryController],
    exports: [SalesHistoryService]
})
export class SalesHistoryModule { }

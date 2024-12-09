import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateSaleDto } from './dto/createSales.dto';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateSaleDto } from './dto/updateSales.dto';
import { isString } from 'class-validator';
import { error } from 'console';

@ApiTags('Sales')
@Controller('sales')
@ApiBearerAuth()
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    @Post()
    async create(@Body() createSaleDto: CreateSaleDto) {
        const sale = await this.salesService.create(createSaleDto);
        const res = {
            message: isString(sale) ? sale : 'Sale creado exitosamente',
            data: isString(sale) ? { error: true } : sale
        };

        return res;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor', 'user')
    @Get('/user/:id')
    async findAllForUser(@Param('id') id: number) {
        const sales = await this.salesService.findAllForUser(id);
        return sales;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'vendedor', 'user')
    @Get('/filter/')
    @ApiQuery({ name: 'created_at', required: false, type: String })
    @ApiQuery({ name: 'user_id', required: false, type: String })
    @ApiQuery({ name: 'cancel', required: false, type: String })
    @ApiQuery({ name: 'start_date', required: false, type: String })
    @ApiQuery({ name: 'end_date', required: false, type: String })
    async findAllFilter(@Query('created_at') created_at?: string, @Query('user_id') user_id?: string,
        @Query('cancel') cancel?: string,
        @Query('start_date') start_date?: string,
        @Query('end_date') end_date?: string) {
        const parsedCreatedAt = created_at ? new Date(created_at) : undefined;
        const parsedUserId = user_id ? Number(user_id) : undefined;
        const parsedCancel = cancel ? cancel.toLowerCase() === 'true' : undefined;
        const parsedStartDate = start_date ? new Date(start_date) : undefined;
        const parsedEndDate = end_date ? new Date(end_date) : undefined;
        const sales = await this.salesService.findAllFilter(parsedCreatedAt, parsedUserId, parsedCancel, parsedStartDate, parsedEndDate);
        return sales;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto) {
        const sale = await this.salesService.update(id, updateSaleDto);
        return {
            message: `Sale con ID ${id} actualizado exitosamente`,
            data: sale
        };
    }
}

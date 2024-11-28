import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/createMenu.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpdateMenuDto } from './dto/updateMenu.dto';

@ApiTags('Menus')
@Controller('menu')
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return {
      message: 'Menu creado exitosamente',
      data: menu
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor', 'comprador')
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.menuService.remove(id);
    return {
      message: `Menu con ID ${id} eliminado exitosamente`
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuService.update(id, updateMenuDto);
    return {
      message: `Menu con ID ${id} actualizado exitosamente`,
      data: menu
    };
  }
}

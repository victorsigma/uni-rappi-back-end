import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/createMenu.dto';
import { UpdateMenuDto } from './dto/updateMenu.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>
    ) { }

    async findByMenuname(menuname: string): Promise<Menu | undefined> {
        return this.menuRepository.findOne({ where: { menuname } });
    }

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        const newMenu = this.menuRepository.create({ ...createMenuDto });
        return this.menuRepository.save(newMenu);
    }

    async findAll(): Promise<Menu[]> {
        return this.menuRepository.find();
    }

    async findOne(id: number): Promise<Menu> {
        const user = await this.menuRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Menu con ID ${id} no encontrado`);
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        const result = await this.menuRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Menu con ID ${id} no encontrado, no se pudo eliminar`);
        }
    }

    async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
        const menuToUpdate = await this.findOne(id);
        Object.assign(menuToUpdate, updateMenuDto);

        return this.menuRepository.save(menuToUpdate);
    }
}

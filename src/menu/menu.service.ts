import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './menu.entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/createMenu.dto';
import { UpdateMenuDto } from './dto/updateMenu.dto';
import { Store } from 'src/store/store.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) { }

    async findByMenuname(menuname: string): Promise<Menu | undefined> {
        return this.menuRepository.findOne({ where: { menuname } });
    }

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        const queryRunner: QueryRunner = this.menuRepository.manager.connection.createQueryRunner();

        const store = await queryRunner.manager.findOne(Store, { where: { id: createMenuDto.idStore } });

        if (!store) {
            throw new Error(`Tienda con ID ${createMenuDto.idStore} no encontrada`);
        }

        const newMenu = this.menuRepository.create({ ...createMenuDto, store });
        return this.menuRepository.save(newMenu);
    }

    async findAll(): Promise<Menu[]> {
        return this.menuRepository.find();
    }

    async findOne(id: number): Promise<Menu> {
        const menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
            throw new NotFoundException(`Menu con ID ${id} no encontrado`);
        }
        return menu;
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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Store } from './store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/createStore.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';
import { SupabaseService } from 'src/global/supabase.service';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly supabaseService: SupabaseService,
    ) { }

    async findByStorename(storename: string): Promise<Store | undefined> {
        return this.storeRepository.findOne({ where: { storename } });
    }

    async create(createStoreDto: CreateStoreDto): Promise<Store> {
        const newStore = this.storeRepository.create({ ...createStoreDto });
        return this.storeRepository.save(newStore);
    }

    async findAll(): Promise<Store[]> {
        return this.storeRepository.find();
    }

    async findOne(id: number): Promise<Store> {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) {
            throw new NotFoundException(`Store con ID ${id} no encontrado`);
        }
        return store;
    }

    async remove(id: number): Promise<void> {
        const result = await this.storeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Store con ID ${id} no encontrado, no se pudo eliminar`);
        }
    }

    async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
        const StoreToUpdate = await this.findOne(id);
        Object.assign(StoreToUpdate, updateStoreDto);

        return this.storeRepository.save(StoreToUpdate);
    }

    async updatePhoto(id: number, photoUrl: string): Promise<Store> {
        const storeToUpdate = await this.findOne(id);
        if (storeToUpdate.photoUrl) {
            await this.supabaseService.deleteFile(storeToUpdate.photoUrl, 'Tiendas');
        }
        storeToUpdate.photoUrl = photoUrl;
        return this.storeRepository.save(storeToUpdate);
    }

    async uploadPhoto(file: Express.Multer.File, menuId: number): Promise<string> {
        const menu = await this.findOne(menuId); // Verificar que el usuario existe
        if (!file) {
            throw new BadRequestException('No se ha recibido ninguna imagen.');
        }

        // Verificar si el archivo es una imagen
        const fileMimeType = file.mimetype;
        if (!fileMimeType || !fileMimeType.startsWith('image/')) {
            throw new BadRequestException('El archivo debe ser una imagen.');
        }

        const photoUrl = await this.supabaseService.uploadFile(file, 'Menus');
        return photoUrl;
    }
}

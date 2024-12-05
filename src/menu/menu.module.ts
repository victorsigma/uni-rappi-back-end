import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Store } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Store])],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService]
})
export class MenuModule { }

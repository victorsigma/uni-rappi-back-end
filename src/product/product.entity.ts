import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Menu } from 'src/menu/menu.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    productname: string;

    @ApiProperty()
    @Column()
    productDescription: string;

    @ApiProperty()
    @Column()
    price: number;

    @ApiProperty()
    @Column()
    stock: number;

    @ManyToOne(() => Menu)
    @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
    menu: Menu;

    categories: [];
}

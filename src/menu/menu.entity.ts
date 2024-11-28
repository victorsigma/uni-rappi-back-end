import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from 'src/store/store.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    menuname: string;

    @ApiProperty()
    @OneToOne(type => Store)
    @JoinColumn()
    @Column()
    idStore: number;

    @OneToMany(() => Product, product => product.menu)
    @JoinColumn()
    products: Product[];
}

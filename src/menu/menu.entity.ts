import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
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
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store: Store;

    @OneToMany(() => Product, product => product.menu)
    @JoinColumn()
    products: Product[];

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at: Date; // Deletion date
}

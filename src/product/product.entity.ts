import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Menu } from 'src/menu/menu.entity';
import { SaleProduct } from 'src/sales/sale-product.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    productname: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    price: number;

    @ApiProperty()
    @Column()
    stock: number;

    @ApiProperty()
    @Column({ name: 'photo_url', nullable: true })
    photoUrl: string | null;

    @ManyToOne(() => Menu)
    @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
    menu: Menu;

    @OneToMany(() => SaleProduct, saleProduct => saleProduct.product)
    saleProducts: SaleProduct[];

    categories: [];

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at: Date; // Deletion date
}

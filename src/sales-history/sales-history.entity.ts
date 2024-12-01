import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class SalesHistory {
    @PrimaryGeneratedColumn()
    id: number;

    //@ManyToOne(() => User, user => user.salesHistories)
    @ApiProperty()
    idUser: number; // The associated User object

    @ManyToMany(() => Product)
    @JoinTable()
    @ApiProperty({ type: [Product] })
    products: Product[]; // Array of associated products in this sales history
}

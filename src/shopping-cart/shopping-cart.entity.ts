import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { CartProduct } from './cart-product.entity';

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty()
    @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @OneToMany(() => CartProduct, cartProduct => cartProduct.cart, { cascade: true })
    @ApiProperty({ type: [CartProduct] })
    cartProducts: CartProduct[];

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at: Date; // Deletion date
}

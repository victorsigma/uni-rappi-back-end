import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/product/product.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SaleProduct } from "./sale-product.entity";

@Entity()
export class Sales {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @ApiProperty()
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToMany(() => SaleProduct, saleProduct => saleProduct.sale, { cascade: true })
    @ApiProperty({ type: [SaleProduct] })
    saleProducts: SaleProduct[];

    @ApiProperty({ type: [Product] })
    get products(): Product[] {
        return this.saleProducts.map(saleProduct => saleProduct.product);
    }

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at: Date; // Deletion date

    @ApiProperty()
    @Column({ name: 'cancel', type: 'bool', default: false })
    cancel: boolean;

    set products(products: Product[]) {
        this.saleProducts = products.map(product => {
            const saleProduct = new SaleProduct();
            saleProduct.product = product;
            saleProduct.quantity = 1; // Por defecto, la cantidad es 1. Esto puedes ajustarlo después.
            saleProduct.price = product.price;
            saleProduct.total = saleProduct.price * saleProduct.quantity;
            return saleProduct;
        });
    }
}

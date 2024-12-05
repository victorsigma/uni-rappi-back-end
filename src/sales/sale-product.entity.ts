import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Sales } from './sales.entity';
import { Product } from 'src/product/product.entity';


@Entity()
export class SaleProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sales, sale => sale.saleProducts)
    @JoinColumn({ name: 'sale_id' })
    sale: Sales;

    @ManyToOne(() => Product, product => product.saleProducts)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int', default: 1 })  // Puedes poner la cantidad por defecto a 1
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;  // Total para este producto (cantidad * precio)
}

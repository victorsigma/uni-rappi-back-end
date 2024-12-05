import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { ShoppingCart } from './shopping-cart.entity';


@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ShoppingCart, cart => cart.cartProducts)
    @JoinColumn({ name: 'cart_id' })
    cart: ShoppingCart;

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

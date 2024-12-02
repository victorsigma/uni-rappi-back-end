import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from './shopping-cart.entity';
import { QueryRunner, Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { UpdateShoppingCartDto } from './dto/updateShoppingCart.dto';
import { Product } from 'src/product/product.entity';
import { CartProduct } from './cart-product.entity';

@Injectable()
export class ShoppingCartService {
    constructor(
        @InjectRepository(ShoppingCart)
        private readonly cartRepository: Repository<ShoppingCart>,
        @InjectRepository(CartProduct)
        private readonly cartProductRepository: Repository<CartProduct>,
    ) { }

    async add(id: number, updateCartDto: UpdateShoppingCartDto): Promise<ShoppingCart> {
        const queryRunner: QueryRunner = this.cartRepository.manager.connection.createQueryRunner();

        // Iniciar la transacción
        await queryRunner.startTransaction();

        try {
            // Buscar el usuario
            const user = await queryRunner.manager.findOne(User, { where: { id } });

            if (!user) {
                throw new Error(`Usuario con ID ${id} no encontrado`);
            }

            // Obtener producto de manera concurrente
            const product = await queryRunner.manager.findOne(Product, { where: { id: updateCartDto.product.id } });

            // Verificar que el producto exista
            if (!product) {
                throw new Error(`Producto con ID ${updateCartDto.product.id} no encontrado`);
            }

            // Obtiene el carrito del usuario, si no existe, crea uno nuevo
            const cart = await this.cartRepository.findOne({ where: { user } });

            if (!cart) {
                // Si el carrito no existe, crea uno nuevo
                let newCart = new ShoppingCart();
                newCart.user = user;
                newCart.cartProducts = [];  // Inicializar el array de productos
                newCart.balance = 0;  // Inicializar el balance
                await queryRunner.manager.save(ShoppingCart, newCart);
                await queryRunner.commitTransaction();
            }

            const cartProducts = await this.cartProductRepository.find({ where: { cart: { id: cart.id } } })
            console.log(cartProducts)

            // Agrega aqui van las comprobacioes de productos duplicados
            if (cartProducts.length > 0) {
                const existingProduct = cartProducts.find(cartProduct => cartProduct.product.id === updateCartDto.product.id);

                if (existingProduct) {
                    existingProduct.quantity += updateCartDto.product.quantity;
                    existingProduct.total = existingProduct.quantity * product.price;
                    await queryRunner.manager.save(existingProduct);
                } else {
                    const newCartProduct = queryRunner.manager.create(CartProduct, {
                        cart,
                        product,
                        quantity: updateCartDto.product.quantity,
                        price: product.price,
                        total: updateCartDto.product.quantity * product.price,
                    });
                    await queryRunner.manager.save(CartProduct, newCartProduct);
                }
            } else {
                const newCartProduct = queryRunner.manager.create(CartProduct, {
                    cart,
                    product,
                    quantity: updateCartDto.product.quantity,
                    price: product.price,
                    total: updateCartDto.product.quantity * product.price,
                });
                await queryRunner.manager.save(CartProduct, newCartProduct);
            }

            const products = await this.cartProductRepository.find({ where: { cart: { id: cart.id } } })

            cart.balance = products.reduce((sum, cartProduct) => sum + cartProduct.total, 0);

            // Guardar el carrito actualizado en la transacción
            const updateCart = await queryRunner.manager.save(ShoppingCart, cart);

            // Confirmar la transacción
            await queryRunner.commitTransaction();

            return updateCart;

        } catch (error) {
            // Si ocurre un error, revertimos la transacción
            await queryRunner.rollbackTransaction();
            throw new HttpException('Error al agregar el producto al carrito: ' + error.message, HttpStatus.BAD_REQUEST);
        } finally {
            // Liberar el QueryRunner
            await queryRunner.release();
        }
    }
}

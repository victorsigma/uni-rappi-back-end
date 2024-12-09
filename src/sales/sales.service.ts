import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/createSales.dto';
import { Sales } from './sales.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryRunner, Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Product } from 'src/product/product.entity';
import { SaleProduct } from './sale-product.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { UpdateSaleDto } from './dto/updateSales.dto';
import { CartProduct } from 'src/shopping-cart/cart-product.entity';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.entity';

@Injectable()
@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sales)
        private readonly salesRepository: Repository<Sales>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(createSalesDto: CreateSaleDto): Promise<Sales> {
        const queryRunner: QueryRunner = this.salesRepository.manager.connection.createQueryRunner();

        // Iniciar la transacción
        await queryRunner.startTransaction();

        try {
            // Buscar el usuario
            const user = await queryRunner.manager.findOne(User, { where: { id: createSalesDto.user_id } });

            if (!user) {
                throw new Error(`Usuario con ID ${createSalesDto.user_id} no encontrado`);
            }

            // Obtener productos de manera concurrente
            const productPromises = createSalesDto.products.map(productDto =>
                queryRunner.manager.findOne(Product, { where: { id: productDto.id } })
            );

            const products = await Promise.all(productPromises);

            // Verificar que todos los productos existan
            products.forEach((product, index) => {
                if (!product) {
                    throw new Error(`Producto con ID ${createSalesDto.products[index].id} no encontrado`);
                }
            });

            // Validación de stock y creación de la relación SaleProduct
            const saleProducts = createSalesDto.products.map(productDto => {
                const product = products.find(p => p.id === productDto.id);

                if (product.stock < productDto.quantity) {
                    throw new Error(`No hay suficiente stock para el producto ${product.productname}. Stock disponible: ${product.stock}, cantidad solicitada: ${productDto.quantity}`);
                }

                // Reducir el stock del producto
                product.stock -= productDto.quantity;

                // Crear la relación SaleProduct
                const saleProduct = new SaleProduct();
                saleProduct.product = product;
                saleProduct.quantity = productDto.quantity;
                saleProduct.price = product.price;
                saleProduct.total = productDto.quantity * product.price;
                return saleProduct;
            });

            // Crear el objeto de venta con los productos y balance
            const balance = saleProducts.reduce((sum, saleProduct) => sum + saleProduct.total, 0);

            // Buscar el wallet del usuario
            const wallet = await queryRunner.manager.findOne(Wallet, { where: { user } });

            if (!wallet) {
                throw new HttpException(`No se encontró billetera para ${user.username}`, HttpStatus.BAD_REQUEST);
            }

            // Verificar si el saldo de la billetera es suficiente
            if (wallet.balance < balance) {
                
                throw new HttpException(`Fondos insuficientes. El saldo disponible es ${wallet.balance}, pero la venta cuesta ${balance}`, HttpStatus.BAD_REQUEST);
            }

            // Descontar el balance de la billetera
            wallet.balance -= balance;

            // Actualizar la billetera dentro de la misma transacción
            await queryRunner.manager.save(Wallet, wallet);

            // Actualizar el stock de los productos dentro de la misma transacción
            await Promise.all(products.map(product => queryRunner.manager.save(Product, product)));

            const cart = await queryRunner.manager.findOne(ShoppingCart, {
                where: { user: { id: user.id } },
            });

            const cartProducts = await queryRunner.manager
                .createQueryBuilder(CartProduct, 'cart_product')
                .innerJoinAndSelect('cart_product.product', 'product') // Relaciona con la tabla 'product'
                .where('cart_product.cart_id = :cart_id', { cart_id: cart.id })
                .getMany();

            //Limpiar carrito
            await Promise.all(cartProducts.map(product => queryRunner.manager.remove(CartProduct, product)));

            cart.balance = 0;

            // Guardar el carrito actualizado en la transacción
            await queryRunner.manager.save(ShoppingCart, cart);

            // Crear la venta
            const sale = this.salesRepository.create({
                user,
                saleProducts,  // Relacionamos los productos con cantidades
                balance,
            });

            // Guardar la venta en la transacción
            const newSale = await queryRunner.manager.save(Sales, sale);

            // Confirmar la transacción
            await queryRunner.commitTransaction();

            return newSale;

        } catch (error) {
            // Si ocurre un error, revertimos la transacción
            await queryRunner.rollbackTransaction();
            return error.message;
        } finally {
            // Liberar el QueryRunner
            await queryRunner.release();
        }
    }

    async findAllForUser(user_id: number): Promise<Array<{
        id: number,
        balance: number,
        saleProducts: SaleProduct[]
    }>> {
        const queryRunner: QueryRunner = this.salesRepository.manager.connection.createQueryRunner();

        const user = await queryRunner.manager.findOne(User, { where: { id: user_id } });

        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
        }

        const sales = await this.salesRepository.find({ where: { user } });

        const salesUserPromises = sales.map(async (sale) => {
            const saleProducts = await queryRunner.manager
                .createQueryBuilder(SaleProduct, 'sale_product')
                .innerJoinAndSelect('sale_product.product', 'product')
                .where('sale_product.sale_id = :sale_id', { sale_id: sale.id })
                .getMany();

            if (!saleProducts) {
                throw new HttpException('Productos no encontrados', HttpStatus.BAD_REQUEST);
            }
            return { id: sale.id, balance: sale.balance, saleProducts }
        })

        const salesUser = await Promise.all(salesUserPromises);

        await queryRunner.release();
        return salesUser;
    }

    async findAllFilter(
        created_at?: Date,
        user_id?: number,
        cancel?: boolean,
        start_date?: Date,
        end_date?: Date
    ): Promise<Array<{
        id: number,
        balance: number,
        saleProducts: SaleProduct[]
    }>> {
        const queryRunner: QueryRunner = this.salesRepository.manager.connection.createQueryRunner();

        // Verificación del usuario
        const user = user_id ? await queryRunner.manager.findOne(User, { where: { id: user_id } }) : null;

        const whereConditions: any = {};

        // Filtros de fecha
        if (start_date && end_date) {
            whereConditions.created_at = Between(start_date, end_date);
        } else if (created_at) {
            // Si solo tenemos una fecha exacta
            const date = new Date(created_at);
            if (isNaN(date.getTime())) {
                throw new HttpException('Fecha proporcionada no válida', HttpStatus.BAD_REQUEST);
            }
            date.setHours(23, 59, 59, 999);
            whereConditions.created_at = Between(created_at, date);
        }

        // Filtros adicionales
        if (user) whereConditions.user = user;
        if (cancel !== undefined) whereConditions.cancel = cancel;

        // Búsqueda de ventas con condiciones dinámicas
        const sales = await this.salesRepository.find({ where: whereConditions })

        // Obtener los productos de cada venta
        const salesUserPromises = sales.map(async (sale) => {
            const saleProducts = await queryRunner.manager
                .createQueryBuilder(SaleProduct, 'sale_product')
                .innerJoinAndSelect('sale_product.product', 'product')
                .where('sale_product.sale_id = :sale_id', { sale_id: sale.id })
                .getMany();

            if (!saleProducts) {
                throw new Error(`Productos de la venta ${sale.id} no encontrados`);
            }

            return { id: sale.id, balance: sale.balance, saleProducts };
        });

        const salesUser = await Promise.all(salesUserPromises);

        await queryRunner.release();
        return salesUser;
    }

    async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sales> {
        const saleToUpdate = await this.salesRepository.findOne({ where: { id } });
        Object.assign(saleToUpdate, updateSaleDto);

        return this.salesRepository.save(saleToUpdate);
    }
}

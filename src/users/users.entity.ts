import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from 'src/wallet/wallet.entity';
import { Sales } from 'src/sales/sales.entity';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
@Unique(['controlNumber'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'username' })
  username: string;

  @ApiProperty()
  @Column({ name: 'email' })
  email: string;

  @ApiProperty()
  @Column({ name: 'full_name' })
  fullName: string;

  @ApiProperty()
  @Column({ name: 'password' })
  password: string;

  @ApiProperty({ enum: ['user', 'admin', 'vendedor'] })
  @Column({ name: 'role', default: 'user' })
  role: string;

  @ApiProperty()
  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string | null;

  @ApiProperty()
  @Column({ name: 'control_number' })
  controlNumber: string;

  @ApiProperty()
  @Column({ name: 'group' })
  group: string;

  @ApiProperty()
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ApiProperty()
  @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.user, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopping_cart_id' })
  shoppingCart: ShoppingCart;

  @ApiProperty()
  @OneToMany(() => Sales, sale => sale.user, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sales: Sales[];
}

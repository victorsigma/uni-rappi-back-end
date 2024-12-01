import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from 'src/wallet/wallet.entity';

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
}

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;
}

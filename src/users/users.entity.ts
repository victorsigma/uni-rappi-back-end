import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  fullName: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: ['user', 'admin', 'vendedor'] })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty()
  @Column({ nullable: true })
  photoUrl: string | null;

  @ApiProperty()
  @Column()
  controlNumber: string;

  @ApiProperty()
  @Column()
  group: string;
}

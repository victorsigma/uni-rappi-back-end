import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    storename: string;

    @ApiProperty()
    @Column()
    description: string;
}
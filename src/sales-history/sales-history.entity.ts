import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SalesHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    menuname: string;


}

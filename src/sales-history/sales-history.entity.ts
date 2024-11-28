import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    menuname: string;


}

import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from 'src/store/store.entity';

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    menuname: string;

    @ApiProperty()
    @OneToOne(type => Store)
    @JoinColumn()
    @Column()
    idStore: number;
}

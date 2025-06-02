import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() userId: number;
    @Column() nftId: number;
    @Column() type: string;
    @CreateDateColumn() createdAt: Date;
}
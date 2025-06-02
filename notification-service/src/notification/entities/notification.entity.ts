import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: number;
  @Column() type: string;
  @Column() message: string;
  @Column({ default: false }) read: boolean=false;
  @CreateDateColumn() createdAt: Date;
}
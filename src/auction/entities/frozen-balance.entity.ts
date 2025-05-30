import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FrozenBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  auctionId: number;

  @Column('decimal')
  amount: number;

  @Column()
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

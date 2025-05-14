import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auction } from './auction.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bidderId: number;

  @Column()
  amount: number;

  @ManyToOne(() => Auction, auction => auction.bids)
  auction: Auction;

  @CreateDateColumn()
  createdAt: Date;
}

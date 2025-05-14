import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bid } from './bid.entity';
import { JoinAuction } from './joinAuction.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nftId: string;

  @Column()
  ownerId: number;

  @Column('decimal')
  startingPrice: number;

  @Column()
  duration: number;

  @Column({ default: false })
  isEnded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Bid, bid => bid.auction)
  bids: Bid[];

  @OneToMany(() => JoinAuction, participant => participant.auction)
  participants: JoinAuction[];
}

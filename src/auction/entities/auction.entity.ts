import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from './bid.entity';
import { JoinAuction } from './joinAuction.entity';
import { Nft } from 'src/nft/entities/nft.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nftId: number;

  @Column()
  ownerId: number;

  @Column({ nullable: true })
  winnerId: number;

  @Column({ nullable: true })
  maxBidAmount: number;

  @Column('decimal')
  startingPrice: number;

  @Column()
  duration: number;

  @Column({ default: false })
  isEnded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @OneToMany(() => JoinAuction, (participant) => participant.auction)
  participants: JoinAuction[];

  @ManyToOne(() => Nft, (nft) => nft.auctions)
  nft: Nft;
}

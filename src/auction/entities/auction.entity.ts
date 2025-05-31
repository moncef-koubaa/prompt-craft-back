import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Bid } from './bid.entity';
import { JoinAuction } from './joinAuction.entity';
import { Nft } from 'src/nft/entities/nft.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Auction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  startingPrice: number;

  @Field(() => Int)
  @Column()
  nftId: number;

  @Column()
  ownerId: number;

  @Column({ nullable: true })
  winnerId: number;

  @Column({ nullable: true })
  maxBidAmount: number;

  @Field(() => Int)
  @Column()
  currentPrice: number;

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

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
  
  @Field(() => Int)
  @Column()
  ownerId: number;
  
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  winnerId: number;
  
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  maxBidAmount: number;

  @Field(() => Int)
  @Column()
  currentPrice: number;

  @Field(() => Int)
  @Column()
  duration: number;

  @Field()
  @Column({ default: false })
  isEnded: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  endTime: Date;

  @Field(() => [Bid], { nullable: true })
  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @OneToMany(() => JoinAuction, (participant) => participant.auction)
  participants: JoinAuction[];

  @Field(() => Nft)
  @ManyToOne(() => Nft, (nft) => nft.auctions)
  nft: Nft;
}

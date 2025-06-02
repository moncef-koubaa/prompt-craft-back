import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from './bid.entity';
import { JoinAuction } from './joinAuction.entity';
import { Nft } from 'src/nft/entities/nft.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class Auction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ nullable: true })
  description: string;

  @Field(() => Int)
  @Column({ nullable: true })
  startingPrice: number;

  @Field(() => Int)
  @Column()
  nftId: number;

  @Field(() => Int)
  @Column()
  ownerId: number;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  winnerId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'winnerId' })
  winner: User;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  maxBidAmount: number;

  @Field(() => Int)
  @Column({ nullable: true })
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
  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Field(() => [Bid], { nullable: true })
  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @OneToMany(() => JoinAuction, (participant) => participant.auction)
  participants: JoinAuction[];

  @Field(() => Nft)
  @ManyToOne(() => Nft, (nft) => nft.auctions)
  @JoinColumn({ name: 'nftId' })
  nft: Nft;
}

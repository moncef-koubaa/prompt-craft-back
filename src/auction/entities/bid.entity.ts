import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auction } from './auction.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class Bid {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @ManyToOne(() => User, user => user.bids)
  @Column()
  bidderId: number;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field(() => Auction)
  @ManyToOne(() => Auction, auction => auction.bids)
  auction: Auction;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}

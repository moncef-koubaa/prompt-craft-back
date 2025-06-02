import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, Int } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { Auction } from "../../auction/entities/auction.entity";

@ObjectType()
@Entity()
export class Nft {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: "default title" })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ownedNfts)
  owner: User;

  @Field(() => Int)
  @Column()
  ownerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdNfts)
  creator: User;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true, default: [] })
  tags?: string[];

  @Field(() => [Auction], { nullable: true })
  @ManyToMany(() => Auction, (auction) => auction.nft)
  @JoinTable()
  auctions?: Auction[];

  @Field()
  @Column({ default: false })
  isOnAuction: boolean;

  @Field()
  @Column({ default: false })
  isOnSale: boolean;
}

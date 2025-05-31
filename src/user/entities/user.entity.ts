import { JoinAuction } from "src/auction/entities/joinAuction.entity";
import { Nft } from "src/nft/entities/nft.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50, unique: true })
  username: string;

  @Field()
  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  emailVerified: boolean;

  @Column()
  balance: number;

  @Column({ default: 0 })
  tokens: number;

  @Column("text", { array: true })
  roles: string[];

  @OneToMany(() => JoinAuction, (participant) => participant.user)
  auctionParticipations: JoinAuction[];

  @Field(() => [Nft], { nullable: true })
  @OneToMany(() => Nft, (nft) => nft.owner)
  ownedNfts?: Nft[];

  @Field(() => [Nft], { nullable: true })
  @OneToMany(() => Nft, (nft) => nft.creator)
  createdNfts?: Nft[];
}
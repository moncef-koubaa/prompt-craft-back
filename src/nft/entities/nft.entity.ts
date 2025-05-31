import { Auction } from 'src/auction/entities/auction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  path: string;
  @ManyToOne(() => User, (user) => user.nfts, { eager: true })
  owner: User;
  @ManyToOne(() => User, (user) => user.nftsCreated)
  creator: User;
  @Column({ nullable: true })
  price: number;
  @Column()
  promptGeneratedBy: string;
  @Column()
  name: string;
  @OneToMany(() => Auction, (auction) => auction.nft)
  auctions: Auction[];
  @Column({ default: false })
  isOnAuction: boolean;
  @Column({ default: false })
  isOnSale: boolean;
}

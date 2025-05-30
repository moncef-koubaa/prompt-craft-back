import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from './auction.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class JoinAuction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.auctionParticipations)
  user: User;

  @ManyToOne(() => Auction, (auction) => auction.participants)
  auction: Auction;

  @CreateDateColumn()
  joinedAt: Date;
}

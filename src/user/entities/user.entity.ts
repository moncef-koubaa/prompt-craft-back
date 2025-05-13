import { JoinAuction } from 'src/auction/entities/joinAuction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

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

  @Column('text', { array: true })
  roles: string[];

  @OneToMany(() => JoinAuction, participant => participant.user)
  auctionParticipations: JoinAuction[];
}

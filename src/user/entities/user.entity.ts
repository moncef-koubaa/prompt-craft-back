import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: 0 })
  tokens: number;

  @Column('text', { array: true })
  roles: string[];
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.enum';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'enum', enum: Resource, default: Resource.TOKEN })
  resource: Resource;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column()
  isActive: boolean;
}

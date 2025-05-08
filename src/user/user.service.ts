import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(user: Partial<User>): Promise<User> {
    user.balance = 0;
    user.emailVerified = false;
    user.roles = ['user'];
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findOneBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
  ): Promise<User | null> {
    return this.userRepository.findOneBy(where);
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return 0;
    }
    return user.balance;
  }
}

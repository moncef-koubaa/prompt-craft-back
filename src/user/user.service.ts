import { BadRequestException, Injectable } from '@nestjs/common';
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
    user.tokens = 0;
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

  async makeAdmin(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.roles.push('admin');

    const { password, ...userWithoutPassword } =
      await this.userRepository.save(user);
    return userWithoutPassword;
  }

  async revokeAdmin(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.roles = user.roles.filter((role) => role !== 'admin');

    const { password, ...userWithoutPassword } =
      await this.userRepository.save(user);
    return userWithoutPassword;
  }
}

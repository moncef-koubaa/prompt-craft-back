import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { Auction } from "src/auction/entities/auction.entity";
import { FrozenBalance } from "src/auction/entities/frozen-balance.entity";
import { Nft } from "../nft/entities/nft.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
    @InjectRepository(FrozenBalance)
    private frozenBalanceRepo: Repository<FrozenBalance>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    user.balance = 0;
    user.tokens = 0;
    user.emailVerified = false;
    user.roles = ["user"];
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findOneBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
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
      throw new BadRequestException("User not found");
    }

    user.roles.push("admin");

    const { password, ...userWithoutPassword } =
      await this.userRepository.save(user);
    return userWithoutPassword;
  }

  async revokeAdmin(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    user.roles = user.roles.filter((role) => role !== "admin");

    const { password, ...userWithoutPassword } =
      await this.userRepository.save(user);
    return userWithoutPassword;
  }

  async addBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user != null) {
      user.balance += amount;
      await this.userRepository.save(user);
      return user.balance;
    }
  }

  async deductBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user != null) {
      if (user.balance < amount) {
        throw new Error("Insufficient funds");
      }
      user.balance -= amount;
      await this.userRepository.save(user);
      return user.balance;
    }
  }

  async unfreezeBidAmount(auction: Auction) {
    if (auction.winnerId) {
      const oldWinnerFrozenBalance = await this.frozenBalanceRepo.findOne({
        where: {
          userId: auction.winnerId,
          auctionId: auction.id,
          isActive: true,
        },
      });
      if (oldWinnerFrozenBalance) {
        this.addBalance(
          oldWinnerFrozenBalance.userId,
          oldWinnerFrozenBalance.amount,
        );
        oldWinnerFrozenBalance.isActive = false;
        await this.frozenBalanceRepo.save(oldWinnerFrozenBalance);
      }
    }
  }

  async freazeBidAmount(
    auction: Auction,
    currentWinnerId: number,
    amount: number,
  ) {
    this.deductBalance(currentWinnerId, amount);

    let frozenBalance = await this.frozenBalanceRepo.findOne({
      where: {
        userId: currentWinnerId,
        auctionId: auction.id,
      },
    });
    if (frozenBalance) {
      frozenBalance.amount = amount;
      frozenBalance.isActive = true;
    } else {
      frozenBalance = this.frozenBalanceRepo.create({
        userId: currentWinnerId,
        auctionId: auction.id,
        amount: amount,
        isActive: true,
      });
    }
    await this.frozenBalanceRepo.save(frozenBalance);
  }

  async transferBalance(fromUserId: number, toUserId: number, amount: number) {
    await this.deductBalance(fromUserId, amount);
    await this.addBalance(toUserId, amount);
  }
  async getOwnedNfts(userId: number): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { owner: { id: userId } },
      relations: ["owner"],
    });
  }
  async getEmail(userId: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return user.email;
  }
}

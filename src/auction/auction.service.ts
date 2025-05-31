import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { JoinAuction } from './entities/joinAuction.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { log } from 'console';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/user/entities/user.entity';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from 'src/user/user.service';
import { PriorityMutex } from './priority-mutex';
import { Nft } from 'src/nft/entities/nft.entity';
import { NftService } from 'src/nft/nft.service';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,
    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,
    @InjectRepository(JoinAuction)
    private joinRepo: Repository<JoinAuction>,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly nftService: NftService
  ) {}

  private auctionLocks: Map<number, PriorityMutex> = new Map();

  private getLockForAuction(auctionId: number): PriorityMutex {
    if (!this.auctionLocks.has(auctionId)) {
      this.auctionLocks.set(auctionId, new PriorityMutex());
    }
    return this.auctionLocks.get(auctionId)!;
  }

  async createAuction(dto: CreateAuctionDto, user: User) {
    const nft = await this.nftService.findOne(dto.nftId);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
    if (nft.owner.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this NFT');
    }
    if (nft.isOnAuction) {
      throw new BadRequestException('NFT is already on auction');
    }

    const endTime = new Date(Date.now() + dto.duration * 1000);
    const auction = this.auctionRepo.create({
      nftId: dto.nftId,
      ownerId: user.id,
      startingPrice: dto.startingPrice,
      duration: dto.duration,
      endTime: endTime,
      maxBidAmount: dto.startingPrice,
      isEnded: false,
    });
    return await this.auctionRepo.save(auction);
  }

  async getAuction(auctionId: number) {
    log('Fetching auction with ID:', auctionId);
    const auction = await this.auctionRepo.findOne({
      where: { id: auctionId },
      relations: ['bids', 'participants'],
    });

    return auction;
  }

  async joinAuction(auctionId: number, user: User) {
    const auction = await this.auctionRepo.findOneBy({ id: auctionId });
    if (!auction) throw new BadRequestException('Auction not found');

    if (auction.ownerId === user.id) {
      throw new BadRequestException('You cannot join your own auction');
    }

    const existingJoin = await this.joinRepo.findOne({
      where: {
        user: { id: user.id },
        auction: { id: auctionId },
      },
    });
    if (existingJoin) {
      throw new BadRequestException('Already joined the auction');
    }

    const join = this.joinRepo.create({
      user: user,
      auction,
    });

    return await this.joinRepo.save(join);
  }

  async isParticipant(auctionId: number, user: User): Promise<boolean> {
    const auction = await this.auctionRepo
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('auction.id = :auctionId', { auctionId })
      .getOne();
    if (!auction) return false;
    if (auction.isEnded) throw new WsException('Auction has ended');

    const participant = auction.participants.find(
      (participant) => participant.user.id === user.id
    );
    if (!participant) return false;
    return true;
  }

  async getMyAuctions(userId: number) {
    const auctions = await this.auctionRepo.find({
      where: { ownerId: userId },
      relations: ['bids', 'participants'],
    });
    return auctions;
  }

  async placeBid(dto: PlaceBidDto, bidderId: number) {
    const lock = this.getLockForAuction(dto.auctionId);
    await lock.runExclusive(async () => {
      let auction = await this.auctionRepo.findOneBy({ id: dto.auctionId });
      if (!auction) throw new WsException('Auction not found');
      if (auction.isEnded) throw new WsException('Auction has ended');

      const userBalance = await this.userService.getBalance(bidderId);
      if (userBalance < dto.amount) {
        throw new WsException('Insufficient funds');
      }

      if (dto.amount < auction.maxBidAmount) {
        throw new WsException('Bid amount is less than current highest bid');
      }

      // NB: order is important here
      await this.userService.unfreezeBidAmount(auction);
      await this.userService.freazeBidAmount(auction, bidderId, dto.amount);

      auction.winnerId = bidderId;
      auction.maxBidAmount = dto.amount;
      await this.auctionRepo.save(auction);

      const bid = this.bidRepo.create({
        auction,
        bidderId,
        amount: dto.amount,
      });

      return await this.bidRepo.save(bid);
    }, 1);
  }

  async endAuction(auction: Auction) {
    const lock = this.getLockForAuction(auction.id);
    await lock.runExclusive(async () => {
      auction.isEnded = true;
      await this.auctionRepo.save(auction);

      this.eventEmitter.emit('auction.ended', {
        auctionId: auction.id,
        winnerId: auction.winnerId,
        amount: auction.maxBidAmount,
      });

      // transfer NFT ownership
      await this.nftService.transferNft(auction.nftId, auction.winnerId);

      // transfer money to the owner
      await this.userService.unfreezeBidAmount(auction);
      this.userService.transferBalance(
        auction.winnerId,
        auction.ownerId,
        auction.maxBidAmount
      );
    }, 1000);
  }

  @Cron('*/5 * * * *')
  async scheduleAuctionEnd() {
    const now = new Date();
    const in5Minutes = new Date(now.getTime() + 5 * 60 * 1000);
    const auctions = await this.auctionRepo.find({
      where: {
        isEnded: false,
        endTime: LessThanOrEqual(in5Minutes),
      },
    });

    for (const auction of auctions) {
      const timeLeft = auction.endTime.getTime() - now.getTime();
      if (timeLeft > 0) {
        setTimeout(async () => {
          this.endAuction(auction);
        }, timeLeft);
      } else {
        this.endAuction(auction);
      }
    }
  }
}

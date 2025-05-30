import { BadRequestException, Injectable } from '@nestjs/common';
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
    private readonly userService: UserService
  ) {}

  async createAuction(dto: CreateAuctionDto) {
    // TODO: make with connected user check for onership and if already on auction change nft status
    const auction = this.auctionRepo.create(dto);
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

    log('praticipant:', auction.participants);
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
    await this.userService.freazeBidAmount(auction, bidderId, dto.amount);
    await this.userService.unfreezeBidAmount(auction);

    auction.winnerId = bidderId;
    auction.maxBidAmount = dto.amount;
    await this.auctionRepo.save(auction);

    const bid = this.bidRepo.create({
      auction,
      bidderId,
      amount: dto.amount,
    });

    return await this.bidRepo.save(bid);
  }

  async endAuction(auction: Auction) {
    auction.isEnded = true;
    await this.auctionRepo.save(auction);

    const highestBid = await this.bidRepo
      .createQueryBuilder('bid')
      .where('bid.auctionId = :auctionId', { auctionId: auction.id })
      .orderBy('bid.amount', 'DESC')
      .getOne();

    if (highestBid) {
      auction.winnerId = highestBid.bidderId;
      await this.auctionRepo.save(auction);

      this.eventEmitter.emit('auction.ended', {
        auctionId: auction.id,
        winnerId: highestBid.bidderId,
        amount: highestBid.amount,
      });

      // transfer NFT ownership

      // transfer money to the owner
    }
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

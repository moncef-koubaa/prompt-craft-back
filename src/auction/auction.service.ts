import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { JoinAuction } from './entities/joinAuction.entity';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { log } from 'console';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,

    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,

    @InjectRepository(JoinAuction)
    private joinRepo: Repository<JoinAuction>
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
    let auction = await this.auctionRepo.findOne({
      where: { id: dto.auctionId },
      relations: ['bids'],
    });

    if (!auction) throw new WsException('Auction not found');
    if (auction.isEnded) throw new WsException('Auction has ended');

    const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
    if (highest && dto.amount <= highest.amount)
      throw new WsException('Bid too low');

    auction = { id: auction.id } as Auction;
    const bid = this.bidRepo.create({
      amount: dto.amount,
      bidderId: bidderId,
      auction,
    });

    return await this.bidRepo.save(bid);
  }

  async endAuction(id: number) {
    const auction = await this.auctionRepo.findOne({
      where: { id },
      relations: ['bids', 'participants'],
    });

    if (auction) {
      auction.isEnded = true;
      await this.auctionRepo.save(auction);

      const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
      return highest;
    }
  }
}

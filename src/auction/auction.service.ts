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

  async getMyAuctions(userId: number) {
    const auctions = await this.auctionRepo.find({
      where: { ownerId: userId },
      relations: ['bids', 'participants'],
    });
    return auctions;
  }

  async placeBid(dto: PlaceBidDto, bidderId: number) {
    // const dto: PlaceBidDto =
    //   typeof dtoJson === 'string' ? JSON.parse(dtoJson) : dtoJson;

    const auction = await this.auctionRepo.findOne({
      where: { id: dto.auctionId },
      relations: ['bids', 'participants'],
    });

    if (!auction) throw new WsException('Auction not found');
    if (auction.isEnded) throw new WsException('Auction has ended');

    const hasJoined = await this.joinRepo.findOne({
      where: {
        user: { id: bidderId },
        auction: { id: dto.auctionId },
      },
    });

    if (!hasJoined) {
      throw new WsException('You must join the auction before placing a bid');
    }

    const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
    if (highest && dto.amount <= highest.amount)
      throw new WsException('Bid too low');

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

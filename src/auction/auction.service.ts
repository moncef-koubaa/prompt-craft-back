import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';

@Injectable()
export class AuctionService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepo: Repository<Auction>,

        @InjectRepository(Bid)
        private bidRepo: Repository<Bid>,
    ) { }

    async createAuction(dto: CreateAuctionDto) {
        const auction = this.auctionRepo.create(dto);
        return await this.auctionRepo.save(auction);
    }

    async placeBid(dto: PlaceBidDto) {
        console.log('Placing bid:', dto);
        const auction = await this.auctionRepo.findOne({
            where: { id: dto.auctionId },
            relations: ['bids'],
        });

        if (!auction || auction.isEnded) throw new Error('Auction not found or ended');

        const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
        if (highest && dto.amount <= highest.amount) throw new Error('Bid too low');

        const bid = this.bidRepo.create({
            amount: dto.amount,
            bidderId: dto.bidderId,
            auction,
        });

        return await this.bidRepo.save(bid);
    }

    async endAuction(id: number) {
        const auction = await this.auctionRepo.findOne({
            where: { id },
            relations: ['bids'],
        });

        if (auction) {
            auction.isEnded = true;
            await this.auctionRepo.save(auction);

            const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
            return highest;
        }
    }
}

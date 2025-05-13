import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { JoinAuction } from './entities/joinAuction.entity'
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

        @InjectRepository(JoinAuction)
        private joinRepo: Repository<JoinAuction>
    ) { }

    async createAuction(dto: CreateAuctionDto) {
        const auction = this.auctionRepo.create(dto);
        return await this.auctionRepo.save(auction);
    }

    async getAuction(auctionId: number) {
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

    async placeBid(dto: PlaceBidDto) {

        //Debugging
        console.log('Placing bid:', dto);
        console.log('-----------------------------------');
        console.log('Is instance of PlaceBidDto:', dto instanceof PlaceBidDto);
        console.log('-----------------------------------');
        console.log('Bidder ID:', dto.bidderId);
        console.log('Bid Amount:', dto.amount);
        console.log('Auction ID:', dto.auctionId);
        console.log('-----------------------------------');

        // ----------------------------------

        // Check if the auction exists and is not ended
        const auction = await this.auctionRepo.findOne({
            where: { id: dto.auctionId },
            relations: ['bids'],
        });

        if (!auction) throw new Error('Auction not found');
        if (auction.isEnded) throw new Error('Auction has ended');

        // Verify if the user has joined the auction
        const hasJoined = await this.joinRepo.findOne({
            where: {
                user: { id: dto.bidderId },  
                auction: { id: dto.auctionId },
            },
        });

        if (!hasJoined) {
            throw new Error('You must join the auction before placing a bid');
        }

        // Check if the bid is higher than the current highest bid
        const highest = auction.bids.sort((a, b) => b.amount - a.amount)[0];
        if (highest && dto.amount <= highest.amount) throw new Error('Bid too low');

        // Place the bid
        const bid = this.bidRepo.create({
            amount: dto.amount,
            bidderId: dto.bidderId,
            auction,
        });

        console.log('Bid created:', bid);

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

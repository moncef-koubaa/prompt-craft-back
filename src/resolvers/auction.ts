import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Auction } from '../auction/entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Public } from 'src/decorator/public.decorator';

@Resolver(() => Auction)
export class AuctionResolver {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
    
    @Public()
    @Query(() => [Auction], { name: 'getAuctions' })
    async getAuctions(): Promise<Auction[]> {
        return this.auctionRepository.find({
        relations: ['nft', 'bids'],
        order: { createdAt: 'DESC' },
        });
    }
    
    @Public()
    @Query(() => Auction, { name: 'getAuction' })
    async getAuction(@Args('id') id: number): Promise<Auction> {
        const auction = await this.auctionRepository.findOne({
        where: { id },
        relations: ['nft', 'bids'],
        });
        if (!auction) {
        throw new Error('Auction not found');
        }
        return auction;
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByUser' })
    async getAuctionsByUser(@Args('userId') userId: number): Promise<Auction[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return this.auctionRepository.find({
            where: { ownerId: userId },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getActiveAuctions' })
    async getActiveAuctions(): Promise<Auction[]> {
        const currentTime = new Date();
        return this.auctionRepository.find({
            where: {
                isEnded: false,
                endTime: MoreThan(currentTime),
            },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getEndedAuctions' })
    async getEndedAuctions(): Promise<Auction[]> {
        const currentTime = new Date();
        return this.auctionRepository.find({
            where: {
                isEnded: true,
                endTime: MoreThan(currentTime),
            },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getUpcomingAuctions' })
    async getUpcomingAuctions(): Promise<Auction[]> {
        const currentTime = new Date();
        return this.auctionRepository.find({
            where: {
                isEnded: false,
                endTime: MoreThan(currentTime),
            },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByNft' })
    async getAuctionsByNft(@Args('nftId') nftId: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { nftId },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByOwner' })
    async getAuctionsByOwner(@Args('ownerId') ownerId: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { ownerId },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByWinner' })
    async getAuctionsByWinner(@Args('winnerId') winnerId: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { winnerId },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByMaxBidAmount' })
    async getAuctionsByMaxBidAmount(@Args('maxBidAmount') maxBidAmount: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { maxBidAmount },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByCurrentPrice' })
    async getAuctionsByCurrentPrice(@Args('currentPrice') currentPrice: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { currentPrice },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsByDuration' })
    async getAuctionsByDuration(@Args('duration') duration: number): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { duration },
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
    @Public()
    @Query(() => [Auction], { name: 'getAuctionsDescription' })
    async getAuctionsDescription(@Args('description') description: string): Promise<Auction[]> {
        return this.auctionRepository.find({
            where: { description: Like(`%${description}%`) } as any,
            relations: ['nft', 'bids'],
            order: { createdAt: 'DESC' },
        });
    }
}
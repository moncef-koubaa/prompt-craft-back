import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Bid } from "../auction/entities/bid.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auction } from "../auction/entities/auction.entity";
import { User } from "../user/entities/user.entity";
import { Public } from "src/decorator/public.decorator";
import { CreateBidInput } from "../auction/dto/create-bid.input";
import { UpdateBidInput } from "../auction/dto/update-bid.input";

@Resolver(() => Bid)
export class BidResolver {
    constructor(
        @InjectRepository(Bid)
        private bidRepository: Repository<Bid>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    @Public()
    @Query(() => [Bid], { name: 'getBids' })
    async getBids(
        @Args('auctionId', { type: () => Int }) auctionId: number
    ): Promise<Bid[]> {
        const auction = await this.auctionRepository.findOne({ where: { id: auctionId } });
        if (!auction) {
            throw new Error('Auction not found');
        }
        return this.bidRepository.find({
            where: { auction: { id: auctionId } },
            order: { amount: 'DESC' },
            relations: ['auction'],
        });
    }

    @Public()
    @Query(() => Bid, { name: 'getBid' })
    async getBid(
        @Args('id', { type: () => Int }) id: number
    ): Promise<Bid> {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['auction'],
        });
        if (!bid) {
            throw new Error('Bid not found');
        }
        return bid;
    }

    @Public()
    @Query(() => [Bid], { name: 'getBidsByUser' })
    async getBidsByUser(
        @Args('userId', { type: () => Int }) userId: number
    ): Promise<Bid[]> {
        return this.bidRepository.find({
            where: { bidderId: userId },
            relations: ['auction'],
            order: { createdAt: 'DESC' },
        });
    }

    @Public()
    @Mutation(() => Bid, { name: 'placeBid' })
    async placeBid(
        @Args('input') input: CreateBidInput
    ): Promise<Bid> {
        return this.createBid(input);
    }

    @Public()
    @Mutation(() => Bid, { name: 'createBid' })
    async createBid(
        @Args('input') input: CreateBidInput
    ): Promise<Bid> {
        const auction = await this.auctionRepository.findOne({ 
            where: { id: input.auctionId },
            relations: ['bids']
        });
        if (!auction) {
            throw new Error('Auction not found');
        }

        const bidder = await this.userRepository.findOne({ where: { id: input.bidderId } });
        if (!bidder) {
            throw new Error('Bidder not found');
        }

        const highestBid = await this.bidRepository.findOne({
            where: { auction: { id: input.auctionId } },
            order: { amount: 'DESC' },
        });

        if (highestBid && input.amount <= highestBid.amount) {
            throw new Error('Bid amount must be higher than current highest bid');
        }

        const bid = this.bidRepository.create({
            bidderId: input.bidderId,
            amount: input.amount,
            auction,
        });

        return this.bidRepository.save(bid);
    }

    @Public()
    @Mutation(() => Bid)
    async updateBid(
        @Args('input') input: UpdateBidInput
    ): Promise<Bid> {
        const bid = await this.bidRepository.findOne({
            where: { id: input.id },
            relations: ['auction'],
        });
        if (!bid) {
            throw new Error('Bid not found');
        }

        if (input.amount) {
            bid.amount = input.amount;
        }

        return this.bidRepository.save(bid);
    }

    @Public()
    @Mutation(() => Boolean)
    async deleteBid(
        @Args('id', { type: () => Int }) id: number
    ): Promise<boolean> {
        const bid = await this.bidRepository.findOne({ where: { id } });
        if (!bid) {
            throw new Error('Bid not found');
        }

        await this.bidRepository.remove(bid);
        return true;
    }

    @Public()
    @Query(() => [Bid])
    async lowestBidder(
        @Args('auctionId', { type: () => Int }) auctionId: number
    ): Promise<Bid[]> {
        const auction = await this.auctionRepository.findOne({ where: { id: auctionId } });
        if (!auction) {
            throw new Error('Auction not found');
        }

        const bids = await this.bidRepository.find({
            where: { auction: { id: auctionId } },
            order: { amount: 'ASC' },
            take: 1,
            relations: ['auction'],
        });

        return bids;
    }

    @Public()
    @Query(() => [Bid])
    async highestBidder(
        @Args('auctionId', { type: () => Int }) auctionId: number
    ): Promise<Bid[]> {
        const auction = await this.auctionRepository.findOne({ where: { id: auctionId } });
        if (!auction) {
            throw new Error('Auction not found');
        }

        const bids = await this.bidRepository.find({
            where: { auction: { id: auctionId } },
            order: { amount: 'DESC' },
            take: 1,
            relations: ['auction'],
        });

        return bids;
    }
}
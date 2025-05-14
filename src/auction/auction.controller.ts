import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { AuctionGateway } from './auction.gateway';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entities/user.entity';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService, private readonly auctionGateway: AuctionGateway) {}

  // The owner of the auction creates an auction (-- Authenticated)
  @Post()
  async create(@Body() dto: CreateAuctionDto) {
    return this.auctionService.createAuction(dto);
  }

  // The owner can view auctions in progress
  @Get()
  async getAuctions(@Body()  userId: number ) {
    return this.auctionService.getMyAuctions(userId);
  }

  // A user places a bid on an auction
  /* @Post('place-bid')
  async placeBidViaHttp(@Body() dto: PlaceBidDto , @AuthedUser() user : User) {
    const bid = await this.auctionService.placeBid(dto);

    // Emit via gateway
    this.auctionGateway.server.to(`auction_${dto.auctionId}`).emit('newBid', bid);

    return bid;
  } */
}
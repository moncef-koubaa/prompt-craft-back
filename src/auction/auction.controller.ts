import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entities/user.entity';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(@Body() dto: CreateAuctionDto, @AuthedUser() user: User) {
    return this.auctionService.createAuction(dto, user);
  }

  @Get('/:id')
  async getAuction(@Param('id') auctionId: number,@AuthedUser() user: User) {
    if (await this.auctionService.isParticipant(auctionId, user)) {
    return this.auctionService.getAuction(auctionId);
    }
  }

  @Get()
  async getAuctions(@Body() userId: number) {
    return this.auctionService.getMyAuctions(userId);
  }

  @Post('join/:id')
  async joinAuction(@Param('id') auctionId: number, @AuthedUser() user: User) {
    return this.auctionService.joinAuction(auctionId, user);
  }

  @Get('/:id/bids')
  async getBidders(@Param('id') auctionId: number) {
    return this.auctionService.getBidders(auctionId);
  }

  @Get('/:id/participant')
  async isParticipant(@Param('id') auctionId: number, @AuthedUser() user: User) {
    return this.auctionService.isParticipant(auctionId, user);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(@Body() dto: CreateAuctionDto) {
    return this.auctionService.createAuction(dto);
  }
}
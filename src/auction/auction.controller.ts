import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { AuthedUser } from "src/decorator/authed-user.decorator.ts";
import { User } from "src/user/entities/user.entity";

@Controller("auctions")
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(@Body() dto: CreateAuctionDto, @AuthedUser() user: User) {
    return this.auctionService.createAuction(dto, user);
  }

  @Get()
  async getAllAuctions() {
    return this.auctionService.getAllAuctions();
  }

  @Get("/:userId")
  async getAuctions(@Param("userId") userId: number) {
    return this.auctionService.getMyAuctions(+userId);
  }

  @Post("join/:id")
  async joinAuction(@Param("id") auctionId: number, @AuthedUser() user: User) {
    return this.auctionService.joinAuction(auctionId, user);
  }
}

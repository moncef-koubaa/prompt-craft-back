import { Module } from "@nestjs/common";
import { NftService } from "./nft.service";
import { NftController } from "./nft.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Auction } from "src/auction/entities/auction.entity";
import { Nft } from "./entities/nft.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Auction, Nft])],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}

import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { AuctionGateway } from './auction.gateway';
import { JoinAuction } from './entities/joinAuction.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FrozenBalance } from './entities/frozen-balance.entity';
import { UserModule } from 'src/user/user.module';
import { NftModule } from 'src/nft/nft.module';
import { Nft } from 'src/nft/entities/nft.entity';
import { BidResolver } from 'src/resolvers/bid';
import { AuctionResolver } from 'src/resolvers/auction';
import { NotificationModule } from 'src/notification/notiffication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auction,
      Bid,
      JoinAuction,
      User,
      Nft,
      FrozenBalance,
    ]),
    AuthModule,
    UserModule,
    NftModule,
    NotificationModule,
  ],
  controllers: [AuctionController],
  providers: [
    AuctionService,
    AuctionGateway,
    UserService,
    BidResolver,
    AuctionResolver,
  ],
})
export class AuctionModule {}

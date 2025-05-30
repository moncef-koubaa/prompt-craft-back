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

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Bid, JoinAuction, User]),
    AuthModule,
    UserModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway, UserService],
})
export class AuctionModule {}

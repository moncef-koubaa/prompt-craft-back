import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Auction } from 'src/auction/entities/auction.entity';
import { Nft } from './entities/nft.entity';
import { NftResolver } from '../resolvers/nft';
import { NotificationModule } from 'src/notification/notiffication.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auction, Nft]), NotificationModule],
  controllers: [NftController],
  providers: [NftService, NftResolver],
  exports: [NftService, TypeOrmModule],
})
export class NftModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { NftResolver } from '../resolvers/nft';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, User]),
  ],
  providers: [NftResolver],
  exports: [TypeOrmModule, NftResolver],
})
export class NftModule {}

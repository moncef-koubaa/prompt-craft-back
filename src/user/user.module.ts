import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { FrozenBalance } from 'src/auction/entities/frozen-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FrozenBalance])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

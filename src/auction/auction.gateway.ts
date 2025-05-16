import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from './auction.service';
import { Injectable, UseFilters, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinAuction } from './entities/joinAuction.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PlaceBidDto } from './dto/place-bid.dto';
import { JwtWsGuard } from 'src/auth/guards/jwt-ws.guard';
import { AuctionFilter } from './auction.filter';
import { log } from 'console';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entities/user.entity';

@Injectable()
@UseGuards(JwtWsGuard)
@UseFilters(AuctionFilter)
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly auctionService: AuctionService,
    private readonly userService: UserService,
    @InjectRepository(JoinAuction)
    private readonly joinAuctionRepo: Repository<JoinAuction>
  ) {}

  @SubscribeMessage('joinAuction')
  async handleJoin(
    @MessageBody() auctionId: number,
    @ConnectedSocket() client: Socket,
    @AuthedUser() user: User
  ) {
    const auction = await this.auctionService.getAuction(auctionId);
    if (!auction) {
      throw new WsException('Auction not found');
    }

    if (auction.ownerId === user.id) {
      throw new WsException('You cannot join your own auction');
    }

    const existingJoin = await this.joinAuctionRepo.findOne({
      where: {
        user: { id: user.id },
        auction: { id: auction.id },
      },
    });

    if (!existingJoin) {
      await this.joinAuctionRepo.save({
        user,
        auction,
        socketId: client.id,
      });
      await client.join(`auction_${auctionId}`);
    } else {
      throw new WsException('You have already joined this auction');
    }
  }

  @SubscribeMessage('leaveAuction')
  async handleLeave(
    @MessageBody() auctionId: number,
    @ConnectedSocket() client: Socket,
    @AuthedUser() user: User
  ) {
    const auction = await this.auctionService.getAuction(auctionId);
    if (!auction) {
      throw new WsException('Auction not found');
    }

    const existingJoin = await this.joinAuctionRepo.findOne({
      where: {
        user: { id: user.id },
        auction: { id: auction.id },
      },
    });

    if (existingJoin) {
      await client.leave(`auction_${auctionId}`);
      await this.joinAuctionRepo.remove(existingJoin);
    } else {
      throw new WsException('You have not joined this auction');
    }
  }

  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @MessageBody() data: PlaceBidDto,
    @ConnectedSocket() client: Socket,
    @AuthedUser() user: User
  ) {
    log(`auction_${data.auctionId}`);
    const bid = await this.auctionService.placeBid(data, user.id);
    this.server.to(`auction_${data.auctionId}`).emit('newBid', bid);
  }
}

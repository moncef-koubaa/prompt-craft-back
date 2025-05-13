import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from './auction.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinAuction } from './entities/joinAuction.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
@WebSocketGateway()
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly auctionService: AuctionService,
    private readonly userService: UserService,
    @InjectRepository(JoinAuction)
    private readonly joinAuctionRepo: Repository<JoinAuction>,
  ) { }

  @SubscribeMessage('joinAuction')
  async handleJoin(@MessageBody() payload: { auctionId: number; userId: number }, @ConnectedSocket() client: Socket) {
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    //Validate the user and auction
    const user = await this.userService.findOneBy({ id: data.userId });
    const auction = await this.auctionService.getAuction(data.auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }
    console.log('Auction found in gateway:', auction);
    console.log('--------------------------------------------');
    console.log('User found in gateway:', user);
    console.log('--------------------------------------------');

    if (!user) {
      throw new Error('User not found');
    }
    console.log(auction.ownerId === user.id);
    if (auction.ownerId === user.id) {
      throw new Error('You cannot join your own auction');
    }

    //Check if user already joined
    const existingJoin = await this.joinAuctionRepo.findOne({
      where: {
        user: { id: user.id },
        auction: { id: auction.id },
      },
    });
    console.log('Existing join record:', existingJoin);

    if (!existingJoin) {
      // Create new join record
      await this.joinAuctionRepo.save({
        user,
        auction,
        socketId: client.id,
      });
      client.join(`auction_${auction.id}`);
      console.log(`Client ${client.id} joined auction ${auction.id}`);
    }
    else {
      console.log('You have already joined this auction');
    }

    

  }

  @SubscribeMessage('leaveAuction')
  async handleLeave(@MessageBody() payload: { auctionId: number; userId: number }, @ConnectedSocket() client: Socket) {
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    const user = await this.userService.findOneBy({ id: data.userId });
    const auction = await this.auctionService.getAuction(data.auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has joined the auction
    const existingJoin = await this.joinAuctionRepo.findOne({
      where: {
        user: { id: user.id },
        auction: { id: auction.id },
      },
    });

    if (existingJoin) {
      // Remove the join record
      await this.joinAuctionRepo.remove(existingJoin);
      client.leave(`auction_${auction.id}`);
      console.log(`Client ${client.id} left auction ${auction.id}`);
    } else {
      console.log('You have not joined this auction');
    }
  }

  
}

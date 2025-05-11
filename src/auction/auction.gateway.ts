import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from './auction.service';
import { PlaceBidDto } from './dto/place-bid.dto';

@WebSocketGateway()
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly auctionService: AuctionService) {}

  @SubscribeMessage('joinAuction')
  handleJoin(@MessageBody() auctionId: number, @ConnectedSocket() client: Socket) {
    client.join(`auction_${auctionId}`);
  }

  @SubscribeMessage('placeBid')
  async handleBid(@MessageBody() data: PlaceBidDto, @ConnectedSocket() client: Socket) {
    try {
      const bid = await this.auctionService.placeBid(data);
      this.server.to(`auction_${data.auctionId}`).emit('newBid', bid);
    } catch (err) {
      client.emit('bidError', err.message);
    }
  }
}

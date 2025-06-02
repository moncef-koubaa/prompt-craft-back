import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuctionService } from "./auction.service";
import { Injectable, UseFilters, UseGuards } from "@nestjs/common";
import { PlaceBidDto } from "./dto/place-bid.dto";
import { JwtWsGuard } from "src/auth/guards/jwt-ws.guard";
import { AuctionFilter } from "./auction.filter";
import { AuthedUser } from "src/decorator/authed-user.decorator.ts";
import { User } from "src/user/entities/user.entity";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
@UseGuards(JwtWsGuard)
@UseFilters(AuctionFilter)
@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly auctionService: AuctionService) {}

  @SubscribeMessage("joinAuction")
  async handleJoin(
    @MessageBody() auctionId: number,
    @ConnectedSocket() client: Socket,
    @AuthedUser() user: User
  ) {
    const isParticipant = await this.auctionService.isParticipant(
      auctionId,
      user
    );
    if (!isParticipant) {
      throw new WsException("You are not a participant of this auction");
    }

    const rooms = client.rooms;
    if (rooms.has(`auction_${auctionId}`)) {
      throw new WsException("You are already in this auction");
    }

    await client.join(`auction_${auctionId}`);
  }

  @SubscribeMessage("leaveAuction")
  async handleLeave(
    @MessageBody() auctionId: number,
    @ConnectedSocket() client: Socket
  ) {
    const rooms = client.rooms;
    if (rooms.has(`auction_${auctionId}`)) {
      await client.leave(`auction_${auctionId}`);
    }
  }

  @SubscribeMessage("placeBid")
  async handlePlaceBid(
    @MessageBody() data: PlaceBidDto,
    @ConnectedSocket() client: Socket,
    @AuthedUser() user: User
  ) {
    console.log("Placing bid:", data, "by user:", user.id);
    const rooms = client.rooms;
    console.log("User rooms:", Array.from(rooms));
    if (!rooms.has(`auction_${data.auctionId}`)) {
      console.log("User is not in auction room:", `auction_${data.auctionId}`);
      throw new WsException("You are not in this auction");
    }
    const bid = await this.auctionService.placeBid(data, user.id);
    this.server.to(`auction_${data.auctionId}`).emit("newBid", bid);
  }

  @OnEvent("auction.ended")
  async handleAuctionEnded(data: any) {
    const { auctionId, winnerId, amount } = data;
    this.server.to(`auction_${auctionId}`).emit("auctionEnded", {
      auctionId,
      winnerId,
      amount,
    });
  }
}

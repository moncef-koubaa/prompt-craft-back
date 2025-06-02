import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationDto } from './notification.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(@Inject('NOTIFICATION_SERVICE') private rq: ClientProxy) {}

  sendNotification(notif: NotificationDto): void {
    console.log(notif);
    this.rq.emit('notification', notif);
  }

  @OnEvent('auction.ended')
  notifyParticipants(data: any) {
    // todo: change nft id
    const { auctionId, winnerId, amount } = data;
    const notification: NotificationDto = {
      nftId: auctionId,
      type: 'auctionEnded',
      message: `Auction has ended.`,
      userId: winnerId,
    };
    this.sendNotification(notification);
  }
}

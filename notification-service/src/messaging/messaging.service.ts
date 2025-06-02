import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../notification/notification.service';
import { SseService } from '../sse/sse.service';
import {NotificationDto} from "../dto/notification.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Subscription} from "../sse/subscription.entity";
import {Repository} from "typeorm";

@Injectable()
export class MessagingService {
    constructor(
        private readonly notifService: NotificationService,
        private readonly sseService: SseService,
        @InjectRepository(Subscription)
        private readonly subscriptionRepo: Repository<Subscription>
    ) {}

    async handleNotificationEvent(payload: NotificationDto ){
        console.log("payload", payload);
        const { userId, type, message,nftId } = payload;
        const subscribers= await this.subscriptionRepo.createQueryBuilder("subscription")
            .where("subscription.nftId = :nftId", { nftId: nftId })
            .andWhere("subscription.type = :type", { type: type })
            .getMany();
        console.log("subs", subscribers);
        for (const sub of subscribers) {
            if (sub.userId === userId) continue;
            const notif = await this.notifService.create({ userId: sub.userId, type, message });
            this.sseService.publish(sub.userId, notif);
        }
    }
}

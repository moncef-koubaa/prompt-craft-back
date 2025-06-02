import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { NotificationModule } from '../notification/notification.module';
import { SseModule } from '../sse/sse.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "../sse/subscription.entity";

@Module({
    imports: [
        NotificationModule,
        SseModule,
        TypeOrmModule.forFeature([Subscription])
    ],
    providers: [MessagingService],
    exports: [MessagingService],
})
export class MessagingModule {}

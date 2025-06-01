import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import {HttpModule} from "@nestjs/axios";
import {SseController} from "../sse/sse.controller";
import {NotificationController} from "./notification.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Notification]),HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
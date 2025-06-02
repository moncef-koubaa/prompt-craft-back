import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {NotificationDto} from "./dto/notification.dto";
import {MessagingService} from "./messaging/messaging.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private messagingService: MessagingService) {}
  // @EventPattern("notification")
  // async handleNotificationEvent(@Payload() data : NotificationDto ){
  // console.log(data);
  // }

  @EventPattern('notification')
  async handleNotificationEvent(@Payload() payload : NotificationDto ){
    await this.messagingService.handleNotificationEvent(payload);
  }

}

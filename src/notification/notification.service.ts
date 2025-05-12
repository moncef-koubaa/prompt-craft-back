import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NotificationDto } from "./notification.dto";

@Injectable()
export class NotificationService {
  constructor(@Inject("NOTIFICATION_SERVICE") private rq: ClientProxy) {}

  sendNotification(notif: NotificationDto): void {
    console.log(notif);
    this.rq.emit("notification", notif);
  }
}

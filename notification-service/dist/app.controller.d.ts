import { AppService } from './app.service';
import { NotificationDto } from "./dto/notification.dto";
import { MessagingService } from "./messaging/messaging.service";
export declare class AppController {
    private readonly appService;
    private messagingService;
    constructor(appService: AppService, messagingService: MessagingService);
    handleNotificationEvent(payload: NotificationDto): Promise<void>;
}

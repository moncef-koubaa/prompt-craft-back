import { NotificationService } from '../notification/notification.service';
import { SseService } from '../sse/sse.service';
import { NotificationDto } from "../dto/notification.dto";
import { Subscription } from "../sse/subscription.entity";
import { Repository } from "typeorm";
export declare class MessagingService {
    private readonly notifService;
    private readonly sseService;
    private readonly subscriptionRepo;
    constructor(notifService: NotificationService, sseService: SseService, subscriptionRepo: Repository<Subscription>);
    handleNotificationEvent(payload: NotificationDto): Promise<void>;
}

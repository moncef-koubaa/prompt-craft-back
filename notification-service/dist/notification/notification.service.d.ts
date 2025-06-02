import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationService {
    private repo;
    constructor(repo: Repository<Notification>);
    create(dto: CreateNotificationDto): Promise<Notification>;
    findUnread(userId: number): Promise<Notification[]>;
    markRead(id: string): Promise<void>;
    markAllRead(userId: number): Promise<void>;
}

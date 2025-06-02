import { NotificationService } from "./notification.service";
import { Request } from "express";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUnreadNotifications(request: Request): Promise<import("./entities/notification.entity").Notification[]>;
    markRead(id: string): Promise<void>;
    markAllRead(request: Request): Promise<void>;
}

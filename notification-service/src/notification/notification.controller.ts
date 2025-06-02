import {Controller, Get, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {MessagingService} from "../messaging/messaging.service";
import {NotificationService} from "./notification.service";
import {AuthGuard} from "../auth/auth.guard";
import {Request} from "express";

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
    constructor(private readonly notificationService:NotificationService) {}

    @Get("unread")
    async getUnreadNotifications(@Req() request: Request) {
        return this.notificationService.findUnread(request.user.id);
    }
    @Put("mark-read/:id")
    async markRead(@Param("id") id: string) {
        return this.notificationService.markRead(id);
    }

    @Put("mark-all-read")
    async markAllRead(@Req() request: Request) {
        return this.notificationService.markAllRead(request.user.id);
    }
}
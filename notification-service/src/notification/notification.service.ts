import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notif = this.repo.create(dto);
    console.log ("saving notification", notif);
    console.log(notif.read);
    return this.repo.save(notif);
  }

  async findUnread(userId: number) {
    console.log("finding unread notifications for user", this.repo.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
    }));
    return this.repo.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(id: string) {
    await this.repo.update(id, { read: true });
  }

  async markAllRead(userId: number) {
    await this.repo.update({ userId, read: false }, { read: true });
  }
}
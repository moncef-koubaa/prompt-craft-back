import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './notification/notification.module';
import { MessagingModule } from './messaging/messaging.module';
import { SseModule } from './sse/sse.module';
import { Notification } from './notification/entities/notification.entity';
import {Subscription} from './sse/subscription.entity';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ConfigModule} from "@nestjs/config";
import * as process from "node:process";
import {AuthGuard} from "./auth/auth.guard";
import {HttpModule} from "@nestjs/axios";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // makes ConfigService available everywhere
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres' ,
      host: process.env.DB_HOST ,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Notification,Subscription],
      synchronize: true,
    }),
    NotificationModule,
    MessagingModule,
    SseModule,
    EventEmitterModule.forRoot(),
      HttpModule
  ],
  controllers: [AppController],
  providers : [
      AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
    ],

})
export class AppModule {}
import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./subscription.entity";
import {HttpModule, HttpService} from "@nestjs/axios";

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]),HttpModule],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
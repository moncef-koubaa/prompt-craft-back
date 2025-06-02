import {SseService} from "./sse.service";
import {Body, Controller, Post, Req, Sse, UseGuards} from "@nestjs/common";
import {map, tap} from "rxjs";
import {AuthGuard} from "../auth/auth.guard";
import { Request } from 'express';

@Controller('sse')
@UseGuards(AuthGuard)
export class SseController {
  constructor(private readonly sseService: SseService) {}

    @Post('subscribe')
    async subscribeToEvents(
        @Req() request: Request,
        @Body() payload: {
            nftId: number;
            events: string;
        }
    ): Promise<any> {
      const { nftId, events: eventsParam} = payload;
      const eventTypes = eventsParam.split(',');
      console.log('subscribeToEvents', request.user.id, nftId, eventsParam);
     await this.sseService.subscribe(request.user.id, nftId, eventTypes);
     //  return stream$.pipe(
     //      map(data => ({data})),
     //      tap({
     //        unsubscribe: () => {
     //          this.sseService.unsubscribe(userId,  stream$);
     //        },
     //      })
     // );
    // console.log('subscribeToEvents', userId, nftId, eventsParam);
  }
    @Sse('getNotified')
    @UseGuards(AuthGuard)
    connect(@Req() request: Request) {
      console.log('connect', request.user.id);
        const stream$ =  this.sseService.connect(request.user.id);
        return stream$.pipe(
            map(data => ({data})),
            tap({
                unsubscribe: () => {
                    this.sseService.unsubscribe(request.user.id,  stream$);
                }   ,
            })
        );
    }
}

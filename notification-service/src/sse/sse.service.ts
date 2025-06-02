import { Injectable } from '@nestjs/common';
import {Subject} from 'rxjs';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateSubscriptionDto} from "./dto/create-subscription.dto";
import {Subscription} from "./subscription.entity";
@Injectable()
export class SseService {
  constructor(
      @InjectRepository(Subscription)
      private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  private clients: Map<number, Subject<any>[]> = new Map();

  async subscribe(userId: number, nftId: number, eventTypes: string[]){
    // save the subscription to the database
    for (const event of eventTypes) {
      const dto: CreateSubscriptionDto = {
        userId,
        nftId,
        type: event,
      };
      if(!await this.subscriptionRepo.findOne({where: dto})) {
          const subscription = this.subscriptionRepo.create(dto);
          await this.subscriptionRepo.save(subscription);
      }
    }

   // // establish a connection to the client
   //  const events$ = new Subject<any>();
   //  const arr = this.clients.get(userId) || [];
   //  arr.push(events$);
   //  this.clients.set(userId, arr);
   //  console.log("client sse",this.clients.get(userId));
   //  return events$;
  }
  connect(userId: number) {
    const events$ = new Subject<any>();
    const arr = this.clients.get(userId) || [];
    arr.push(events$);
    this.clients.set(userId, arr);
    console.log("client sse maa3 user id ",userId,"/n",this.clients.get(userId));
    return events$;
  }

  publish(userId: number, payload: any) {
    const arr = this.clients.get(userId) || [];
    console.log("publish to user", userId, "payload", payload);
    console.log("arr", arr);
    for (const subj of arr) subj.next(payload);
  }

  unsubscribe(userId: number, subject: Subject<any>) {
    const arr = this.clients.get(userId) || [];
    this.clients.set(userId, arr.filter(s => s !== subject));
  }
}
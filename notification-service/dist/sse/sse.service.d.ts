import { Subject } from 'rxjs';
import { Repository } from "typeorm";
import { Subscription } from "./subscription.entity";
export declare class SseService {
    private readonly subscriptionRepo;
    constructor(subscriptionRepo: Repository<Subscription>);
    private clients;
    subscribe(userId: number, nftId: number, eventTypes: string[]): Promise<void>;
    connect(userId: number): Subject<any>;
    publish(userId: number, payload: any): void;
    unsubscribe(userId: number, subject: Subject<any>): void;
}

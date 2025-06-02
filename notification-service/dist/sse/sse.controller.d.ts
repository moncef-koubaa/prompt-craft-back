import { SseService } from "./sse.service";
import { Request } from 'express';
export declare class SseController {
    private readonly sseService;
    constructor(sseService: SseService);
    subscribeToEvents(request: Request, payload: {
        nftId: number;
        events: string;
    }): Promise<any>;
    connect(request: Request): import("rxjs").Observable<{
        data: any;
    }>;
}

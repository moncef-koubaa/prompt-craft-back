"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SseService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./subscription.entity");
let SseService = class SseService {
    constructor(subscriptionRepo) {
        this.subscriptionRepo = subscriptionRepo;
        this.clients = new Map();
    }
    async subscribe(userId, nftId, eventTypes) {
        for (const event of eventTypes) {
            const dto = {
                userId,
                nftId,
                type: event,
            };
            if (!await this.subscriptionRepo.findOne({ where: dto })) {
                const subscription = this.subscriptionRepo.create(dto);
                await this.subscriptionRepo.save(subscription);
            }
        }
    }
    connect(userId) {
        const events$ = new rxjs_1.Subject();
        const arr = this.clients.get(userId) || [];
        arr.push(events$);
        this.clients.set(userId, arr);
        console.log("client sse maa3 user id ", userId, "/n", this.clients.get(userId));
        return events$;
    }
    publish(userId, payload) {
        const arr = this.clients.get(userId) || [];
        console.log("publish to user", userId, "payload", payload);
        console.log("arr", arr);
        for (const subj of arr)
            subj.next(payload);
    }
    unsubscribe(userId, subject) {
        const arr = this.clients.get(userId) || [];
        this.clients.set(userId, arr.filter(s => s !== subject));
    }
};
exports.SseService = SseService;
exports.SseService = SseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SseService);
//# sourceMappingURL=sse.service.js.map
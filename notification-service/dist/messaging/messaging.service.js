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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification/notification.service");
const sse_service_1 = require("../sse/sse.service");
const typeorm_1 = require("@nestjs/typeorm");
const subscription_entity_1 = require("../sse/subscription.entity");
const typeorm_2 = require("typeorm");
let MessagingService = class MessagingService {
    constructor(notifService, sseService, subscriptionRepo) {
        this.notifService = notifService;
        this.sseService = sseService;
        this.subscriptionRepo = subscriptionRepo;
    }
    async handleNotificationEvent(payload) {
        console.log("payload", payload);
        const { userId, type, message, nftId } = payload;
        const subscribers = await this.subscriptionRepo.createQueryBuilder("subscription")
            .where("subscription.nftId = :nftId", { nftId: nftId })
            .andWhere("subscription.type = :type", { type: type })
            .getMany();
        console.log("subs", subscribers);
        for (const sub of subscribers) {
            if (sub.userId === userId)
                continue;
            const notif = await this.notifService.create({ userId: sub.userId, type, message });
            this.sseService.publish(sub.userId, notif);
        }
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        sse_service_1.SseService,
        typeorm_2.Repository])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map
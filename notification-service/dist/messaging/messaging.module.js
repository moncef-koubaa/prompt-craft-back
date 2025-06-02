"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const messaging_service_1 = require("./messaging.service");
const notification_module_1 = require("../notification/notification.module");
const sse_module_1 = require("../sse/sse.module");
const typeorm_1 = require("@nestjs/typeorm");
const subscription_entity_1 = require("../sse/subscription.entity");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notification_module_1.NotificationModule,
            sse_module_1.SseModule,
            typeorm_1.TypeOrmModule.forFeature([subscription_entity_1.Subscription])
        ],
        providers: [messaging_service_1.MessagingService],
        exports: [messaging_service_1.MessagingService],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map
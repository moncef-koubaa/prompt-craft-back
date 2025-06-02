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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const notification_dto_1 = require("./dto/notification.dto");
const messaging_service_1 = require("./messaging/messaging.service");
let AppController = class AppController {
    constructor(appService, messagingService) {
        this.appService = appService;
        this.messagingService = messagingService;
    }
    async handleNotificationEvent(payload) {
        await this.messagingService.handleNotificationEvent(payload);
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.EventPattern)('notification'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.NotificationDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handleNotificationEvent", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService, messaging_service_1.MessagingService])
], AppController);
//# sourceMappingURL=app.controller.js.map
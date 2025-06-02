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
exports.SseController = void 0;
const sse_service_1 = require("./sse.service");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const auth_guard_1 = require("../auth/auth.guard");
let SseController = class SseController {
    constructor(sseService) {
        this.sseService = sseService;
    }
    async subscribeToEvents(request, payload) {
        const { nftId, events: eventsParam } = payload;
        const eventTypes = eventsParam.split(',');
        console.log('subscribeToEvents', request.user.id, nftId, eventsParam);
        await this.sseService.subscribe(request.user.id, nftId, eventTypes);
    }
    connect(request) {
        console.log('connect', request.user.id);
        const stream$ = this.sseService.connect(request.user.id);
        return stream$.pipe((0, rxjs_1.map)(data => ({ data })), (0, rxjs_1.tap)({
            unsubscribe: () => {
                this.sseService.unsubscribe(request.user.id, stream$);
            },
        }));
    }
};
exports.SseController = SseController;
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SseController.prototype, "subscribeToEvents", null);
__decorate([
    (0, common_1.Sse)('getNotified'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SseController.prototype, "connect", null);
exports.SseController = SseController = __decorate([
    (0, common_1.Controller)('sse'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [sse_service_1.SseService])
], SseController);
//# sourceMappingURL=sse.controller.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const process = require("node:process");
let AuthGuard = class AuthGuard {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const userData = await this.validateTokenWithAuthService(token);
            if (!userData || !userData.id) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            request.user = userData;
            return true;
        }
        catch (error) {
            console.error('AuthGuard error:', error);
            throw new common_1.UnauthorizedException('Authentication failed');
        }
    }
    extractToken(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    async validateTokenWithAuthService(token) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(process.env.AUTH_SERVICE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }));
            if (response.status !== 200) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return response.data;
        }
        catch (error) {
            console.error('Auth service error:', error);
            return null;
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map
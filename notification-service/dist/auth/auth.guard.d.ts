import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
export declare class AuthGuard implements CanActivate {
    private readonly httpService;
    constructor(httpService: HttpService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
    private validateTokenWithAuthService;
}

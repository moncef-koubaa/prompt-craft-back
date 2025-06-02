import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import * as process from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly httpService: HttpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const userData = await this.validateTokenWithAuthService(token);
            if (!userData || !userData.id) {
                throw new UnauthorizedException('Invalid token');
            }

            // Inject user info into request
            request.user = userData;

            return true;
        } catch (error) {
            console.error('AuthGuard error:', error);
            throw new UnauthorizedException('Authentication failed');
        }
    }

    private extractToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private async validateTokenWithAuthService(token: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(process.env.AUTH_SERVICE_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );
            if (response.status !== 200) {
                throw new UnauthorizedException('Invalid token');
            }
            return response.data; // Ensure it includes `id` or relevant user info
        } catch (error) {
            console.error('Auth service error:', error);
            return null;
        }
    }
}

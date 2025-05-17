import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token || client.handshake?.query?.token;

    if (!token) {
      throw new WsException('Missing auth token');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.user = {
        id: payload.sub,
        username: payload.username,
        roles: payload.roles,
        emailVerified: payload.emailVerified,
      };
      return true;
    } catch (e) {
      throw new WsException('Invalid or expired token');
    }
  }
}

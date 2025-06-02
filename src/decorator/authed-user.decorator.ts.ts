import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const AuthedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let payload: Partial<User>;
    if (ctx.getType() === 'ws') {
      const client = ctx.switchToWs().getClient();
      payload = client.user;
    } else {
      const request = ctx.switchToHttp().getRequest();
      payload = request.user;
    }
    const user: User = {
      id: payload.id || 0,
      username: payload.username || '',
      roles: payload.roles || [],
      emailVerified: payload.emailVerified || false,
      email: payload.email || '',
    } as User;
    return user;
  }
);

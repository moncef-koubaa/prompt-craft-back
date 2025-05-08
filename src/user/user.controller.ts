import { Controller, Get, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from './entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('balance')
  getBalance(@AuthedUser() user: User): Promise<number> {
    return this.userService.getBalance(user.id);
  }

  @Roles(['owner'])
  @Patch('make-admin')
  makeAdmin(@Query('username') username: string) {
    return this.userService.makeAdmin(username);
  }

  @Roles(['owner'])
  @Patch('revoke-admin')
  revokeAdmin(@Query('username') username: string) {
    return this.userService.revokeAdmin(username);
  }
}

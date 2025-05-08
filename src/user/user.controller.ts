import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('balance')
  getBalance(@AuthedUser() user: User): Promise<number> {
    return this.userService.getBalance(user.id);
  }
}

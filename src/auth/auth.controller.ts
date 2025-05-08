import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorator/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    await this.authService.signUp(data);
  }

  @Public()
  @Post('login')
  async login(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.login(LoginUserDto);
  }

  @Get('me')
  async me(@AuthedUser() user: User): Promise<User> {
    return user;
  }
}

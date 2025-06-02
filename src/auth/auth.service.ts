import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(data: CreateUserDto) {
    const { username, email, password } = data;

    let potentialMatch = await this.usersService.findOneBy({ username });
    if (potentialMatch) {
      throw new ConflictException('Username already exists');
    }

    potentialMatch = await this.usersService.findOneBy({ email });
    if (potentialMatch) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = this.usersService.create({
      username,
      email,
      salt,
      password: hashedPassword,
    });
  }

  async login(data: LoginUserDto) {
    const { email, password } = data;

    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    console.log("payload fil aauth service ",payload);
    console.log("access token in auth service ", this.jwtService.sign(payload));
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

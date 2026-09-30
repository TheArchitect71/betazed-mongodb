import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password && (await compare(password, user.password))) {
      const { password: _, ...result } = user;
      return { ...result, userId: String(user._id) };
    }
    return null;
  }
  async login(user: { username: string; userId: string }) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.userId,
      }),
    };
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async addUser(
    @Body()
    body: {
      name: string;
      age?: number;
      price?: number;
      username?: string;
      password?: string;
    },
  ) {
    const id = await this.usersService.insertUser(
      body.name,
      body.age ?? body.price,
      body.username,
      body.password,
    );
    return { id };
  }
}

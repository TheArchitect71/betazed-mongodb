import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import type { User } from './user.model';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async insertUser(
    name: string,
    age: number,
    username?: string,
    password?: string,
  ) {
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof age !== 'number' ||
      !Number.isFinite(age) ||
      age < 0
    )
      throw new BadRequestException(
        'Name and nonnegative numeric age are required',
      );
    if (username !== undefined || password !== undefined) {
      if (
        typeof username !== 'string' ||
        !username.trim() ||
        typeof password !== 'string' ||
        password.length < 8
      )
        throw new BadRequestException(
          'Username and a password of at least 8 characters are required together',
        );
    }
    try {
      const user = await this.userModel.create({
        name: name.trim(),
        age,
        ...(username
          ? { username: username.trim(), password: await hash(password, 10) }
          : {}),
      });
      return user.id as string;
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException('Username already exists');
      throw error;
    }
  }
  async findOne(username: string) {
    return this.userModel.findOne({ username }).lean().exec();
  }
}

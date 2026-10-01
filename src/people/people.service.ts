import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Model } from 'mongoose';
import type { Person } from './person.model';

@Injectable()
export class PeopleService {
  constructor(@InjectModel('Person') private model: Model<Person>) {}
  async list(owner: string) {
    return (await this.model.find({ owner }).lean().exec()).map((p) =>
      this.serialize(p),
    );
  }
  async find(owner: string, id: string) {
    this.checkId(id);
    const person = await this.model.findOne({ _id: id, owner }).lean().exec();
    if (!person) throw new NotFoundException('Person not found');
    return this.serialize(person);
  }
  async create(owner: string, body: unknown) {
    const person = await this.model.create({ ...this.validate(body), owner });
    return this.serialize(person.toObject());
  }
  async update(owner: string, id: string, body: unknown) {
    this.checkId(id);
    const person = await this.model
      .findOneAndUpdate(
        { _id: id, owner },
        { $set: this.validate(body) },
        { returnDocument: 'after', runValidators: true },
      )
      .lean()
      .exec();
    if (!person) throw new NotFoundException('Person not found');
    return this.serialize(person);
  }
  async remove(owner: string, id: string) {
    this.checkId(id);
    const deleted = await this.model.deleteOne({ _id: id, owner }).exec();
    if (!deleted.deletedCount) throw new NotFoundException('Person not found');
  }
  private checkId(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid person id');
  }
  private serialize(p: any) {
    const {
      _id,
      owner: _owner,
      __v: _version,
      createdAt: _created,
      updatedAt: _updated,
      ...fields
    } = p;
    return { id: String(_id), ...fields };
  }
  validate(value: unknown): Omit<Person, 'owner'> {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new BadRequestException('A person object is required');
    const body = value as Record<string, unknown>;
    const result: Record<string, string | number> = {};
    const limits = {
      name: 120,
      role: 120,
      organization: 160,
      status: 80,
      expertise: 200,
      notes: 4000,
      missions: 2000,
      almaMater: 1000,
    };
    for (const [key, max] of Object.entries(limits)) {
      if (body[key] !== undefined && typeof body[key] !== 'string')
        throw new BadRequestException(key + ' must be text');
      const text = ((body[key] as string) ?? '').trim();
      if (
        (['name', 'role', 'status'].includes(key) && !text) ||
        text.length > max
      )
        throw new BadRequestException(
          key + ' is required or exceeds its character limit',
        );
      if (['missions', 'almaMater'].includes(key) && body[key] === undefined)
        continue;
      result[key] = text;
    }
    for (const key of ['spaceFlights', 'spaceWalks']) {
      if (body[key] === undefined) continue;
      if (!Number.isInteger(body[key]) || (body[key] as number) < 0)
        throw new BadRequestException(key + ' must be a nonnegative integer');
      result[key] = body[key] as number;
    }
    return result as unknown as Omit<Person, 'owner'>;
  }
}

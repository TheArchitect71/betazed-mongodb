import { UsersService } from './users.service';
import type { Model } from 'mongoose';
import type { User } from './user.model';
describe('UsersService', () => {
  it('persists supplied name and age', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'local-id' });
    const service = new UsersService({ create } as unknown as Model<User>);
    expect(await service.insertUser('  Name  ', 30)).toBe('local-id');
    expect(create).toHaveBeenCalledWith({ name: 'Name', age: 30 });
  });
  it('rejects invalid user input before writing', async () => {
    const create = jest.fn();
    const service = new UsersService({ create } as unknown as Model<User>);
    await expect(service.insertUser('', -1)).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });
});

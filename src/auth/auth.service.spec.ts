import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
describe('AuthService', () => {
  it('validates a hashed password and omits it from claims', async () => {
    const findOne = jest
      .fn()
      .mockResolvedValue({
        _id: 'id1',
        username: 'local',
        password: await hash('correct-password', 4),
      });
    const service = new AuthService(
      { findOne } as unknown as UsersService,
      {} as JwtService,
    );
    expect(await service.validateUser('local', 'wrong')).toBeNull();
    const user = await service.validateUser('local', 'correct-password');
    expect(user.userId).toBe('id1');
    expect(user).not.toHaveProperty('password');
  });
  it('signs the username and MongoDB identity', async () => {
    const sign = jest.fn().mockReturnValue('signed');
    const service = new AuthService(
      {} as UsersService,
      { sign } as unknown as JwtService,
    );
    expect(await service.login({ username: 'local', userId: 'id1' })).toEqual({
      access_token: 'signed',
    });
    expect(sign).toHaveBeenCalledWith({ username: 'local', sub: 'id1' });
  });
});

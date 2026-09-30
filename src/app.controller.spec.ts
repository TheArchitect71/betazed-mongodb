import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
describe('AppController', () => {
  it('passes authenticated identity to the login service', async () => {
    const login = jest.fn().mockResolvedValue({ access_token: 'signed' });
    const controller = new AppController({ login } as unknown as AuthService);
    expect(
      await controller.login({ user: { username: 'local', userId: 'id1' } }),
    ).toEqual({ access_token: 'signed' });
  });
  it('returns only the guard-provided profile', () => {
    const controller = new AppController({} as AuthService);
    expect(
      controller.getProfile({ user: { username: 'local', userId: 'id1' } }),
    ).toEqual({ username: 'local', userId: 'id1' });
  });
});

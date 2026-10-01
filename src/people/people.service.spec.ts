import { PeopleService } from './people.service';
import type { Model } from 'mongoose';
import type { Person } from './person.model';
describe('people validation', () => {
  const service = new PeopleService({} as Model<Person>);
  const body = { name: ' Ada ', role: 'Researcher', status: 'Active' };
  it('trims text, fills optional fields, and excludes untrusted ownership fields', () => {
    expect(
      service.validate({ ...body, owner: 'forged', id: 'forged' }),
    ).toEqual({
      name: 'Ada',
      role: 'Researcher',
      status: 'Active',
      organization: '',
      expertise: '',
      notes: '',
    });
  });
  it('rejects missing, incorrectly typed, oversized, and negative values', () => {
    for (const value of [
      null,
      [],
      { ...body, name: '  ' },
      { ...body, role: 1 },
      { ...body, notes: 'x'.repeat(4001) },
      { ...body, spaceWalks: -1 },
      { ...body, spaceFlights: 1.5 },
    ])
      expect(() => service.validate(value)).toThrow();
  });
});

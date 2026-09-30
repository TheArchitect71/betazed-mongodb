import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { mongoUri } from '../src/offline-config';
import { User } from '../src/users/user.model';
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/betazed_migration_test_${process.pid}?replicaSet=offline-rs`;
process.env.JWT_SECRET = 'isolated-offline-test-secret';
describe('Offline MongoDB API', () => {
  let app: INestApplication;
  let model: Model<User>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication({ logger: false });
    await app.init();
    model = app.get(getModelToken('User'));
    await model.init();
  });
  afterAll(async () => {
    if (app) {
      await app.get<Connection>(getConnectionToken()).dropDatabase();
      await app.close();
    }
  });
  it('rejects remote database endpoints before connecting', () => {
    const value = process.env.MONGODB_URI;
    try {
      process.env.MONGODB_URI = 'mongodb+srv://example.mongodb.net';
      expect(() => mongoUri()).toThrow(/Offline MongoDB/);
    } finally {
      process.env.MONGODB_URI = value;
    }
  });
  it('creates users locally using both current age and legacy price fields', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Age User', age: 21 })
      .expect(201);
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Legacy User', price: 22 })
      .expect(201);
    expect(await model.countDocuments()).toBe(2);
  });
  it('rejects invalid input', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: '', age: -1 })
      .expect(400);
  });
  it('creates credentials, stores hashes, signs in and protects profile', async () => {
    const account = {
      name: 'Offline User',
      age: 30,
      username: 'local',
      password: 'local-password',
    };
    const created = await request(app.getHttpServer())
      .post('/users')
      .send(account)
      .expect(201);
    expect(created.body.id).toMatch(/^[a-f0-9]{24}$/);
    expect((await model.findOne({ username: 'local' })).password).not.toBe(
      account.password,
    );
    await request(app.getHttpServer()).post('/users').send(account).expect(409);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'local', password: 'wrong' })
      .expect(401);
    await request(app.getHttpServer()).get('/profile').expect(401);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send(account)
      .expect(201);
    const profile = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${login.body.access_token}`)
      .expect(200);
    expect(profile.body).toEqual({
      userId: created.body.id,
      username: 'local',
    });
    await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'Bearer invalid')
      .expect(401);
  });
});

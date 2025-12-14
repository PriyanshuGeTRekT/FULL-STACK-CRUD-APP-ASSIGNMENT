const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/db');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('POST /api/users', () => {
  it('creates a user and returns 201', async () => {
    const payload = { name: 'Test User', email: 'testuser@example.com', city: 'Testville', state: 'TS' };
    const res = await request(app).post('/api/users').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({ name: 'Test User', email: 'testuser@example.com' });
  });
});

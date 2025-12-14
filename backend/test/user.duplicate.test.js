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

describe('Duplicate email handling', () => {
  it('returns 400 when creating a user with existing email', async () => {
    const payload = { name: 'Dup User', email: 'dup@example.com', city: 'City', state: 'ST' };
    const res1 = await request(app).post('/api/users').send(payload);
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post('/api/users').send(payload);
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message.toLowerCase()).toMatch(/email already exists|duplicate/);
  });
});

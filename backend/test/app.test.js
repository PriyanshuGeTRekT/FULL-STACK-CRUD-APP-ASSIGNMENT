const request = require('supertest');
const app = require('../src/app');

describe('Basic App', () => {
  test('GET / responds with 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/API is running/);
  });
});

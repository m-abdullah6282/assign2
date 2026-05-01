const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', ['test@gmail.com']);
  await pool.end();
});

describe('POST /users', () => {
  
  it('should create a new user successfully', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test@gmail.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('test@gmail.com');
  });

  it('should return 400 if name or email is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test User' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 409 if email already exists', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test@gmail.com' });

    const res = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test@gmail.com' });

    expect(res.statusCode).toBe(409);
  });

});
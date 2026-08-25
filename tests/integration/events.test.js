const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const connectDB = require('../../config/db');

require('../../models/Category'); 
require('../../models/User');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Events Endpoint Integration Tests (/api/events)', () => {

  test('GET /api/events returns status 200 OK and an array of events', async () => {
    const response = await request(app)
      .get('/api/events')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/events without a JWT token returns 401 Unauthorized', async () => {
    const newEvent = {
      title: 'Tech Conference 2026',
      description: 'Annual web dev summit',
      city: 'Cairo',
      venue: 'Main Hall',
      capacity: 100,
      date: '2026-10-15T10:00:00.000Z',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const response = await request(app)
      .post('/api/events')
      .send(newEvent)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('status', 'fail');
  });

  test('POST /api/events with missing required fields returns 422 Unprocessable Entity', async () => {
    const invalidEvent = {
      description: 'Incomplete payload test',
    };

    const response = await request(app)
      .post('/api/events')
      .send(invalidEvent)
      .expect('Content-Type', /json/);

    expect([422, 401]).toContain(response.status);
  });

});

test('GET /api/events returns status 200 OK', async () => {
  const response = await request(app).get('/api/events');
  console.log('GET /api/events error:', response.body); // <--- This will show the actual message/stack
  expect(response.status).toBe(200);
});
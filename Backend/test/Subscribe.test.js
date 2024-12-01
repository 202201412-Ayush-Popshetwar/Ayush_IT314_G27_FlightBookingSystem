import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../index.js'; // Your Express app
import { SubscriberModel } from '../Models/Subscriber.js';

jest.setTimeout(60000);


let mongoServer;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create({ binary: {
    version: '5.0.0', // Match the version downloaded
    downloadDir: './mongodb-binaries' // Path to cached binaries
}});
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


describe('POST /subscribe', () => {
  it('should return 400 if email is missing', async () => {
    const response = await request(app).post('/api/subscribe').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Email is required',
    });
  });

  it('should return 400 if email is already subscribed', async () => {
    const email = 'test@example.com';

    // Create a subscriber
    await SubscriberModel.create({ email });

    const response = await request(app).post('/api/subscribe').send({ email });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Email already subscribed',
    });
  });

  it('should return 200 for successful subscription', async () => {
    const email = 'newuser@example.com';
    
    const response = await request(app).post('/api/subscribe').send({ email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Successfully subscribed! Please check your email for confirmation.',
    });

    // Verify email was saved to the database
    const subscriber = await SubscriberModel.findOne({ email });
    expect(subscriber).toBeTruthy();

  });

  it('should return 500 if nodemailer fails', async () => {
    const email = 'failuser@example.com';

    jest.spyOn(SubscriberModel.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Mocked database save error');
    });
    // Force nodemailer to throw an error

    const response = await request(app).post('/api/subscribe').send({email});

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    });

    
  });

  it('should return 500 if database save fails', async () => {
    const email = 'dbfail@example.com';

    // Mock the database save to throw an error
    jest.spyOn(SubscriberModel.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Mocked database save error');
    });

    const response = await request(app).post('/api/subscribe').send({ email });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    });

    // Ensure the email was not saved in the database
    const subscriber = await SubscriberModel.findOne({ email });
    expect(subscriber).toBeFalsy();
  });
});
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(),
  }));
import {jest} from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import nodemailer from 'nodemailer';
import app from '../index.js'; // Your Express app
import { SubscriberModel } from '../Models/Subscriber.js';

jest.mock('nodemailer'); // Mock Nodemailer

let mongoServer;

beforeAll(async () => {
    await mongoose.connection.close();
  mongoServer = await MongoMemoryServer.create(
    { binary: {
        version: '5.0.0', // Match the version downloaded
        downloadDir: './mongodb-binaries' // Path to cached binaries
    }}
  );
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /subscribe', () => {
  it('should return 400 if email is missing', async () => {
    const response = await request(app).post('/subscribe').send({});
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

    const response = await request(app).post('/subscribe').send({ email });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Email already subscribed',
    });
  });

  it('should return 200 for successful subscription', async () => {
    const email = 'newuser@example.com';

    // Mock nodemailer transport
    const sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const response = await request(app).post('/subscribe').send({ email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Successfully subscribed! Please check your email for confirmation.',
    });

    // Verify email was saved to the database
    const subscriber = await SubscriberModel.findOne({ email });
    expect(subscriber).toBeTruthy();

    // Verify email was sent
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SkyLynx Newsletter!',
      html: expect.stringContaining('Welcome to SkyLynx! ✈️'),
    });
  });

  it('should return 500 if nodemailer fails', async () => {
    const email = 'failuser@example.com';

    // Mock nodemailer to throw an error
    const sendMailMock = jest.fn().mockRejectedValue(new Error('Mocked email error'));
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const response = await request(app).post('/subscribe').send({ email });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    });

    // Ensure the email was still saved in the database
    const subscriber = await SubscriberModel.findOne({ email });
    expect(subscriber).toBeTruthy();
  });

  it('should return 500 if database save fails', async () => {
    const email = 'dbfail@example.com';

    // Mock the database save to throw an error
    jest.spyOn(SubscriberModel.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Mocked database save error');
    });

    const response = await request(app).post('/subscribe').send({ email });

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

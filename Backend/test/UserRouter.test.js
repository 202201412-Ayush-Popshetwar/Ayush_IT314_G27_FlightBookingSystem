import {jest} from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import UserRouter from '../Routes/UserRouter.js';
import { UserModel,FlightModel,BookingModel } from '../Models/User.js';

// Create an express app to mount the UserRouter
const app = express();
app.use(express.json());
app.use(UserRouter);

describe('User Routes', () => {
  let mongoServer,userId,flightId;

  beforeAll(async () => {
    await mongoose.connection.close();
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create(
        { binary: {
            version: '5.0.0', // Match the version downloaded
            downloadDir: './mongodb-binaries' // Path to cached binaries
        }}
    );
    const uri = mongoServer.getUri();

    // Connect mongoose to in-memory MongoDB server
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close mongoose connection and stop MongoMemoryServer
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    if (userId) {
        await UserModel.deleteOne({ _id: userId });
    }

    // Clean up any bookings related to the user
    if (userId) {
        await BookingModel.deleteMany({ userId: userId });
    }

    // Clean up any flights related to the specific flightId
    if (flightId) {
        await FlightModel.deleteOne({ _id: flightId });
    }
  });

  describe('GET /user/:userId', () => {
    it('should return user details if user exists', async () => {
      // Create a test user
      const user = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
      });
      userId = user._id.toString();
      const res = await request(app).get(`/user/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('John Doe');
      expect(res.body.email).toBe('john@example.com');
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/user/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
    it('should return 500 when an invalid userId is provided', async () => {
        const invalidUserId = 'invalidUserId123'; // Invalid ID
    
        const res = await request(app).get(`/user/${invalidUserId}`);
    
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/Cast to ObjectId failed/);
    });
  });
  describe('GET /user', () => {
    it('should return 200 with message "user"', async () => {
      const res = await request(app).get('/user');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('user');
    });
  });
  describe('PUT /user/:userId', () => {
    it('should update user data', async () => {
      // Create a test user
      const user = await UserModel.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedpassword123'
      });
      userId = user._id.toString();
      const updatedData = { name: 'Jane Smith' };
      const res = await request(app).put(`/user/${userId}`).send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Jane Smith');
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/user/${nonExistentId}`).send({ name: 'New Name' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
    it('should return 500 when a database error occurs', async () => {
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
          throw new Error('Database error');
        });
    
        const userId = new mongoose.Types.ObjectId().toString();
    
        const res = await request(app)
          .put(`/user/${userId}`)
          .send({ name: 'Updated User' });
    
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
      });
  });

describe('PUT /user/:userId/passengers', () => {

  it('should return 200 when passengers are successfully updated', async () => {
    const user = await UserModel.create({
        name: 'Test User',
        email: 'jane@example.com',
        password: 'hashedpassword123',
        passengers: [],
      });
      userId = user._id.toString();
    const passengers = [{ name: 'Passenger 1' }, { name: 'Passenger 2' }];

    const res = await request(app)
      .put(`/user/${userId}/passengers`)
      .send({ passengers });

    expect(res.status).toBe(200);
    expect(res.body.passengers).toHaveLength(2);
    expect(res.body.passengers[0].name).toBe('Passenger 1');
  });

  it('should return 404 when the user is not found', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/user/${nonExistentUserId}/passengers`)
      .send({ passengers: [] });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 500 when a database error occurs', async () => {
    jest.spyOn(UserModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .put(`/user/${userId}/passengers`)
      .send({ passengers: [] });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal Server Error');
  });
});

  describe('DELETE /user/:userId/:passengerId', () => {
    it('should delete a passenger from the user\'s passengers array', async () => {
      // Create a test user with passengers
      const user = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        passengers: [
          { _id: new mongoose.Types.ObjectId(), name: 'Passenger 1' },
          { _id: new mongoose.Types.ObjectId(), name: 'Passenger 2' },
        ],
      });
      userId = user._id.toString();
      const passengerId = user.passengers[0]._id;

      const res = await request(app).delete(`/user/${userId}/${passengerId}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Passenger deleted successfully');

      const updatedUser = await UserModel.findById(userId);
      expect(updatedUser.passengers).toHaveLength(1);
      expect(updatedUser.passengers[0]._id.toString()).not.toBe(passengerId.toString());
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const passengerId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/user/${nonExistentUserId}/${passengerId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 404 if passenger does not exist', async () => {
      const user = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        passengers: [],
      });
      userId = user._id.toString();
      const nonExistentPassengerId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/user/${userId}/${nonExistentPassengerId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Passenger not found');
    });
    it('should return 500 if user.save() throws an error', async () => {
        // Mock user data
        const user = await UserModel.create({
          name: 'Test User',
          email: 'john@example.com',
          password: 'hashedpassword123',
          passengers: [{ _id: new mongoose.Types.ObjectId(), name: 'John Doe' }],
        });
        const passengerId = "randomperson123";
    
        // Mock the `save` function to throw an error
        jest.spyOn(user, 'save').mockImplementationOnce(() => {
          throw new Error('Mocked save error');
        });
    
        const response = await request(app).delete(`/passenger/${passengerId}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
        expect(response.body.error).toBe('Mocked save error');
      });
  });

  describe('GET /user/:userId/bookings', () => {
    it('should return bookings for a user', async () => {
      // Create a test user with bookings
      const user = await UserModel.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedpassword123',
        bookings: [],
      });
      userId = user._id.toString();
      const flight = await FlightModel.create({
        'flight date': "2023-06-26",
        airline : "SpiceJet",
        flight_num: "SG-9001",
        class : "economy",
        from : "NYC",
        dep_time : "18:55",
        to : "LAX",
        arr_time : "21:05",
        duration : "04h 10m",
        price : "6,013",
        stops : "non-stop",
        availableseats: 100
    });
    flightId = flight._id.toString();
      
    const bookingData = {
        userId ,
        flightId,
        from: 'NYC',
        to: 'LAX',
        date: '2023-06-26',
        class: 'economy',
        passengers: new Array(101).fill({ name: 'John Doe'}), // 101 passengers, but only 50 seats
        status: 'Confirmed',
        price: 6013,
        paymentMethod: 'card',
        addons: [],
    };
    const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);
    const bookingData1 = {
        userId ,
        flightId,
        from: 'NYC',
        to: 'LAX',
        date: '2023-06-26',
        class: 'economy',
        passengers: new Array(1).fill({ name: 'John Doe'}), 
        status: 'Confirmed',
        price: 6013,
        paymentMethod: 'card',
        addons: [],
    };
    const response1 = await request(app)
            .post('/bookings/create')
            .send(bookingData);
    const bookingData2 = {
        userId ,
        flightId,
        from: 'NYC',
        to: 'LAX',
        date: '2023-06-26',
        class: 'economy',
        passengers: new Array(1).fill({ name: 'John Bow'}),
        status: 'Confirmed',
        price: 6013,
        paymentMethod: 'card',
        addons: [],
    };
    const response2 = await request(app)
            .post('/bookings/create')
            .send(bookingData);
      
      const res = await request(app).get(`/user/${userId}/bookings`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/user/${nonExistentUserId}/bookings`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
    it('should return 500 if UserModel.findById throws an error', async () => {
        // Mock the `findById` function to throw an error
        jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
          throw new Error('Mocked findById error');
        });
    
        const response = await request(app).get(`/user/${new mongoose.Types.ObjectId()}/bookings`);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
      });
  });
});

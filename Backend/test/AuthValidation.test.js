import { jest } from "@jest/globals";
import mongoose from "mongoose";
import express from "express";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js"; // Adjust path as necessary
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js"; // Adjust path as necessary
import { UserModel } from "../Models/User.js";

// Mock routes to test middleware
app.post("/auth/signup", signupValidation, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new UserModel({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

app.post("/auth/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.status(200).json({ message: "Login Success" });
});

describe("Validation Middleware with MongoMemoryServer", () => {
  let mongoServer, userId;

  beforeAll(async () => {
    await mongoose.disconnect();
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create({ binary: {
      version: '5.0.0', // Match the version downloaded
      downloadDir: './mongodb-binaries' // Path to cached binaries
  }});
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    
    // Stop in-memory MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
    // Clear the database after each test
    
  });

  afterEach(async () => {
    if(userId)
      await UserModel.deleteOne({ _id: userId});
  });

  describe("Signup Validation", () => {
    it("should return 400 if 'name' is missing", async () => {
      const response = await supertest(app).post("/auth/signup").send({
        email: "test1@example.com",
        password: "password123",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"name" is required');
    });

    it("should return 400 if 'email' is invalid", async () => {
      const response = await supertest(app).post("/auth/signup").send({
        name: "John Doe",
        email: "not-an-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"email" must be a valid email');
    });

    it("should return 400 if 'password' is too short", async () => {
      const response = await supertest(app).post("/auth/signup").send({
        name: "John Doe",
        email: "test1@example.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain(
        '"password" length must be at least 4 characters long'
      );
    });

    it("should return 200 if all fields are valid", async () => {
      const response = await supertest(app).post("/auth/signup").send({
        name: "John Doe",
        email: "test1@example.com",
        password: "password123",
      });

      //userId = await UserModel.findOne({ email: "test1@example.com" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Signup successfully");
    });
  });

  describe("Login Validation", () => {

    it("should return 400 if 'email' is missing", async () => {
      const response = await supertest(app).post("/auth/login").send({
        password: "password123",
      });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"email" is required');
    });

    it("should return 400 if 'password' is missing", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "test1@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"password" is required');
    });

    it("should return 400 if credentials are invalid", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "test1@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Auth failed email or password is wrong");
    });

    it("should return 200 if all fields are valid", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "test1@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login Success");
      userId = await UserModel.findOne({ email: "test1@example.com" });
    });
  });
});

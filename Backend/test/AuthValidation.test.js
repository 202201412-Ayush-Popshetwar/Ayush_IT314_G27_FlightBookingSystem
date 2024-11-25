import {jest} from "@jest/globals";
import express from "express";
import supertest from "supertest";
import app from "../index.js"; // Adjust path as necessary
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js"; // Adjust path as necessary

// Mock routes to test middleware
app.post("/signup", signupValidation, (req, res) => {
  res.status(200).json({ message: "Signup successful" });
});

app.post("/login", loginValidation, (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

describe("Validation Middleware", () => {
  describe("Signup Validation", () => {
    it("should return 400 if 'name' is missing", async () => {
      const response = await supertest(app).post("/signup").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"name" is required');
      
    });

    it("should return 400 if 'email' is invalid", async () => {
      const response = await supertest(app).post("/signup").send({
        name: "John Doe",
        email: "not-an-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"email" must be a valid email');
    });

    it("should return 400 if 'password' is too short", async () => {
      const response = await supertest(app).post("/signup").send({
        name: "John Doe",
        email: "test@example.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain(
        '"password" length must be at least 4 characters long'
      );
    });

    it("should return 200 if all fields are valid", async () => {
      const response = await supertest(app).post("/signup").send({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Signup successful");
    });
  });

  describe("Login Validation", () => {
    it("should return 400 if 'email' is missing", async () => {
      const response = await supertest(app).post("/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"email" is required');
    });

    it("should return 400 if 'password' is missing", async () => {
      const response = await supertest(app).post("/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad request");
      expect(response.body.error.details[0].message).toContain('"password" is required');
    });

    it("should return 200 if all fields are valid", async () => {
      const response = await supertest(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });
  });
});

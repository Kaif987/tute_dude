const request = require("supertest");
const app = require("../server"); // Adjust if your main app file is named differently
const User = require("../models/User");
const mongoose = require("mongoose");

describe("Authentication API", () => {
  beforeAll(async () => {
    // Clear the users collection before running tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "Password123",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
    });

    it("should not register a user with an existing email", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        username: "testuser2",
        email: "testuser@example.com",
        password: "Password123",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should not register a user with invalid data", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        username: "testuser3",
        email: "invalid-email",
        password: "weak",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Validation failed");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login a user", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "Password123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
    });

    it("should not login with incorrect credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "WrongPassword",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Validation failed");
    });

    it("should not login with non-existent user", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "nonexistent@example.com",
        password: "Password123",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty(
        "message",
        "User with the given email does not exist"
      );
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout a user", async () => {
      const res = await request(app).post("/api/v1/auth/logout");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "User logged out successfully"
      );
    });
  });

  // Add tests for logout, password reset, etc. if applicable
});

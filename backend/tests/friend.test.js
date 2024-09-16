const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const mongoose = require("mongoose");

let server;

describe("Friend API", () => {
  let user1, user2, user3;
  let user1Token, user2Token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});

    // Create test users
    user1 = await User.create({
      firstName: "User",
      lastName: "One",
      email: "user1@example.com",
      password: "Password123",
    });
    user2 = await User.create({
      firstName: "User",
      lastName: "Two",
      email: "user2@example.com",
      password: "Password123",
    });
    user3 = await User.create({
      firstName: "User",
      lastName: "Three",
      email: "user3@example.com",
      password: "Password123",
    });

    // Login and get tokens
    const loginRes1 = await request(app).post("/api/v1/auth/login").send({
      email: "user1@example.com",
      password: "Password123",
    });
    user1Token = loginRes1.body.token;

    const loginRes2 = await request(app).post("/api/v1/auth/login").send({
      email: "user2@example.com",
      password: "Password123",
    });
    user2Token = loginRes2.body.token;

    // Start the server on a dynamic port
    server = app.listen(0);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    // Close the server after all tests
    await new Promise((resolve) => server.close(resolve));
  });

  describe("POST /api/v1/friend/search", () => {
    it("should search for friends", async () => {
      const res = await request(app)
        .post("/api/v1/friend/search")
        .set("Cookie", `token=${user1Token}`)
        .send({ searchQuery: "User" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2); // Should find User Two and User Three
    });

    it("should return 404 if no users found", async () => {
      const res = await request(app)
        .post("/api/v1/friend/search")
        .set("Cookie", `token=${user1Token}`)
        .send({ searchQuery: "NonexistentUser" });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/friend/send/:id", () => {
    it("should send a friend request", async () => {
      const res = await request(app)
        .get(`/api/v1/friend/send/${user2._id}`)
        .set("Cookie", `token=${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Friend Request Sent Successfully");
    });
  });

  describe("GET /api/v1/friend/accept/:id", () => {
    it("should accept a friend request", async () => {
      const res = await request(app)
        .get(`/api/v1/friend/accept/${user1._id}`)
        .set("Cookie", `token=${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Friend request accepted successfully");
    });
  });

  describe("DELETE /api/v1/friend/delete/:id", () => {
    it("should delete a friend request", async () => {
      // First, send a friend request
      await request(app)
        .get(`/api/v1/friend/send/${user3._id}`)
        .set("Cookie", `token=${user1Token}`);

      // Then delete it
      const res = await request(app)
        .delete(`/api/v1/friend/delete/${user3._id}`)
        .set("Cookie", `token=${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Friend request deleted");
    });
  });

  describe("GET /api/v1/friend/unfriend/:id", () => {
    it("should unfriend a user", async () => {
      const res = await request(app)
        .get(`/api/v1/friend/unfriend/${user2._id}`)
        .set("Cookie", `token=${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User unfriended successfully");
    });
  });
});

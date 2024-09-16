const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Adjust this path if needed
const User = require("../models/User");

describe("Friend Recommendation System", () => {
  let users = {};
  let tokens = {};

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});

    const userList = [
      { firstName: "Kaif", lastName: "Siddiqui", email: "kaif@example.com" },
      {
        firstName: "Prasanna",
        lastName: "Kumar",
        email: "prasanna@example.com",
      },
      { firstName: "Nirjal", lastName: "Gupta", email: "nirjal@example.com" },
      { firstName: "Ashish", lastName: "Sharma", email: "ashish@example.com" },
      { firstName: "Rajan", lastName: "Kumar", email: "rajan@example.com" },
      {
        firstName: "Sanskritiya",
        lastName: "Rao",
        email: "sanskritiya@example.com",
      },
    ];

    for (const user of userList) {
      try {
        const res = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...user, password: "Password123" });

        if (res.status !== 201) {
          throw new Error(
            `Failed to register user ${user.firstName}: ${JSON.stringify(
              res.body
            )}`
          );
        }

        tokens[user.firstName] = res.body.token;

        const registeredUser = await User.findOne({ email: user.email });
        if (!registeredUser) {
          throw new Error(`Failed to find registered user ${user.firstName}`);
        }
        users[user.firstName] = registeredUser;
      } catch (error) {
        console.error(
          `Error registering user ${user.firstName}:`,
          error.message
        );
        throw error; // This will cause the entire test suite to fail
      }
    }

    server = app.listen(0); // Use port 0 for dynamic port allocation
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    await new Promise((resolve) => server.close(resolve));
  });

  it("should create the specified social network", async () => {
    // Kaif -> Prasanna, Nirjal
    await request(app)
      .get(`/api/v1/friend/send/${users.Prasanna._id}`)
      .set("Cookie", `token=${tokens.Kaif}`);
    await request(app)
      .get(`/api/v1/friend/accept/${users.Kaif._id}`)
      .set("Cookie", `token=${tokens.Prasanna}`);

    await request(app)
      .get(`/api/v1/friend/send/${users.Nirjal._id}`)
      .set("Cookie", `token=${tokens.Kaif}`);
    await request(app)
      .get(`/api/v1/friend/accept/${users.Kaif._id}`)
      .set("Cookie", `token=${tokens.Nirjal}`);

    // Prasanna -> Ashish,Sanskritiya, Nirjal, Rajan
    for (const friend of ["Ashish", "Sanskritiya", "Nirjal", "Rajan"]) {
      await request(app)
        .get(`/api/v1/friend/send/${users[friend]._id}`)
        .set("Cookie", `token=${tokens.Prasanna}`);
      await request(app)
        .get(`/api/v1/friend/accept/${users.Prasanna._id}`)
        .set("Cookie", `token=${tokens[friend]}`);
    }

    // Ashish -> Rajan,Sanskritiya, Nirjal
    for (const friend of ["Rajan", "Sanskritiya", "Nirjal"]) {
      await request(app)
        .get(`/api/v1/friend/send/${users[friend]._id}`)
        .set("Cookie", `token=${tokens.Ashish}`);
      await request(app)
        .get(`/api/v1/friend/accept/${users.Ashish._id}`)
        .set("Cookie", `token=${tokens[friend]}`);
    }

    // Rajan ->Sanskritiya
    await request(app)
      .get(`/api/v1/friend/send/${users.Sanskritiya._id}`)
      .set("Cookie", `token=${tokens.Rajan}`);
    await request(app)
      .get(`/api/v1/friend/accept/${users.Rajan._id}`)
      .set("Cookie", `token=${tokens.Sanskritiya}`);

    // Nirjal -> Sanskritiya
    await request(app)
      .get(`/api/v1/friend/send/${users.Sanskritiya._id}`)
      .set("Cookie", `token=${tokens.Nirjal}`);
    await request(app)
      .get(`/api/v1/friend/accept/${users.Nirjal._id}`)
      .set("Cookie", `token=${tokens.Sanskritiya}`);

    // Verify friend connections
    for (const [user, expectedFriends] of Object.entries({
      Kaif: ["Prasanna", "Nirjal"],
      Prasanna: ["Kaif", "Ashish", "Sanskritiya", "Nirjal", "Rajan"],
      Ashish: ["Prasanna", "Rajan", "Sanskritiya", "Nirjal"],
      Rajan: ["Ashish", "Sanskritiya", "Prasanna"],
      Sanskritiya: ["Ashish", "Rajan", "Prasanna", "Nirjal"],
      Nirjal: ["Sanskritiya", "Prasanna", "Kaif", "Ashish"],
    })) {
      const userDoc = await User.findById(users[user]._id).populate("friends");
      expect(userDoc.friends.length).toBe(expectedFriends.length);
      expect(userDoc.friends.map((f) => f.firstName)).toEqual(
        expect.arrayContaining(expectedFriends)
      );
    }
  }, 20000);

  it("should recommend friends for Kaif", async () => {
    const res = await request(app)
      .get("/api/v1/recommendation")
      .set("Cookie", `token=${tokens.Kaif}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);

    const recommendedNames = res.body.data.map((user) => user.firstName);
    expect(recommendedNames).toEqual(
      expect.arrayContaining(["Ashish", "Rajan"])
    );
    expect(recommendedNames).not.toContain("Prasanna");
    expect(recommendedNames).not.toContain("Nirjal");
    expect(recommendedNames).not.toContain("Kaif");
  });

  it("should recommend friends for Sanskritiya", async () => {
    const res = await request(app)
      .get("/api/v1/recommendation")
      .set("Cookie", `token=${tokens.Sanskritiya}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);

    const recommendedNames = res.body.data.map((user) => user.firstName);
    expect(recommendedNames).toEqual(expect.arrayContaining(["Kaif"]));
    expect(recommendedNames).not.toContain("Sanskritiya");
  });
});

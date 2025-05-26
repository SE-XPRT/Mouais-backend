const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/users");
const Badge = require("../models/badges");

beforeAll(async () => {
  // Connexion à la base de données avant les tests
  await mongoose.connect(process.env.CONNECTION_STRING, {
    connectTimeoutMS: 2000,
  });
  console.log("Database connected");
});

afterAll(async () => {
  // Déconnexion de la base de données après les tests
  await mongoose.disconnect();
  console.log("Database disconnected");
});

describe("POST /badges/user/:userId", () => {
  let user;
  let badge;

  beforeEach(async () => {
    await User.deleteMany({});
    await Badge.deleteMany({});

    user = await User.create({
      email: "test@test.com",
      password: "1234",
      token: "abc123",
    });

    badge = await Badge.create({
      name: "Premier essai",
      description: "Tu as débloqué ton premier badge !",
      iconURL: "https://badge.url/icon.png",
      criteria: ["firstPhotoUploaded"],
    });
  });

  it("should assign a badge to a user", async () => {
    const response = await request(app)
      .post(`/badges/user/${user._id}`)
      .send({ badgeId: badge._id });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(true);
    expect(response.body.badge.name).toBe("Premier essai");

    const updatedUser = await User.findById(user._id).populate("badges");
    expect(updatedUser.badges.length).toBe(1);
    expect(updatedUser.badges[0].name).toBe("Premier essai");
  });
});

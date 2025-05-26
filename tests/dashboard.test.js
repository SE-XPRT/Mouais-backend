const request = require("supertest");
const app = require("./app");
const User = require("../models/users");
const Photo = require("../models/photos");
const Record = require("../models/records");
const Badge = require("../models/badges");

it("GET /dashboard/:token - renvoie les infos du user", async () => {
  // 1. Crée un user
  const user = await User.create({
    email: "test@test.com",
    password: "123456",
    token: "token123",
    pseudo: "Queen Mamacilia",
    coins: 42,
  });

  // 2. Crée une photo avec une analyse
  const photo = await Photo.create({
    userId: user._id,
    imageUrl: "http://image.com/photo.jpg",
    analyse: [
      {
        score: 88,
        createdAt: new Date(),
      },
    ],
  });

  // 3. Crée un record
  await Record.create({
    userId: user._id,
    averageRate: 72,
  });

  // 4. Crée un badge
  await Badge.create({
    userId: user._id,
    name: "Fashion Queen",
  });

  // 5. Appelle la route à tester
  const res = await request(app).get("/dashboard/token123");

  // 6. Vérifie la réponse
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.userName).toBe("Queen Mamacilia");
  expect(res.body.coins).toBe(42);
  expect(res.body.averageScore).toBe(72);
  expect(res.body.bestScore).toBe(88);
  expect(res.body.badgeNames).toContain("Fashion Queen");
  expect(res.body.bestPhoto.imageUrl).toBe("http://image.com/photo.jpg");
});

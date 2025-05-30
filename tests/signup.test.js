const request = require("supertest");

const app = require("../app");

const mongoose = require("mongoose");

const User = require("../models/users");

afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /signup", () => {
  it("devrait créer un nouvel utilisateur", async () => {
    const res = await request(app).post("/users/signup").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);

    expect(res.body.result).toBe(true);

    expect(res.body).toHaveProperty("token");
  });

  it("devrait échouer si l'utilisateur existe déjà", async () => {
    await new User({
      email: "duplicate@example.com",
      password: "hash",
      token: "token123",
    }).save();

    const res = await request(app).post("/users/signup").send({
      email: "duplicate@example.com",
      password: "123456",
    });

    expect(res.body.result).toBe(false);

    expect(res.body.error).toBe("User already exists");
  });

  it("devrait échouer si des champs sont manquants", async () => {
    const res = await request(app).post("/users/signup").send({
      email: "test@example.com",
    });

    expect(res.body.result).toBe(false);

    expect(res.body.error).toBe("Missing or empty fields");
  });
});

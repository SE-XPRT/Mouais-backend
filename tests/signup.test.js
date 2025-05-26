// 📦 On importe supertest pour simuler des requêtes HTTP sur notre API Express
const request = require("supertest");

// 📦 On importe notre application Express (fichier app.js sans le listen)
const app = require("../app");

// 📦 On importe mongoose pour se connecter à MongoDB dans les tests
const mongoose = require("mongoose");

// 📦 On importe le modèle User pour interagir avec la collection users
const User = require("../models/users");

// ❌ Après tous les tests : on ferme la connexion MongoDB
afterAll(async () => {
  await mongoose.disconnect();
});

// 🧪 Groupe de tests pour la route POST /signup
describe("POST /signup", () => {
  // ✅ Test 1 : créer un nouvel utilisateur si email et password sont valides
  it("devrait créer un nouvel utilisateur", async () => {
    const res = await request(app).post("/users/signup").send({
      email: "test@example.com",
      password: "123456",
    });

    // ✅ Le serveur répond avec un code 200
    expect(res.statusCode).toBe(200);

    // ✅ La réponse contient result: true
    expect(res.body.result).toBe(true);

    // ✅ Un token est bien généré et renvoyé
    expect(res.body).toHaveProperty("token");
  });

  // ❌ Test 2 : empêcher la création si l’utilisateur existe déjà
  it("devrait échouer si l'utilisateur existe déjà", async () => {
    // On crée un utilisateur existant dans la base
    await new User({
      email: "duplicate@example.com",
      password: "hash",
      token: "token123",
    }).save();

    // On tente de s’inscrire avec le même email
    const res = await request(app).post("/users/signup").send({
      email: "duplicate@example.com",
      password: "123456",
    });

    // ✅ Le résultat est false car l’utilisateur existe
    expect(res.body.result).toBe(false);

    // ✅ Le message d'erreur est bien renvoyé
    expect(res.body.error).toBe("User already exists");
  });

  // ❌ Test 3 : empêcher l’inscription si un champ est manquant
  it("devrait échouer si des champs sont manquants", async () => {
    // Ici on oublie le champ "password"
    const res = await request(app).post("/users/signup").send({
      email: "test@example.com",
    });

    // ✅ Résultat attendu : false
    expect(res.body.result).toBe(false);

    // ✅ Erreur : "Missing or empty fields"
    expect(res.body.error).toBe("Missing or empty fields");
  });
});

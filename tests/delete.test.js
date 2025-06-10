const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/users");

// Nettoyage après chaque test
afterEach(async () => {
  await User.deleteMany();
});

// Fermeture de la connexion après tous les tests
afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /users/delete", () => {
  // Test 1 : Suppression réussie d'un utilisateur
  it("devrait supprimer un utilisateur existant", async () => {
    // Créer un utilisateur de test
    const testUser = await new User({
      email: "test@example.com",
      password: "hash",
      token: "test-token-123",
    }).save();

    // Tenter de supprimer l'utilisateur
    const res = await request(app)
      .post("/users/delete")
      .send({ token: testUser.token });

    // Vérifier la réponse
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.message).toBe("User supprimer");

    // Vérifier que l'utilisateur n'existe plus dans la base
    const deletedUser = await User.findOne({ token: testUser.token });
    expect(deletedUser).toBeNull();
  });

  // Test 2 : Échec si le token est manquant
  it("devrait échouer si le token est manquant", async () => {
    const res = await request(app).post("/users/delete").send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("Missing or empty fields");
  });

  // Test 3 : Échec si l'utilisateur n'existe pas
  it("devrait échouer si l'utilisateur n'existe pas", async () => {
    const res = await request(app)
      .post("/users/delete")
      .send({ token: "token-inexistant" });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("User not found");
  });
});

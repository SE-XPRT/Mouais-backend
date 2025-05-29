var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        coins: (req.body.coins || 0) + 5,
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token, coins: newDoc.coins });
        console.log("Utilisateur créé");
      });
    } else {
      res.json({ result: false, error: "Utilisateur déjà existant" });
      console.log("Utilisateur déjà existant");
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    console.log("Champs manquants ou vides");
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, coins: data.coins, pseudo: data.pseudo, });
      console.log("Utilisateur connecté");
    } else {
      res.json({ result: false, error: "Utilisateur introuvable ou mot de passe incorrect" });
      console.log("Utilisateur introuvable ou mot de passe incorrect");
    }
  });
});

router.post("/delete", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  User.deleteOne({ token: req.body.token }).then((result) => {
    if (result.deletedCount > 0) {
      res.json({ result: true, message: "Utilisateur supprimé avec succès" });
    } else {
      res.json({ result: false, error: "L'utilisateur n'existe pas" });
    }
  });
});

router.get("/get", (req, res) => {
  const token = req.query.token;

  if (!token) {
    res.json({ result: false, error: "Token manquant" });
    return;
  }

  User.findOne({ token: token }).then((result) => {
    if (result) {
      res.json({
        result: true,
        email: result.email,
        pseudo: result.pseudo || "",
        message: "Utilisateur trouvé",
      });
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  });
});

router.post("/updateInfos", (req, res) => {
  if (!checkBody(req.body, ["token", "email"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  User.updateOne({ token: req.body.token }, { $set: { email: req.body.email } }).then((result) => {
    if (result.modifiedCount > 0) {
      res.json({ result: true, message: "Informations mises à jour" });
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  });
});

router.post("/updatePseudo", async (req, res) => {
  const token = req.body.token || req.query.token;
  const pseudo = req.body.pseudo;

  if (!token || !pseudo) {
    return res.json({ result: false, error: "Token ou pseudo manquant" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      { $set: { pseudo: pseudo } },
      { new: true }
    );

    if (updatedUser) {
      res.json({
        result: true,
        pseudo: updatedUser.pseudo,
        message: "Pseudo mis à jour avec succès",
      });
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pseudo :", error);
    res.status(500).json({ result: false, error: "Erreur lors de la mise à jour du pseudo" });
  }
});

router.post("/logout", (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.json({ result: false, error: "Token manquant" });
    return;
  }

  res.json({ result: true, message: "Déconnexion réussie" });
});

router.post("/updateCoins", async (req, res) => {
  const { token, coins } = req.body;

  if (!token || typeof coins !== "number" || isNaN(coins)) {
    return res.json({ result: false, error: "Token ou coins invalide" });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "Utilisateur introuvable" });
    }

    user.coins = coins; 
    await user.save(); 

    res.json({ result: true, coins: user.coins });
  } catch (error) {
    console.error("Erreur updateCoins :", error);
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});



module.exports = router;

var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// vérifie que tous les champs soient bien remplis
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // vérifie si l'utilisateur à déjà un compte
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
        console.log("User created");
      });
    } else {
      // Si l'utilisateur existe déjà dans la BDD
      res.json({ result: false, error: "User already exists" });
      console.log("User already exists");
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    console.log("Missing or empty fields");
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
      console.log("User connected");
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
      console.log("User not found or wrong password");
    }
  });
});

router.post("/delete", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // user delete par le token
  User.deleteOne({ token: req.body.token }).then((result) => {
    if (result.deletedCount > 0) {
      res.json({ result: true, message: "User supprimer" });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.get("/get", (req, res) => {
  const token = req.query.token; // Récupérer le token depuis les query params

  if (!token) {
    res.json({ result: false, error: "Missing token" });
    return;
  }

  User.findOne({ token: token }).then((result) => {
    if (result) {
      res.json({
        result: true,
        email: result.email,
        pseudo: result.pseudo || "", // Renvoyer le pseudo s'il existe, sinon une chaîne vide
        message: "User found",
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/updateInfos", (req, res) => {
  if (!checkBody(req.body, ["token", "email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.updateOne(
    { token: req.body.token },
    { $set: { email: req.body.email } }
  ).then((result) => {
    if (result.modifiedCount > 0) {
      res.json({ result: true, message: "User updated" });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/updatePseudo", async (req, res) => {
  // Vérifier si le token est dans le body ou dans les query params
  const token = req.body.token || req.query.token;
  const pseudo = req.body.pseudo;

  if (!token || !pseudo) {
    return res.json({ result: false, error: "Missing token or pseudo" });
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
        message: "Pseudo updated successfully",
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating pseudo:", error);
    res.status(500).json({ result: false, error: "Error updating pseudo" });
  }
});

router.post("/logout", (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.json({ result: false, error: "Missing token" });
    return;
  }

  res.json({ result: true, message: "Logged out successfully" });
});

module.exports = router;

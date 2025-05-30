const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Photo = require("../models/photos");
const Record = require("../models/records");
const Badge = require("../models/badges");

router.get("/:token", async (req, res) => {
  console.log("Token reçu :", req.params.token);
  const users = await User.find({});
  console.log("Utilisateurs en BDD :", users);
  console.log("Route dashboard appelée, token :", req.params.token);
  const user = await User.findOne({ token: req.params.token });

  if (!user) {
    return res.status(404).json({ result: false, error: "Utilisateur non trouvé" });
  }

  const photos = await Photo.find({ userId: user._id });

  const bestPhoto =
    photos.length > 0
      ? photos.reduce((top, current) => {
          const topScore = top.analyse[0]?.score || 0;
          const currScore = current.analyse[0]?.score || 0;
          return currScore > topScore ? current : top;
        })
      : null;

  const record = await Record.findOne({ userId: user._id });
  const averageScore = record ? record.averageRate : null;

  const bestScore = photos.reduce((max, photo) => {
    const score = photo.analyse[0]?.score || 0;
    return score > max ? score : max;
  }, 0);

  const badges = await Badge.find({ userId: user._id });
  const badgeNames = badges.map((badge) => badge.name);

  console.log("Utilisateur trouvé :", user);

  res.json({
    result: true,
    userName: user.pseudo || "bg",
    coins: user.coins || 0,
    averageScore,
    bestScore,
    bestPhoto,
    badgeNames,
  });
});

router.get("/email/:email", async (req, res) => {
  const email = req.params.email;
  console.log("Email reçu :", email);

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur non trouvé avec cet e-mail" });
    }

    res.json({
      result: true,
      message: "Utilisateur trouvé avec cet e-mail",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche par e-mail :", error);
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;

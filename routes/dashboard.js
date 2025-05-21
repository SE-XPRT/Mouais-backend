const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Photo = require("../models/photos");
const Record = require("../models/records");
const Badge = require("../models/badges");

// GET /dashboard/:token
router.get("/:token", async (req, res) => {
  const user = await User.findOne({ token: req.params.token });

  if (!user) {
    return res.status(404).json({ result: false, error: "User not found" });
  }

  const photos = await Photo.find({ userId: user._id });

  const bestPhoto =
    photos.length > 0
      ? photos.reduce((top, current) => {
          // top = accumulateur donc meilleure photo actuelle et current = photo qu'on est en train d'examiner dans la boucle
          const topScore = top.analyse[0]?.score || 0; // récupération du meilleur score de l'analyse (cf model photo (sous document analyse))
          const currScore = current.analyse[0]?.score || 0; // récupération du score de la photo actuelle
          return currScore > topScore ? current : top; // comparaison meilleur score et score actuel
        })
      : null;

  const record = await Record.findOne({ userId: user._id }); // va chercher les records du user

  const averageScore = record ? record.averageRate : null; // va chercher le score moyen dans les records du user

  // comparaison score max et score actuel
  const bestScore = photos.reduce((max, photo) => {
    const score = photo.analyse[0]?.score || 0;
    return score > max ? score : max;
  }, 0);

  const badges = await Badge.find({ userId: user._id }); // badge gagné par un user
  const badgeNames = badges.map((badge) => badge.name); // on renvoie un tableau avec les noms des badges

  res.json({
    result: true,
    userName: user.pseudo || "beau / belle gosse", // permet de fallbacker si le pseudo n'est pas encore défini
    coins: user.coins || 0, // va chercher les coins restants du user
    averageScore, // cf ligne 30
    bestScore, // cf ligne 33
    bestPhoto, // cf ligne 18
    badgeNames, // cf ligne 39
  });
});

module.exports = router;

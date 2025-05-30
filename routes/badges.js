const express = require("express");
const router = express.Router();

const Badge = require("../models/badges");
const User = require("../models/users");

//Obtenir la liste complète des badges (pour affichage général)
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json({ result: true, badges });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Obtenir le détail d’un badge (ex : page admin ou modal détail)
router.get("/:id", async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge)
      return res.status(404).json({ result: false, error: "Badge not found" });

    res.json({ result: true, badge });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Création d’un badge (réservé aux admins)
router.post("/", async (req, res) => {
  const { name, description, iconURL, criteria } = req.body;

  if (!name || !description) {
    return res.status(400).json({ result: false, error: "Missing fields" });
  }

  try {
    const newBadge = new Badge({ name, description, iconURL, criteria });
    await newBadge.save();
    res.json({ result: true, badge: newBadge });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Modifier un badge (admin only)
router.put("/:id", async (req, res) => {
  try {
    const updatedBadge = await Badge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBadge)
      return res.status(404).json({ result: false, error: "Badge not found" });

    res.json({ result: true, badge: updatedBadge });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Supprimer un badge
router.delete("/:id", async (req, res) => {
  try {
    const deletedBadge = await Badge.findByIdAndDelete(req.params.id);
    if (!deletedBadge)
      return res.status(404).json({ result: false, error: "Badge not found" });

    res.json({ result: true });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Attribuer un badge à un utilisateur
router.post("/user/:userId", async (req, res) => {
  const { badgeId } = req.body;

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ result: false, error: "User not found" });
  }

  const badge = await Badge.findById(badgeId);
  if (!badge) {
    return res.status(404).json({ result: false, error: "Badge not found" });
  }

  if (!user.badges.includes(badge._id)) {
    user.badges.push(badge._id);
    await user.save();
  }

  res.json({ result: true, badge });
});

module.exports = router;

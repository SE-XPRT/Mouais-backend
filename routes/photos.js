const express = require("express");
const router = express.Router();
const Photos = require("../models/photos");
const User = require("../models/users");

router.post("/upload", async (req, res) => {
  const { userToken, imageUrl } = req.body;
  if (!userToken || !imageUrl) {
    return res
      .status(400)
      .json({ message: "User ID and image URL are required" });
  }
  const newPhoto = new Photos({
    userToken: userToken,
    imageUrl: imageUrl,
    uploadAt: new Date(),
    analyse: [], // ajoute un tableau analyse vide par défaut
    tags: [],
  });

  const savedPhoto = await newPhoto.save();
  console.log("New photo data:", newPhoto);
  res.json({
    result: true,
    photo: savedPhoto,
  });
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const photos = await Photos.find({ userId: userId });
  if (!photos) {
    return res.status(404).json({ message: "Photos not found" });
  }
  res.json({
    result: true,
    photos,
  });
});

router.delete("/:photoId", async (req, res) => {
  const photoId = req.params.photoId;
  const photo = await Photos.findByIdAndDelete(photoId);
  if (!photo) {
    return res.status(404).json({ message: "Photo not found" });
  }
  res.json({
    result: true,
    message: "Photo deleted successfully",
  });
});

router.delete("/deleteAll/:userId", async (req, res) => {
  const userId = req.params.userId;
  const photos = await Photos.deleteMany({ userId: userId });
  if (!photos) {
    return res.status(404).json({ message: "Photos not found" });
  }
  res.json({
    result: true,
    message: "All photos deleted successfully",
  });
});

// Route pour ajouter les filtres
router.post("/analyze", async (req, res) => {
  const { token, photoId, filters } = req.body;

  if (!token || !photoId || !filters) {
    return res
      .status(400)
      .json({ result: false, message: "Token, photoId ou filtres manquants" });
  }

  try {
    // Vérifier que le user existe
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "Utilisateur non trouvé" });
    }

    // Ajouter les filtres à la photo correspondante
    const updatedPhoto = await Photos.findByIdAndUpdate(
      photoId,
      {
        $push: {
          // Ajouter un élément dans un tableau existant dans un document
          analyse: {
            ...filters, // Operation spread pour 'déplier' tous les champs de l'objet filters
            createdAt: new Date(), // Ajout d'une date de création à chaque analyse
          },
        },
      },
      { new: true }
    );

    if (!updatedPhoto) {
      return res
        .status(404)
        .json({ result: false, message: "Photo non trouvée" });
    }

    res.json({
      result: true,
      message: "Analyse enregistrée",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ result: false, message: "Erreur serveur" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Photos = require("../models/photos");

router.post("/upload", async (req, res) => {
  const { userToken, imageUrl } = req.body;
  if (!userToken || !imageUrl) {
    return res.status(400).json({ message: "User ID and image URL are required" });
  } 
  const newPhoto = new Photos({
    userToken: userToken,
    imageUrl: imageUrl,
  });
  
    const savedPhoto = await newPhoto.save();
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

module.exports = router;

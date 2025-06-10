const express = require("express");
const router = express.Router();
const Record = require("../models/records");
const User = require("../models/users");

router.get("/:token", async (req, res) => {
  try {
    console.log("Recherche user avec token:", req.params.token);
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      console.log("Aucun utilisateur trouvé !");
      return res.status(404).json({ message: "User not found" });
    }

    let record = await Record.findOne({ userId: user._id });

    if (!record) {
      record = new Record({
        userId: user._id,
        photosTaken: 0,
        averageRate: 0,
        averagePhotosPerDay: 0,
      });
      await record.save();
      return res.status(201).json(record);
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingRecord = await Record.findOne({ userId: user._id });
    if (existingRecord) {
      return res.status(400).json({ message: "Record already exists" });
    }

    const newRecord = new Record({
      userId: user._id,
      photosTaken: 0,
      averageRate: 0,
      averagePhotosPerDay: 0,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:token", async (req, res) => {
  const { newRate } = req.body;

  try {
    const user = await User.findOne({ token: req.params.token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await Record.findOne({ userId: user._id });
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.photosTaken += 1;

    const totalRate = record.averageRate * (record.photosTaken - 1) + newRate;
    record.averageRate = totalRate / record.photosTaken;

    const daysSinceStart =
      (new Date() - new Date(record.createdAt)) / (1000 * 60 * 60 * 24);
    record.averagePhotosPerDay =
      record.photosTaken / Math.max(1, daysSinceStart);

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

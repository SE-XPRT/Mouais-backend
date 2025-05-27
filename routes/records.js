const express = require("express");
const router = express.Router();
const Record = require("../models/records");

// GET /records/:userId
router.get("/:userId", async (req, res) => {
  try {
    const record = await Record.findOne({ userId: req.params.userId });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /records
router.post("/", async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if record already exists
    const existingRecord = await Record.findOne({ userId });
    if (existingRecord) {
      return res.status(400).json({ message: "Record already exists" });
    }

    const newRecord = new Record({
      userId,
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

// PUT /records/:userId
router.put("/:userId", async (req, res) => {
  const { newRate } = req.body;

  try {
    const record = await Record.findOne({ userId: req.params.userId });
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Update photos taken
    record.photosTaken += 1;

    // Update average rate
    const totalRate = record.averageRate * (record.photosTaken - 1) + newRate;
    record.averageRate = totalRate / record.photosTaken;

    // Update averagePhotosPerDay
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

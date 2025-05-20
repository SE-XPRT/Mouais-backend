const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    photosTaken: Number,
    averageRate: Number,
    averagePhotosPerDay: Number,
  },
  { timestamps: true }
);

const Record = mongoose.model("records", recordSchema);

module.exports = Record;

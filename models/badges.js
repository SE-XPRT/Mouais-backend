const mongoose = require("mongoose");

const badgeSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    iconURL: String,
    criteria: [String],
  },
  { timestamps: true }
);

const Badge = mongoose.model("badges", badgeSchema);

module.exports = Badge;

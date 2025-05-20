const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    provider: String,
    location: String,
    token: String,
    pseudo: String,
    avatarURL: String,
    coins: Number,
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscriptions",
    },
    subscriptionExpiresAt: Date,
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "badges" }],
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "photos" }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;

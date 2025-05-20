const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    name: String,
    price: Number,
    durationInDays: Number,
    coinsIncluded: Number,
  },
  { timestamps: true }
);

const Subscription = mongoose.model("subscriptions", subscriptionSchema);

module.exports = Subscription;

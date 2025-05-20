const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    transact_id: Number,
    type: String,
    amount: Number,
    provider: String,
    createAt: Date,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transactions", transactionSchema);

module.exports = Transaction;

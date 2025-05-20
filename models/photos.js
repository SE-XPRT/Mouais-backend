const mongoose = require("mongoose");

const analyzeSchema = mongoose.Schema(
  {
    tone: String,
    criteria: {
      cheveux: Number,
      smile: Number,
      makeup: Number,
      outfit: Number,
    },
    comment: {
      cheveux: String,
      smile: String,
      makeup: String,
      outfit: String,
    },
    createAt: Date,
  },
  { _id: false }
);

const photoSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    imageUrl: String,
    uploadAt: Date,
    analyse: [analyzeSchema],
    tags: [String],
  },
  { timestamps: true }
);

const Photo = mongoose.model("photos", photoSchema);

module.exports = Photo;

const mongoose = require("mongoose");

let wallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  coordHolds: {
    type: String,
    required: true,
  },
});

wallSchema.index({ name: 1, section: 1 }, { unique: true });

let Wall = mongoose.model("walls", wallSchema);

module.exports = Wall;

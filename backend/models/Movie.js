
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number,
  releaseDate: Date,
  duration: Number
});

module.exports = mongoose.model("Movie", MovieSchema);

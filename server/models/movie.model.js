const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  language: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image:{type:String}
 
});

const movieModel = mongoose.model("Movie", movieSchema);

module.exports = movieModel;

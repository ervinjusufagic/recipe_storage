const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  ingredients: { type: Array }
});

module.exports = mongoose.model("Recipe", recipeSchema);

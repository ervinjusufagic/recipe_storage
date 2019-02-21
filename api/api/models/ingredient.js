const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  iName: { type: String, required: true },
  abbr: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);

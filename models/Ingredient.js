const mongoose = require("mongoose");
const mongooseSlugPlugin = require("mongoose-slug-plugin");
const IngredientSchema = new mongoose.Schema(
  {
    name: String,

    image: String,

    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

IngredientSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });
module.exports = mongoose.model("Ingredient", IngredientSchema);

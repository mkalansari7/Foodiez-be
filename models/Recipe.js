const mongoose = require("mongoose");
const mongooseSlugPlugin = require("mongoose-slug-plugin");
const RecipeSchema = new mongoose.Schema(
  {
    name: String,

    image: String,

    description: String,

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  },
  { timestamps: true }
);

RecipeSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });
module.exports = mongoose.model("Recipe", RecipeSchema);

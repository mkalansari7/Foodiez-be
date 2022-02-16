const mongoose = require("mongoose");
const mongooseSlugPlugin = require("mongoose-slug-plugin");
const CategorySchema = new mongoose.Schema(
  {
    name: String,

    image: String,

    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

CategorySchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });
module.exports = mongoose.model("Category", CategorySchema);

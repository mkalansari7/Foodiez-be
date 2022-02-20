const Recipe = require("../../models/Recipe");
const Ingredient = require("../../models/Ingredient");

exports.fetchRecipe = async (recipeId, next) => {
  try {
    const recipe = await Recipe.findById(recipeId);

    if (recipe) return recipe;
    else {
      const error = new Error("Recipe ID was not found!");
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.getRecipes = async (req, res, next) => {
  try {
    const recipe = await Recipe.find()
      .populate({
        path: "category",
        select: ["name"],
      })
      .populate({
        path: "ingredients",
        select: ["name"],
      });
    return res.json(recipe);
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    await req.recipe.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.file.path}`;
    }
    const recipe = await Recipe.findByIdAndUpdate(
      { _id: req.recipe.id },
      req.body,
      { new: true, runValidators: true } // returns the updated recipe
    );
    res.status(200).json(recipe);
  } catch (err) {
    next(error);
  }
};

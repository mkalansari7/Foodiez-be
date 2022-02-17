const Ingredient = require("../../models/Ingredient");

exports.fetchIngredient = async (ingredientId, next) => {
  try {
    const ingredient = await Ingredient.findById(ingredientId);

    if (ingredient) return ingredient;
    else {
      const error = new Error("Ingredient ID was not found!");
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.getIngredients = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.find();
    return res.json(ingredient);
  } catch (error) {
    next(error);
  }
};

exports.deleteIngredient = async (req, res, next) => {
  try {
    await req.ingredient.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateIngredient = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.file.path}`;
    }
    const ingredient = await Ingredient.findByIdAndUpdate(
      { _id: req.ingredient.id },
      req.body,
      { new: true, runValidators: true } // returns the updated Ingredient
    );
    res.status(200).json(ingredient);
  } catch (err) {
    next(error);
  }
};

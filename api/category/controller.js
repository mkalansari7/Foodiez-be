const { findByIdAndUpdate } = require("../../models/Category");
const Category = require("../../models/Category");
const Ingredient = require("../../models/Ingredient");
const Recipe = require("../../models/Recipe");
exports.fetchCategory = async (categoryId, next) => {
  try {
    const category = await Category.findById(categoryId);

    if (category) return category;
    else {
      const error = new Error("Category ID was not found!");
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate({
      path: "recipes",
      select: ["name"],
    });
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }

    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await req.category.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateCaregory = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    const category = await Category.findByIdAndUpdate(
      { _id: req.category.id },
      req.body,
      { new: true, runValidators: true } // returns the updated category
    );
    res.status(200).json(category);
  } catch (err) {
    next(error);
  }
};

exports.addRecipe = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    req.body.category = req.category._id;

    const arrayOfIng = req.body.ing.trim().split(",");

    const newRecipe = await Recipe.create(req.body);
    await Category.findByIdAndUpdate(req.category._id, {
      $push: { recipes: newRecipe._id },
    });

    arrayOfIng.forEach(async (ing) => {
      const ingredientFound = await Ingredient.findOne({ name: ing.trim() });
      if (ingredientFound) {
        // found ing
        await Recipe.findByIdAndUpdate(newRecipe._id, {
          $push: { ingredients: ingredientFound._id },
        });

        await Ingredient.findByIdAndUpdate(ingredientFound._id, {
          $push: { recipes: newRecipe._id },
        });
      }
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    req.body.category = req.category._id;
    const arrayOfIng = req.body.ing.trim().split(",");

    await Recipe.findByIdAndDelete(req.params.recipeId);

    const newRecipe = await Recipe.create(req.body);
    await Category.findByIdAndUpdate(req.category._id, {
      $push: { recipes: newRecipe._id },
    });

    arrayOfIng.forEach(async (ing) => {
      const ingredientFound = await Ingredient.findOne({ name: ing.trim() });
      if (ingredientFound) {
        // found ing
        await Recipe.findByIdAndUpdate(newRecipe._id, {
          $push: { ingredients: ingredientFound._id },
        });

        await Ingredient.findByIdAndUpdate(ingredientFound._id, {
          $push: { recipes: newRecipe._id },
        });
      }
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

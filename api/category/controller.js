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
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.file.path}`;
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
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.file.path}`;
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
    let images = [];
    if (req.files) {
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.files[0].path}`;
      images = req.files;
    }
    req.body.category = req.category._id;
    const newRecipe = await Recipe.create(req.body);
    await Category.findByIdAndUpdate(req.category._id, {
      $push: { recipes: newRecipe._id },
    });
    const newIngredienties = req.body.ing.split(",");
    console.log(newIngredienties);
    newIngredienties.forEach(async (ing, index) => {
      const foundIng = await Ingredient.findOne({ name: ing });
      if (foundIng) {
        await Recipe.findByIdAndUpdate(newRecipe._id, {
          $push: { ingredients: foundIng._id },
        });
      } else {
        const theIng = {
          name: ing,
          image: `${req.method} ${req.protocol}://${req.get("host")}${
            req.originalUrl
          }/${req.files[1 + index].path}`,
        };
        const createdIng = await Ingredient.create(theIng);
        console.log(createdIng._id);
        await Recipe.findByIdAndUpdate(newRecipe._id, {
          $push: { ingredients: createdIng._id },
        });
      }
    });
    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

exports.testingMultiImg = async (req, res, next) => {
  if (req.file) {
    req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/${req.file.path}`;
  }
  // console.log(req);
  res.json(req.files);
};

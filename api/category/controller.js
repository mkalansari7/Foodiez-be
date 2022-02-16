const Category = require("../../models/Category");

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
    const categories = await Category.find();
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
    if (req.file) {
      req.body.image = `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }/${req.file.path}`;
    }
    req.body.category = req.category._id;
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

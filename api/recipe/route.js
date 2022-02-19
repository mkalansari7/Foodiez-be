const express = require("express");
const upload = require("../../middleware/multer");
const {
  getRecipes,
  deleteRecipe,
  fetchRecipe,
  updateRecipe,
} = require("./controller");

const router = express.Router();

router.param("recipeId", async (req, res, next, recipeId) => {
  const recipe = await fetchRecipe(recipeId, next);
  if (recipe) {
    req.recipe = recipe;
    next();
  } else {
    const err = new Error("Product Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getRecipes); // get all recipe
router.delete("/:recipeId", deleteRecipe); //delete a recipe
router.put("/:recipeId", upload.single("image"), updateRecipe); //update a recipe

module.exports = router;

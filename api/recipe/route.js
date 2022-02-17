const express = require("express");
const upload = require("../../middleware/multer");
const {
  getRecipes,
  deleteRecipe,
  fetchRecipe,
  updateRecipe,
  addIngredient,
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

router.get("/", upload.single("image"), getRecipes);
router.delete("/:recipeId", deleteRecipe);
router.put("/:recipeId", upload.single("image"), updateRecipe);
router.post("/:recipeId/ingredient", upload.single("image"), addIngredient);

module.exports = router;

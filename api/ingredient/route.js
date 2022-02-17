const express = require("express");
const upload = require("../../middleware/multer");
const {
  getIngredients,
  deleteIngredient,
  updateIngredient,
  fetchIngredient,
  addIngredient,
} = require("./controller");

const router = express.Router();

router.param("ingredientId", async (req, res, next, ingredientId) => {
  const ingredient = await fetchIngredient(ingredientId, next);
  if (ingredient) {
    req.ingredient = ingredient;
    next();
  } else {
    const err = new Error("Ingredient Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", upload.single("image"), getIngredients);
router.post("/", upload.single("image"), addIngredient);

router.delete("/:ingredientId", deleteIngredient);
router.put("/:ingredientId", upload.single("image"), updateIngredient);
module.exports = router;

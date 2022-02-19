const express = require("express");
const upload = require("../../middleware/multer");
const {
  getCategories,
  addCategory,
  deleteCategory,
  fetchCategory,
  updateCaregory,
  addRecipe,
} = require("./controller");

const router = express.Router();

router.param("categoryId", async (req, res, next, categoryId) => {
  const category = await fetchCategory(categoryId, next);
  if (category) {
    req.category = category;
    next();
  } else {
    const err = new Error("Product Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getCategories); // get all categories
router.post("/", upload.single("image"), addCategory); // add new category
router.post("/:categoryId/recipe", upload.single("image"), addRecipe); // add a new recipe -- need id of category
router.delete("/:categoryId", deleteCategory); // delete a category by id
router.put("/:categoryId", upload.single("image"), updateCaregory); // update a category by id
module.exports = router;

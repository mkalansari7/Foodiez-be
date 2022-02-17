const express = require("express");
const upload = require("../../middleware/multer");
const {
  getCategories,
  addCategory,
  deleteCategory,
  fetchCategory,
  updateCaregory,
  addRecipe,
  testingMultiImg,
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

router.get("/", upload.single("image"), getCategories);
router.post("/", upload.single("image"), addCategory);
router.post("/test", upload.array("image"), testingMultiImg);
router.post("/:categoryId/recipe", upload.array("image"), addRecipe);
router.delete("/:categoryId", deleteCategory);
router.put("/:categoryId", upload.single("image"), updateCaregory);
module.exports = router;

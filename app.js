const express = require("express");
const cors = require("cors");
//
const categoryRoute = require("./api/category/route");
const recipeRoute = require("./api/recipe/route");
const ingredientRoute = require("./api/ingredient/route");
//
const dotenv = require("dotenv");
const connectDB = require("./database");
const path = require("path");
const e = require("cors");

dotenv.config();
const app = express();

// request print on every request - middlewares
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/api/category", categoryRoute);
app.use("/api/recipe", recipeRoute);
app.use("/api/ingredient", ingredientRoute);

// Error handiling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Path not found handleing
app.use((req, res, next) => {
  res.json({ msg: "path was not found" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
  connectDB();
});

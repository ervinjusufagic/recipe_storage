const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const recipeRoutes = require("./api/routes/recipes");
const ingredientRoutes = require("./api/routes/ingredients");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://admin:admin@node-app-q8f4u.mongodb.net/test?retryWrites=true",
  {
    useNewUrlParser: true
  }
);
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/recipes", recipeRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

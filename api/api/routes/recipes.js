const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const Recipe = require("../models/recipe");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

router.get("/", (req, res, next) => {
  Recipe.find()
    .select("_id name portion instructions category image ingredients")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        recipes: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            portion: doc.portion,
            instructions: doc.instructions,
            category: doc.category,
            image: "http://localhost:3000/" + doc.image,
            ingredients: doc.ingredients,
            request: {
              type: "GET",
              url: "http://localhost:3000/recipes/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single("image"), (req, res, next) => {
  console.log(req.file);
  const recipe = new Recipe({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: req.body.category,
    instructions: req.body.instructions,
    image: req.file.path,
    ingredients: req.body.ingredients
  });
  recipe
    .save()
    .then(result => {
      res.status(201).json({
        message: "Created recipe",
        createdRecipe: {
          _id: result._id,
          name: result.name,
          portion: result.portion,
          instructions: result.instructions,
          category: result.category,
          image: result.image,
          ingredients: result.ingredients,
          request: {
            type: "GET",
            url: "http://localhost:3000/recipes/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:startOfName", (req, res, next) => {
  const name = req.params.startOfName;
  if (name.length < 2) {
    res.send({
      message: "Enter at least 2 characters"
    });
  }
  Recipe.find({ name: new RegExp("^" + name, "i") })
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/category/:category", (req, res, next) => {
  const category = req.params.category;
  Recipe.find({ category: category })
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/:recipeId", (req, res, next) => {
  const id = req.params.recipeId;

  Recipe.update(
    { _id: id },
    {
      $push: { ingredients: req.body.ingredients }
    }
  )
    .exec()
    .then()
    .then(result => {
      res.status(200).json({
        message: "Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/recipes/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:recipeId", (req, res, next) => {
  const id = req.params.recipeId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Recipe.update({ _id: id }, { $set: updateOps })
    .exec()
    .then()
    .then(result => {
      res.status(200).json({
        message: "Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/recipes/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:recipeId", checkAuth, (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Recipe deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;

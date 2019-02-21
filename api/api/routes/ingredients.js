const express = require("express");
const router = express.Router();
const ingredients = require("../json/livsmedelsdata.json");

router.get("/:search", (req, res, next) => {
  let search = req.params.search.toLowerCase();

  if (search.length < 2) {
    res.json({ error: "Please provide at least two characters..." });
    return;
  }

  let result = ingredients.filter(
    ingredient => ingredient.Namn.toLowerCase().indexOf(search) == 0
  );
  // .map(ingredient => ({
  //   ingredient: {
  // id: ingredient.Nummer,
  // name: ingredient.Namn
  // nutritionalValues: {
  //   value: ingredient.Naringsvarden.Naringsvarde.filter(
  //     values =>
  //       values.Forkortning == "Ener" ||
  //       values.Forkortning == "Prot" ||
  //       values.Forkortning == "Kolh"
  //   ).map(val => ({
  //     name: val.Namn,
  //     abbr: val.Forkortning,
  //     value: val.Varde,
  //     unit: val.Enhet
  //   }))
  // }
  //   }
  // }));
  res.status(200).json({
    result
  });
});

module.exports = router;

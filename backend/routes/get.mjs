import express from "express";
import db from "../db.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  const numberOfRecipes = 10;
  let setSize = 0;
  const page = req.query.page;
  const current = req.query.current;
  console.log("input array is", current);
  const foodSet = new Set();
  if (current) {
    current.forEach((item) => foodSet.add(parseInt(item)));
    setSize = foodSet.size;
  }

  console.log("created set is", foodSet);

  while (foodSet.size < setSize + 5) {
    const foodIndex = Math.ceil(Math.random() * numberOfRecipes);
    foodSet.add(foodIndex);
  }
  const foodArray = [...foodSet];

  console.log(" foodArray to filter is", foodArray);

  const foods = await db
    .collection("food")
    .find({ id: { $in: foodArray } })
    .toArray();

  res.send({
    results: foods,
    cursor: foodArray.length >= numberOfRecipes ? undefined : 1,
  });
});

export default router;

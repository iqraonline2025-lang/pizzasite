import express from "express";
import Pizza from "../models/Pizza.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newPizza = new Pizza(req.body);
    await newPizza.save();
    res.status(201).json(newPizza);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Pizza.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
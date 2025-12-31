import express from "express";
import Pizza from "../models/Pizza.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { pizzaId, size, toppings, clientPrice } = req.body;

    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) return res.status(404).json({ error: "Pizza not found" });

    // 1. Get base price for size (checks sizes object or default price)
    const serverBasePrice = (pizza.sizes && pizza.sizes[size]) ? pizza.sizes[size] : pizza.price;

    // 2. Add £1.50 per topping
    const TOPPING_FEE = 1.50;
    const calculatedPrice = serverBasePrice + (toppings.length * TOPPING_FEE);

    // 3. Compare (math rounding check)
    const isMatch = Math.abs(calculatedPrice - clientPrice) < 0.01;

    if (!isMatch) {
      return res.status(400).json({ 
        error: "Price mismatch", 
        serverPrice: calculatedPrice.toFixed(2),
        clientPrice: clientPrice.toFixed(2)
      });
    }

    res.json({ success: true, serverPrice: calculatedPrice });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ error: "Validation server error" });
  }
});

export default router;
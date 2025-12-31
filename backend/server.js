import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import pizzaRoutes from "./routes/pizzaRoutes.js";
import paymentRoutes from "./routes/payment.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import validatePizzaRoutes from "./routes/validatePizzaRoutes.js"; // IMPORTED

connectDB();

const app = express();
app.use(cors());

// Middleware
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Mounting Routes
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/validate-price", validatePizzaRoutes); // ADDED THIS LINE

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
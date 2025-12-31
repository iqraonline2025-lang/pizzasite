import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/admin/all", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
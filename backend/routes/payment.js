import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    let updateData = { status };

    if (status === "out_for_delivery") {
      updateData.deliveryTrackingUrl = "https://www.google.com/maps";
      updateData.deliveryETA = "15-20 mins";
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/create-payment", (req, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST to create a payment." });
});

router.post("/create-payment", async (req, res) => {
  try {
    const { amount, items, customerDetails } = req.body;
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "gbp",
    });

    const newOrder = new Order({
      items,
      amount: Number(amount),
      customer: customerDetails,
      paymentIntentId: paymentIntent.id,
      status: "pending"
    });

    await newOrder.save();
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    await Order.findOneAndUpdate({ paymentIntentId: event.data.object.id }, { status: "paid" });
  }
  res.json({ received: true });
});

export default router;


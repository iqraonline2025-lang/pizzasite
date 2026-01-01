import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Payment Intent
router.post("/create-payment", async (req, res) => {
  try {
    const { amount, items, customerDetails } = req.body;

    // Create the Stripe Payment Intent
    // Note: 'amount' must be an integer in pence/cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)), 
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
    });

    // Create the Order in your database
    const newOrder = new Order({
      items,
      amount: Number(amount) / 100, // Store as pounds/dollars in DB
      customer: customerDetails,
      paymentIntentId: paymentIntent.id,
      status: "pending"
    });

    await newOrder.save();

    // Return the secret to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Order Status (Used by your Success Page)
router.get("/order-status/:paymentIntentId", async (req, res) => {
  try {
    const order = await Order.findOne({ paymentIntentId: req.params.paymentIntentId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      orderId: order._id,
      status: order.status,
      customerName: order.customer?.name,
      deliveryTrackingUrl: order.deliveryTrackingUrl,
      deliveryETA: order.deliveryETA
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Uber Webhook (Updates tracking in real-time)
router.post("/uber-webhook", async (req, res) => {
  try {
    const { event_type, data } = req.body;
    if (!data?.external_id) return res.status(400).send("No Order ID");

    const updates = {};
    switch (event_type) {
      case "delivery.status_changed":
        if (data.status === "pickup_complete") updates.status = "out_for_delivery";
        if (data.status === "delivered") updates.status = "delivered";
        break;
      case "delivery.courier_update":
        updates.deliveryETA = data.estimated_arrival_minutes ? `${data.estimated_arrival_minutes} mins` : "Arriving soon";
        break;
      case "delivery.provider_assigned":
        updates.deliveryTrackingUrl = data.tracking_url; 
        break;
    }

    if (Object.keys(updates).length > 0) {
      await Order.findByIdAndUpdate(data.external_id, updates);
    }
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Webhook Error");
  }
});

export default router;
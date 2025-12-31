import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/uber-webhook", async (req, res) => {
  try {
    const { event_type, data } = req.body;
    if (!data || !data.external_id) return res.status(400).send("Invalid Data");

    const orderId = data.external_id;
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
      await Order.findByIdAndUpdate(orderId, updates);
      console.log(`✅ Order ${orderId} updated via Uber Webhook`);
    }

    res.status(200).send("Webhook Processed");
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
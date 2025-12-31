import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/delivery/create-uber-delivery
router.post("/create-uber-delivery", async (req, res) => {
  const { orderId } = req.body;

  try {
    // 1. Find the order in the database
    const order = await Order.findById(orderId);
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Prevent double-dispatching
    if (order.status === "out_for_delivery") {
      return res.status(400).json({ success: false, error: "Uber driver already dispatched" });
    }

    console.log(`🚀 Dispatching Uber for: ${order.customer.address}`);

    /**
     * 2. MOCK UBER API CALL
     * FIX: We use a real Google Maps URL here for testing.
     * This prevents the "DNS_PROBE_FINISHED_NXDOMAIN" error in your browser.
     */
    const mockUberResponse = {
      delivery_id: "UBER-" + Math.random().toString(36).toUpperCase().substring(0, 7),
      // This is a real URL that will actually open when you click 'Monitor Map'
      tracking_url: "https://www.google.com/maps", 
      estimated_arrival: "12-18 mins"
    };

    // 3. Update the Order in MongoDB
    order.status = "out_for_delivery";
    order.deliveryTrackingUrl = mockUberResponse.tracking_url;
    order.deliveryId = mockUberResponse.delivery_id;
    order.deliveryETA = mockUberResponse.estimated_arrival; 
    
    await order.save();

    // 4. Send back success to the Admin Panel
    // Note: We include 'trackingUrl' and 'deliveryETA' so the Admin UI updates instantly
    res.json({
      success: true,
      message: "Uber driver dispatched!",
      trackingUrl: order.deliveryTrackingUrl,
      status: order.status,
      deliveryETA: order.deliveryETA
    });

  } catch (error) {
    console.error("❌ Uber Integration Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to create Uber delivery" });
  }
});

export default router;
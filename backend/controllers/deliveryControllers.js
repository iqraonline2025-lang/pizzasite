import Order from "../models/Order.js";

/**
 * 1. DISPATCH TO UBER
 * Called when Admin clicks "Dispatch Uber"
 */
export const dispatchUberDelivery = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // In a real scenario, you'd fetch your Uber Token and POST to Uber's API here.
    // For now, we simulate the Uber Response.
    const uberApiResponse = {
      id: "ubr_987654321",
      tracking_url: `https://tracking.uber.com/v1/live/${order._id}`,
      estimated_arrival_minutes: 25
    };

    // Update the order with tracking details
    order.deliveryId = uberApiResponse.id;
    order.deliveryTrackingUrl = uberApiResponse.tracking_url;
    order.deliveryETA = `${uberApiResponse.estimated_arrival_minutes} mins`;
    order.status = "preparing"; // Move from 'paid' to 'preparing'
    
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: "Uber Delivery Created",
      trackingUrl: order.deliveryTrackingUrl 
    });
  } catch (error) {
    res.status(500).json({ message: "Uber Dispatch Error", error: error.message });
  }
};

/**
 * 2. UBER WEBHOOK HANDLER
 * Uber calls this automatically when the driver moves or status changes
 */
export const handleUberWebhook = async (req, res) => {
  const { event_type, data } = req.body;
  
  // Uber sends our MongoDB ID back as 'external_id'
  const orderId = data.external_id; 

  try {
    const updateData = {};

    switch (event_type) {
      case "delivery.status_changed":
        if (data.status === "pickup_complete") updateData.status = "out_for_delivery";
        if (data.status === "delivered") updateData.status = "delivered";
        break;

      case "delivery.courier_update":
        // This updates the ETA every time the driver moves in traffic
        updateData.deliveryETA = `${data.estimated_arrival_minutes} mins`;
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await Order.findByIdAndUpdate(orderId, updateData);
    }

    // Uber expects a 200 OK response to confirm you received the data
    res.status(200).send("Webhook Processed Successfully");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
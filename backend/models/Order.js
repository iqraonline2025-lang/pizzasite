import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String },
      toppings: [String],
    },
  ],
  amount: { type: Number, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
  },
  status: { 
    type: String, 
    default: "pending", 
    enum: ["pending", "paid", "preparing", "out_for_delivery", "delivered"] 
  },
  paymentIntentId: { type: String, unique: true },
  
  // --- DELIVERY & TRACKING SECTION ---
  deliveryId: { type: String, default: null }, // Uber/Courier ID
  deliveryTrackingUrl: { type: String, default: null }, // The live map link
  deliveryETA: { type: String, default: null }, // Dynamic ETA (e.g. "15 mins")
  
  // Optional: Courier details for the Admin UI
  courierName: { type: String, default: null },
  courierPhone: { type: String, default: null },

  createdAt: { type: Date, default: Date.now },
});

// Prevention for Model Re-compilation
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
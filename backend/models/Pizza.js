import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Base Price
    image: { type: String, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
    toppings: { type: [String], default: [] }, // Array of Strings
    sizes: {
      Small: { type: Number },
      Medium: { type: Number },
      Large: { type: Number },
    },
  },
  { timestamps: true }
);

const Pizza = mongoose.model("Pizza", pizzaSchema);
export default Pizza;
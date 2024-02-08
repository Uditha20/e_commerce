import mongoose from "mongoose";
import User from "./userModel.js";
import Product from "./productModel.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product,
          required: true,
        },
        quantity: {
          type: Number,
          required: [true,"enter the quantity"],
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    // Add other fields as necessary (e.g., order status, timestamps, etc.)
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;

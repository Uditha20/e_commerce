import mongoose from "mongoose";
import User from "./userModel.js";
import Product from "./productModel.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: [true,"enter the quantity"],
          min: 1,
        },
        subtotal:{
          type:String,
        }
      },
    ],
   
    billDetails:[
        {
          name:{
            type:String,
            required:[true,"name"]
          },
          address:{
            type:String,
            required:[true,"enter your address"]
          },
          town:{
            type:String,
            required:[true,"enter the town"]
          },
          phoneNo:{
            type:Number,
            required:[true,"enter the phone number"]
          },
          email:{
            type:String,
            required:[true,"enter the email"]
          }
        }

    ],
    total: {
      type: Number,
      required: true,
    },
    
    // Add other fields as necessary (e.g., order status, timestamps, etc.)
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;

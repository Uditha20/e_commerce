import mongoose from "mongoose";
import User from "./userModel.js";
import Product from "./productModel.js";

const orderSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:User,require:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:Product,require:true},
    purchaseDate:{type:Date,default:Date.now}
})

const Order=mongoose.model('order',orderSchema);
export default Order;
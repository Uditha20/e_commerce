import mongoose from "mongoose";

const products = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "please enter product name"],
  },
  price: {
    type: Number,
    required: [true, "please enter the price"],
  },
  item_count: {
    type: Number,
    required: [true, "how many items are add?"],
  },
  description: {
    type: String,
    required: [true, "please enter the description"],
  },
  weight: {
    type: Number,
    required: [true, "please enter the weight"],
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "normal",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"brand",
    required: true,
  },
  mainImage: {
    type: String, // URL or path to the main image
  },
  additionalImages: [{
    type: String, // Array of URLs or paths to additional images
  }],
  sellType:{
    type:String,
    default:'best'
  }
  //  need to add the image field
});

const Product = mongoose.model("product", products);
export default Product;

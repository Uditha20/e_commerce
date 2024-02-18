import mongoose from "mongoose";

const products = new mongoose.Schema({
  productname: {
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
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "normal",
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
  //  need to add the image field
});

const Product = mongoose.model("product", products);
export default Product;

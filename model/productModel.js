import mongoose from "mongoose";

const products = new mongoose.Schema({
  productName: {
    type: String,
    
  },
  price: {
    type: Number,
  
  },
  item_count: {
    type: Number,
   
  },
  description: {
    type: String,
    
  },
  weight: {
    type: Number,
    
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

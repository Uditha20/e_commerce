import mongoose from "mongoose";

const brand = new mongoose.Schema({
  brandName: {
    type: String,
    required: [true, "Add item name"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryModel",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Brand = mongoose.model("brand", brand);
export default Brand;

import mongoose from "mongoose";

const category = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "please enter Category Name"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
const Category = mongoose.model("category", category);
export default Category;

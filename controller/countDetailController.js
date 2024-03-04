import user from "../model/userModel.js";
import product from "../model/productModel.js";
import order from "../model/order.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Category from "../model/categoryModel.js";

const countDetails = asyncErrorHandler(async (req, res, next) => {
  const userCount = await user.countDocuments();
  const productCount = await product.countDocuments();
  const orderCount = await order.countDocuments();
  const catCount = await Category.countDocuments();


  res.json({
    userCount,
    productCount,
    orderCount,
    catCount
  });
});

export {countDetails};

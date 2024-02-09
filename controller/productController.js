import product from "../model/productModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const addProduct = asyncErrorHandler(async (req, res, next) => {
  const productAdd = await product.create(req.body);
  return res.json(productAdd);
});

const editProduct = async (req, res) => {};

export { addProduct };

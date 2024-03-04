import order from "../model/order.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const addOrder = asyncErrorHandler(async (req, res, next) => {
  const { user, items, total, billDetails } = req.body;
  const addOrder = await order.create({ user, items, total, billDetails });
  return res.status(201).json({ message: "ok" });
});

const editOrder = async (req, res) => {};

const getOrderWithProductDetails = asyncErrorHandler(async (req, res, next) => {
  const orders = await order
    .find({})
    .populate("user")
    .select("-password") // Populate the user field
    .populate({
      path: "items.product",
      model: "product",
      populate: [
        { path: "categoryId", model: "category" }, // Populate category
        { path: "brandId", model: "brand" }, // Populate brand
      ], // Assuming 'Product' is your product model name
    });
  return res.json(orders);
});

const getOneDetails = asyncErrorHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const details = await order.findById(orderId).populate({
    path:"items.product",
    model:'product'
  })
 
    res.json(details);
});

export { addOrder, getOrderWithProductDetails,getOneDetails };

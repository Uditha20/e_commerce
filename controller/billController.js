import bill from "../model/billModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const addBill = asyncErrorHandler(async (req, res, next) => {
  const billDetails = await bill.create(req.body);
  return res.json(billDetails);
});

export { addBill };

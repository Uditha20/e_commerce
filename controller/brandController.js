import Brand from "../model/brandModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import category from "../model/categoryModel.js";


const addBrand = asyncErrorHandler(async (req, res, next) => {
  const { brandName, categoryId } = req.body;
  const brandExit = await Brand.findOne({ brandName });
  if (brandExit && brandExit.isActive == true) {
    const error = new CustomError("1", 404);
    return next(error);
  }
  const brand = await Brand.create(req.body);

  return res.status(201).json({ message: "ok", brand });
});

const gellAllBrand = asyncErrorHandler(async (req, res, next) => {
  const allbrand = await Brand.find({})
    .populate("category", "categoryName")
    .exec();
  res.status(200).json(allbrand);
});

export { addBrand,gellAllBrand };

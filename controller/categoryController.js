import category from "../model/categoryModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";

const addCategory = asyncErrorHandler(async (req, res, next) => {
  const { categoryName } = req.body;
  const categoryExists = await category.findOne({ categoryName });
  // console.log(exits.isActive);
  if (categoryExists && categoryExists.isActive == true) {
    const error = new CustomError("1", 404);
    return next(error);
  }
  const categoryAdd = await category.create(req.body);

  return res.status(201).json({ message: "ok", categoryAdd });
});

const gellAllCategory = asyncErrorHandler(async (req, res, next) => {
  const allCategory = await category.find({});
  res.status(200).json(allCategory);
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryStatus = await category.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok", categoryStatus });
});

const editCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const newValues = req.body;
  const updatedCategory = await category.findByIdAndUpdate(
    categoryId,
    newValues,
    { new: true }
  );
  res.json(updatedCategory);
});

export { addCategory, gellAllCategory, deleteCategory,editCategory };

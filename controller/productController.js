import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import product from "../model/productModel.js";
import Brand from "../model/brandModel.js";
import category from "../model/categoryModel.js";

const addProduct = asyncErrorHandler(async (req, res, next) => {
  const { productName, price, item_count,description, weight,color, size, categoryId, brandId } =
    req.body;

  const mainImage = req.files["mainImage"]
    ? req.files["mainImage"][0].path
    : null;
  const additionalImages = req.files["additionalImages"]
    ? req.files["additionalImages"].map((file) => file.path)
    : [];
  const productAdd = await product.create({
    productName,
    price,
    item_count,
    color,
    size,
    description,
    weight,
    categoryId,
    brandId,
    mainImage, // Adding the main image URL
    additionalImages, // Adding the additional image URLs
  });

  return res.status(201).json({ message: "ok", productAdd });
});

// product form to brand name
const getBrandName = asyncErrorHandler(async (req, res, next) => {
  const categoryId = req.query.category;

  // console.log(categoryId);
  const brands = await Brand.find({ category: categoryId }).populate(
    "category"
  );
  return res.status(200).json(brands);
});

const getProductDetailsFrom = asyncErrorHandler(async (req, res, next) => {
  const allDetailsDetails = await product
    .find({})
    .populate({
      path: "brandId",
      select: "brandName category",
      populate: { path: "category", select: "categoryName" },
    }).populate('categoryId')
    .exec();
  res.status(200).json(allDetailsDetails);
});

const getOneProduct = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  const productOne = await product.findById(productId);
  if (!product) {
    const error = new CustomError("1", 404);
    return next(error);
  }
  return res.status(200).json(productOne);
});

const oneProductDetails = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  const details = await product
    .findById(productId)
    .populate({
      path: "brandId",
      select: "brandName category",
      populate: { path: "category", select: "categoryName" },
    })
    .exec();
  res.status(200).json(details);
});

const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const productStatus = await product.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok", productStatus });
});

const editProduct = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  let updateData = {};

  // Only add fields to updateData that are provided in the request
  const fieldsToUpdate = [
    "productName",
    "price",
    "item_count",
    "color",
    "size",
    "categoryId",
    "brandId",
  ];
  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (req.files) {
    if (req.files["mainImage"]) {
      updateData.mainImage = req.files["mainImage"][0].path;
    }
    if (req.files["additionalImages"]) {
      updateData.additionalImages = req.files["additionalImages"].map(
        (file) => file.path
      );
    }
  }

  const updatedProduct = await product.findOneAndUpdate(
    { _id: productId }, // Corrected filter object
    updateData, // Removed curly braces around updateData
    { new: true }
  );
  res.json({ message: "fff", updatedProduct });
});

export {
  addProduct,
  getBrandName,
  getProductDetailsFrom,
  getOneProduct,
  deleteProduct,
  oneProductDetails,
  editProduct,
};

import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import product from "../model/productModel.js";
import category from "../model/categoryModel.js";
import Brand from "../model/brandModel.js";

//category add controller
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

//category get controller
const gellAllCategory = asyncErrorHandler(async (req, res, next) => {
  const allCategory = await category.find({});
  res.status(200).json(allCategory);
});

// category delete
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

// brand add
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

// get all brands

const gellAllBrand = asyncErrorHandler(async (req, res, next) => {
  const allbrand = await Brand.find({})
    .populate("category", "categoryName")
    .exec();
  res.status(200).json(allbrand);
});

//
const addProduct = asyncErrorHandler(async (req, res, next) => {
  const { productName, price, item_count, color, size, categoryId, brandId } =
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
    })
    .exec();
  res.status(200).json(allDetailsDetails);
});

const getOneProduct = asyncErrorHandler(async (req, res) => {
  const productId = req.params.id;
  const productOne = await product.findById(productId);
  if (!product) {
    const error = new CustomError("1", 404);
    return next(error);
  }
  return res.status(200).json(productOne);
});

const editProduct = async (req, res) => {};

export {
  addCategory,
  addProduct,
  gellAllCategory,
  deleteCategory,
  addBrand,
  gellAllBrand,
  getBrandName,
  getProductDetailsFrom,
  getOneProduct
};

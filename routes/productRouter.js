import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getBrandName,
  getOneProduct,
  getProductDetailsFrom,
  oneProductDetails,
} from "../controller/productController.js";

import multer from "multer";
import { addCategory,gellAllCategory,deleteCategory} from "../controller/categoryController.js";
import { addBrand,gellAllBrand } from "../controller/brandController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
// category controller
router.route("/category/addCategory").post(addCategory);
router.route("/category/getAllCategory").get(gellAllCategory);
router.route("/category/delete/:id").post(deleteCategory);

router.route("/brand/addBrand").post(addBrand);
router.route("/brand/getBrand").get(gellAllBrand);
router.route("/category/getBrandName").get(getBrandName);

// router.route("/order/addOrder/:userid/:productid").post(addOrder);


// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define the route
router.post(
  "/addProduct",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 3 },
  ]),
  addProduct
);

// router.route("/addProduct").post(addProduct);

router.route("/getAllDetails").get(getProductDetailsFrom);
router.route("/getOneProduct/:id").get(protect,getOneProduct);
router.route("/productDelete/:id").post(protect,deleteProduct);
router.route("/oneProductDetails/:id").get(oneProductDetails);

export default router;

import { Router } from "express";
import { addBrand, addCategory, addProduct, deleteCategory, gellAllCategory } from "../controller/productController.js";
import {
  addOrder,
  getOrderWithProductDetails,
} from "../controller/orderController.js";

const router = Router();
// category controller
router.route("/category/addCategory").post(addCategory);
router.route("/category/getAllCategory").get(gellAllCategory);
router.route("/category/delete/:id").post(deleteCategory);

router.route("/brand/addBrand").post(addBrand);


router.route("/addProduct").post(addProduct);

// router.route("/order/addOrder/:userid/:productid").post(addOrder);
router.route("/order/addOrder").post(addOrder);
router.route("/order/getDetails/:id").get(getOrderWithProductDetails);

export default router;

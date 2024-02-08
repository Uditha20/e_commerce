import { Router } from "express";
import { addProduct } from "../controller/productController.js";
import { addOrder, getOrderWithProductDetails } from "../controller/orderController.js";

const router =Router();
router.route("/addProduct").post(addProduct);

// router.route("/order/addOrder/:userid/:productid").post(addOrder);
router.route("/order/addOrder").post(addOrder);
router.route("/order/getDetails/:id").get(getOrderWithProductDetails);


export default router;
import { Router } from "express";
import { addProduct } from "../controller/productController.js";

const router =Router();
router.route("/addProduct").post(addProduct);

router.route("/order/addOrder/")

export default router;
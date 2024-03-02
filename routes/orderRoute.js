import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    addOrder,
    getOrderWithProductDetails,
  } from "../controller/orderController.js";
const router = Router();


router.route("/addOrder").post(addOrder);
router.route("/order/getDetails/:id").get(getOrderWithProductDetails);

export default router;
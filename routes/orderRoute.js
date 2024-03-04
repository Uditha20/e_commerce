import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addOrder,
  getOneDetails,
  getOrderWithProductDetails,
} from "../controller/orderController.js";
const router = Router();

router.route("/addOrder").post(addOrder);
router.route("/getDetails").get(getOrderWithProductDetails);
router.route("/getOneDetails/:id").get(getOneDetails);

export default router;

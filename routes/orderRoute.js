import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addOrder,
  getOneDetails,
  getOrderWithProductDetails,
  getOrdersByUser,
} from "../controller/orderController.js";
const router = Router();

router.route("/addOrder").post(addOrder);
router.route("/getDetails").get(getOrderWithProductDetails);
router.route("/getOneDetails/:id").get(getOneDetails);
router.route('/user/:userId/orders').get(getOrdersByUser);

export default router;

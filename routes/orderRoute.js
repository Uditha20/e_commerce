import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addOrder,
  getOneDetails,
  getOrderWithProductDetails,
  getOrdersByUser,
  payhereNotify,
  updateStatus,
} from "../controller/orderController.js";

const router = Router();

// Public route for PayHere webhook (no auth needed)
router.route("/payment-notify").post(payhereNotify);

// Protected routes (with authentication) - COMMENTED OUT FOR TESTING
// Uncomment these after testing if you want authentication
router.route("/addOrder").post(addOrder); // Testing without protect first
// router.route("/addOrder").post(protect, addOrder); // Use this with auth

router.route("/getDetails").get(protect, getOrderWithProductDetails);
router.route("/getOneDetails/:id").get(protect, getOneDetails);
router.route('/user/:userId/orders').get(protect, getOrdersByUser);
router.route("/updateOrder/:id").patch(protect, updateStatus);

export default router;
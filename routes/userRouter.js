import { Router } from "express";
import {
  getUser,
  registerUser,
  loginUser,
  getAllDetailsUser,
  logOutUser,
  verifyGmail,
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  mergeCart,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Existing user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOutUser);
router.route("/verify/:token").get(verifyGmail);
router.route("/getUser").get(protect, getUser);
router.route("/getAllUsers").get(protect, getAllDetailsUser);

// ✅ New cart routes
router.route("/:userId/cart").get(protect, getUserCart);
router.route("/:userId/cart").post(protect, addToCart);
router.route("/:userId/cart").delete(protect, clearCart);
router.route("/:userId/cart/merge").post(protect, mergeCart);
router.route("/:userId/cart/:itemId").delete(protect, removeFromCart);
router.route("/:userId/cart/:itemId").put(protect, updateCartQuantity);

export default router;
import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllDetailsUser,
  logOutUser,
  getUser,
} from "../controller/useController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getAllDetails").get(protect,getAllDetailsUser);
router.route("/logout").get(logOutUser);
router.route("/getuser").get(protect,getUser);



export default router;

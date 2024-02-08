import { Router } from "express";
import { addBill } from "../controller/billController.js";

const router=Router();

router.route("/addBill").post(addBill);

export default router;


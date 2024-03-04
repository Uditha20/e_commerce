import { Router } from "express";
import { countDetails } from "../controller/countDetailController.js";
const router = Router();

router.route("/count").get(countDetails);

export default router;

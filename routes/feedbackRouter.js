import { Router } from "express";
import { addFeedback, getFeedbackwithId } from "../controller/feedbackController.js";

const router = Router();

router.route("/addfeedback").post(addFeedback);
router.route("/getFeedbacks/:id").get(getFeedbackwithId);

export default router;

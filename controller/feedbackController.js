import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import feedback from "../model/feedbackModel.js";

const addFeedback = asyncErrorHandler(async (req, res, next) => {
  const { user, product, message } = req.body;
  const feedbackAdd = await feedback.create({
    user,
    product,
    message,
  });
  return res
    .status(201)
    .json({ message: "Thank you for your Feedback", feedbackAdd });
});

const getFeedbackwithId = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  const feedBackDetails = await feedback
    .find({ product: productId })
    .populate("user", "name")
    .populate("product", "productName");
  if (!feedBackDetails) {
    const error = new CustomError("No Feedback", 404);
    return next(error);
  }
  res.status(200).json(feedBackDetails);
});

export { addFeedback, getFeedbackwithId };

import order from "../model/order.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { createTransport } from "nodemailer";
const addOrder = asyncErrorHandler(async (req, res, next) => {
  const { user, items, total, billDetails } = req.body;
  const addOrder = await order.create({ user, items, total, billDetails });
  // return res.status(201).json({ message: "ok" });

  // Assuming billDetails contains recipient's information
  const recipient = billDetails.length > 0 ? billDetails[0] : null;
  if (!recipient) {
    return res.status(400).json({ message: "Billing details are missing." });
  }

  // Create email content
  let emailContent = `Dear ${recipient.name},\n\nYour order has been placed successfully.\n\nOrder Details:\n`;
  items.forEach((item) => {
    emailContent += `Product: ${item.productName}, Quantity: ${item.quantity}, Subtotal: ${item.subtotal}\n`;
  });
  emailContent += `\nTotal: ${total}\n\nThank you for your order.`;
  // Set up Nodemailer transporter
  const transporter = createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  // Sending the email
  await transporter.sendMail({
    from: "udithaindunil5@gmail.com",
    to: recipient.email,
    subject: "Order Confirmation",
    text: emailContent,
  });
  return res.status(201).json({ message: "ok" });
});

const editOrder = async (req, res) => {};

const getOrderWithProductDetails = asyncErrorHandler(async (req, res, next) => {
  const orders = await order
    .find({})
    .populate("user")
    .select("-password") // Populate the user field
    .populate({
      path: "items.product",
      model: "product",
      populate: [
        { path: "categoryId", model: "category" }, // Populate category
        { path: "brandId", model: "brand" }, // Populate brand
      ], // Assuming 'Product' is your product model name
    });
  return res.json(orders);
});

const getOneDetails = asyncErrorHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const details = await order.findById(orderId).populate({
    path: "items.product",
    model: "product",
  });

  res.json(details);
});

const getOrdersByUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId; // Assuming you're getting the user ID from the route parameters
  const userOrders = await order.find({ user: userId }).populate({
    path: "items.product",
    model: "product",
  });

  if (!userOrders) {
    return res.status(404).send("No orders found for this user.");
  }

  res.json(userOrders);
});

export { addOrder, getOrderWithProductDetails, getOneDetails, getOrdersByUser };

import Payment from "../model/paymentModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import md5 from "crypto-js/md5.js";

const addOrder = asyncErrorHandler(async (req, res, next) => {
  console.log("📥 Received order request");
  console.log("Body:", req.body);
  
  const { user, items, total, billDetails } = req.body;
  
  // Validation
  if (!user || !items || !total || !billDetails) {
    console.error("❌ Missing required fields");
    return res.status(400).json({ 
      message: "Missing required fields",
      received: { user: !!user, items: !!items, total: !!total, billDetails: !!billDetails }
    });
  }
  
  if (!Array.isArray(items) || items.length === 0) {
    console.error("❌ Invalid items array");
    return res.status(400).json({ message: "Cart is empty or invalid" });
  }
  
  try {
    console.log("💾 Creating order in database...");
    const newOrder = await Payment.create({ 
      user, 
      items, 
      total, 
      billDetails,
      status: 1, // Pending status
      createdAt: new Date()
    });
    
    console.log("✅ Order created successfully:", newOrder._id);
    
    return res.status(201).json({ 
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id 
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return res.status(500).json({ 
      message: "Failed to create order",
      error: error.message 
    });
  }
});

const payhereNotify = asyncErrorHandler(async (req, res, next) => {
  const paymentDetails = req.body;
  const merchantSecret = process.env.MERCHANT_SECRET;
  const merchantId = paymentDetails.merchant_id;
  const orderId = paymentDetails.order_id;
  const amount = parseFloat(paymentDetails.payhere_amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replace(",", "");
  const currency = paymentDetails.payhere_currency;
  const statusCode = paymentDetails.status_code;

  // Create the hash to verify the integrity
  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const hashString = `${merchantId}${orderId}${amount}${currency}${statusCode}${hashedSecret}`;
  const calculatedHash = md5(hashString).toString().toUpperCase();

  if (calculatedHash === paymentDetails.md5sig) {
    console.log("✅ Payment verified:", paymentDetails);
    res.status(200).json({ success: true, message: "Payment verified and order saved." });
  } else {
    console.error("❌ Payment verification failed:", paymentDetails);
    res.sendStatus(400);
  }
});

const getOrderWithProductDetails = asyncErrorHandler(async (req, res, next) => {
  const orders = await Payment.find({})
    .sort({ createdAt: -1 })
    .populate("user", "-password")
    .populate({
      path: "items.product",
      model: "product",
      populate: [
        { path: "categoryId", model: "category" },
        { path: "brandId", model: "brand" },
      ],
    });

  return res.json(orders);
});

const getOneDetails = asyncErrorHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const details = await Payment.findById(orderId).populate({
    path: "items.product",
    model: "product",
  });

  res.json(details);
});

const getOrdersByUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const userOrders = await Payment.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "items.product",
      model: "product",
    });

  if (!userOrders) {
    return res.status(404).send("No orders found for this user.");
  }

  res.json(userOrders);
});

const updateStatus = asyncErrorHandler(async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const paymentDetails = await Payment.findById(orderId);
    if (!paymentDetails) {
      return res.status(404).json({ message: "Payment details not found" });
    }
    const status = paymentDetails.status;
    let newStatus;
    let statusMessage;

    switch (status) {
      case 1:
        newStatus = 2;
        statusMessage = "In Progress";
        break;
      case 2:
        newStatus = 3;
        statusMessage = "Complete";
        break;
      case 3:
        newStatus = 1;
        statusMessage = "Pending";
        break;
      default:
        newStatus = 1;
        statusMessage = "Pending";
    }

    await Payment.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    res.status(200).json({ message: `Status updated to ${statusMessage}` });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export {
  addOrder,
  getOrderWithProductDetails,
  getOneDetails,
  getOrdersByUser,
  payhereNotify,
  updateStatus
};
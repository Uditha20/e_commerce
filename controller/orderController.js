import order from "../model/order.js";
import Payment from "../model/paymentModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import md5 from "crypto-js/md5.js";

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
    // Hash matches, process the payment
    console.log("Payment verified:", paymentDetails);
    // Perform actions like updating order status, sending confirmation email, etc.

    res
      .status(200)
      .json({ success: true, message: "Payment verified and order saved." });
  } else {
    // Hash does not match, reject the notification
    console.error("Payment verification failed:", paymentDetails);
    res.sendStatus(400);
  }
});
// const paymentSession = asyncErrorHandler(async (req, res, next) => {
//   const stripe = Stripe(process.env.STRIPE_SECRET);
//   const { total } = req.body;
//   const totalAmountInCents = parseInt(parseFloat(total) * 100);
//   const lineItems = [
//     {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: "Total Order Amount",
//         },
//         unit_amount: totalAmountInCents,
//       },
//       quantity: 1,
//     },
//   ];

//   const session = await await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     success_url:`${process.env.BASE_URL}/success`,
//     cancel_url: `${process.env.BASE_URL}/Login`,
//   });

//   res.json({ id: session.id });
// });

const addOrder = asyncErrorHandler(async (req, res, next) => {
  const { user, items, total, billDetails } = req.body;
  const addOrder = await Payment.create({ user, items, total, billDetails });
  return res.status(201).json({ message: "ok" });
  // // Assuming billDetails contains recipient's information
  // const recipient = billDetails.length > 0 ? billDetails[0] : null;
  // if (!recipient) {
  //   return res.status(400).json({ message: "Billing details are missing." });
  // }
  // // Create email content
  // let emailContent = `Dear ${recipient.name},\n\nYour order has been placed successfully.\n\nOrder Details:\n`;
  // items.forEach((item) => {
  //   emailContent += `Product: ${item.productName}, Quantity: ${item.quantity}, Subtotal: ${item.subtotal}\n`;
  // });
  // emailContent += `\nTotal: ${total}\n\nThank you for your order.`;
  // // Set up Nodemailer transporter
  // const transporter = createTransport({
  //   host: process.env.HOST,
  //   service: process.env.SERVICE,
  //   port: Number(process.env.EMAIL_PORT),
  //   secure: Boolean(process.env.SECURE),
  //   auth: {
  //     user: process.env.USER,
  //     pass: process.env.PASS,
  //   },
  // });
  // // Sending the email
  // await transporter.sendMail({
  //   from: "udithaindunil5@gmail.com",
  //   to: recipient.email,
  //   subject: "Order Confirmation",
  //   text: emailContent,
  // });
  // return res.status(201).json({ message: "ok" });
});

const editOrder = async (req, res) => {};

const getOrderWithProductDetails = asyncErrorHandler(async (req, res, next) => {
  const orders = await Payment.find({})
    .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
    .populate("user", "-password") // Populate the user field and exclude password
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
  const details = await Payment.findById(orderId).populate({
    path: "items.product",
    model: "product",
  });

  res.json(details);
});

const getOrdersByUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId; // Assuming you're getting the user ID from the route parameters
  const userOrders = await Payment.find({ user: userId }).sort({ createdAt: -1 }).populate({
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

    const response = await Payment.findByIdAndUpdate(
      orderId,
      { status: newStatus }, // Update the status based on current status
      { new: true }
    );

    res.status(200).json({ message: `Status updated to ${statusMessage}` });

  } catch (error) {
    console.error("Error fetching payment details:", error);
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

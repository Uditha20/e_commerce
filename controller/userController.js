import user from "../model/userModel.js";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customerError.js";
import sendEmail from "../utils/sendEmail.js";

const singToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
};

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, username, phoneNo, password, role } = req.body;
  
  // Check validation
  if (!name) {
    const error = new CustomError("Enter the user name", 404);
    return next(error);
  }
  if (!password || password.length < 8) {
    const error = new CustomError("Password must be at least 8 characters long", 404);
    return next(error);
  }
  const exits = await user.findOne({ username });
  if (exits) {
    const error = new CustomError("User already exists. Please use a different email.", 404);
    return next(error);
  }
  
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      const error = new CustomError("Hash error", 404);
      return next(error);
    }
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        const error = new CustomError("Hash error", 404);
        return next(error);
      }
      
      // ✅ FIXED: Set verified and isActive to true
      const userCreate = await user.create({
        name,
        username,
        phoneNo,
        password: hash,
        role: role || 'user',
        verified: true,     // ✅ Allow immediate login
        isActive: true,     // ✅ Ensure user is active
      });

      res.status(201).send({ 
        message: "Account created successfully" 
      });
    });
  });
});

const verifyGmail = asyncErrorHandler(async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update user's verified status
    await user.findByIdAndUpdate(decoded.userId, { verified: true });

    res.send("Email successfully verified.");
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { username, password } = req.body;
  
  // ✅ Check if username and password are provided
  if (!username || !password) {
    const error = new CustomError("Please provide email and password", 400);
    return next(error);
  }

  const userFind = await user.findOne({ username });
  
  if (!userFind) {
    const error = new CustomError("Invalid Credentials", 404);
    return next(error);
  }
  
  // ✅ Check if user is verified
  if (userFind && !userFind.verified) {
    const error = new CustomError("Please verify your email", 404);
    return next(error);
  }

  // ✅ Check if user is active
  if (userFind && !userFind.isActive) {
    const error = new CustomError("Not Allowed to access", 404);
    return next(error);
  }

  bcrypt.compare(password, userFind.password, async function (err, result) {
    if (err) {
      const error = new CustomError("Internal Server Error", 500);
      return next(error);
    }
    if (result) {
      const newUser = await user.findOne({ username }).select("-password");
      const token = singToken(userFind._id, userFind.username);
      res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "lax",
      });
      res.status(200).json({ token, newUser });
    } else {
      const error = new CustomError("Invalid Credentials", 401);
      return next(error);
    }
  });
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user;
  let newuser;

  try {
    newuser = await user.findById(userId, "-password");
  } catch (err) {
    const error = new CustomError("Login again..", 500);
    return next(error);
  }
  if (!newuser) {
    return res.status(404).json({ messsage: "User Not Found" });
  }
  return res.status(200).json({ newuser });
});

const getAllDetailsUser = asyncErrorHandler(async (req, res, next) => {
  const userDetails = await user.find({});
  res.status(200).json(userDetails);
});

const logOutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "log out" });
});

// ========================================
// CART FUNCTIONS
// ========================================

// Get user's cart
const getUserCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  
  const userWithCart = await user
    .findById(userId)
    .populate({
      path: 'cart.productId',
      select: 'productName price mainImage item_count weight description',
    })
    .select('cart');

  if (!userWithCart) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // Transform cart to match frontend expectations
  const cart = userWithCart.cart.map(item => ({
    _id: item.productId._id,
    name: item.productId.productName,
    price: item.productId.price,
    pic: item.productId.mainImage,
    quantity: item.quantity,
    ct: item.productId.item_count,
    weight: item.productId.weight,
    description: item.productId.description,
  }));

  res.status(200).json({ cart });
});

// Add item to cart
const addToCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const { productId, quantity = 1 } = req.body;

  const userDoc = await user.findById(userId);
  
  if (!userDoc) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // Check if product already exists in cart
  const existingItemIndex = userDoc.cart.findIndex(
    item => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    userDoc.cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    userDoc.cart.push({
      productId,
      quantity,
    });
  }

  await userDoc.save();

  res.status(200).json({ 
    message: "Item added to cart successfully",
    cart: userDoc.cart 
  });
});

// Remove item from cart
const removeFromCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;

  const userDoc = await user.findById(userId);
  
  if (!userDoc) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // Remove item from cart
  userDoc.cart = userDoc.cart.filter(
    item => item.productId.toString() !== itemId
  );

  await userDoc.save();

  res.status(200).json({ 
    message: "Item removed from cart successfully",
    cart: userDoc.cart 
  });
});

// Update cart item quantity
const updateCartQuantity = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    const error = new CustomError("Invalid quantity", 400);
    return next(error);
  }

  const userDoc = await user.findById(userId);
  
  if (!userDoc) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // Find and update the item
  const itemIndex = userDoc.cart.findIndex(
    item => item.productId.toString() === itemId
  );

  if (itemIndex === -1) {
    const error = new CustomError("Item not found in cart", 404);
    return next(error);
  }

  userDoc.cart[itemIndex].quantity = quantity;
  await userDoc.save();

  res.status(200).json({ 
    message: "Cart updated successfully",
    cart: userDoc.cart 
  });
});

// Clear entire cart
const clearCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const userDoc = await user.findById(userId);
  
  if (!userDoc) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  userDoc.cart = [];
  await userDoc.save();

  res.status(200).json({ 
    message: "Cart cleared successfully",
    cart: [] 
  });
});

// Merge guest cart with user cart (on login)
const mergeCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const { items } = req.body; // Guest cart items

  const userDoc = await user.findById(userId);
  
  if (!userDoc) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // Merge guest cart items
  items.forEach(guestItem => {
    const existingItemIndex = userDoc.cart.findIndex(
      item => item.productId.toString() === guestItem._id
    );

    if (existingItemIndex > -1) {
      // Add quantities if item exists
      userDoc.cart[existingItemIndex].quantity += guestItem.quantity || 1;
    } else {
      // Add new item
      userDoc.cart.push({
        productId: guestItem._id,
        quantity: guestItem.quantity || 1,
      });
    }
  });

  await userDoc.save();

  res.status(200).json({ 
    message: "Carts merged successfully",
    cart: userDoc.cart 
  });
});

// ========================================
// EXPORTS - ONLY ONE EXPORT BLOCK
// ========================================
export {
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
};
import user from "../model/userModel.js";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customerError.js";

const singToken = (id, name) => {
  return jwt.sign({id,name}, process.env.JWT_SECRET, {
    expiresIn:"1hr"
  });
};

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, username, password } = req.body;
  // console.log(username);
  // check validation
  if (!name) {
    const error = new CustomError("Enter the user name", 404);
    return next(error);
  }
  if (!password || password.length < 8) {
    const error = new CustomError("2", 404);
    return next(error);
  }
  const exits = await user.findOne({ username });
  if (exits) {
    const error = new CustomError("3", 404);
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
      // Store hash in your password DB.
      const userCreate = await user.create({
        name,
        username,
        password: hash,
      });
      res.status(201).json({ message: "ok", userCreate });
    });
  });
  //create the user
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const userFind = await user.findOne({ username });
  if (!userFind) {
    const error = new CustomError("Invalid Credentials", 404);
    return next(error);
  }

  bcrypt.compare(password, userFind.password, async function (err, result) {
    if (err) {
      const error = new CustomError("Internal Server Error", 500);
      return next(error);
    }
    if (result) {
      const newUser = await user.findOne({ username }).select("-password");
      const token = singToken(userFind._id,userFind.username);
      res.cookie("token", token, {
        httpOnly: true,
        // domain: 'localhost',
        path: '/',
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: 'lax'
      }),
        res.status(200).json({ token, newUser });
    } else {
      const error = new CustomError("Invalid Credential", 500);
      return next(error);
    }
  });
});



const getUser =asyncErrorHandler( async (req, res, next) => {
  const userId = req.user;
  let newuser;

  try {
    newuser = await user.findById(userId,"-password");
  } catch (err) {
    const error = new CustomError("Login again..", 500);
    return next(error);
  }
  if (!newuser) {
    return res.status(404).json({ messsage: "User Not FOund" });
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
  }),
    res.status(200).json({ message: "log out" });
});
export {getUser, registerUser, loginUser, getAllDetailsUser, logOutUser };

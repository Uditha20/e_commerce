import user from "../model/userModel.js";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customerError.js";

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

  bcrypt.compare(password, userFind.password, function (err, result) {
    if (err) {
      const error = new CustomError("Internal Server Error", 500);
      return next(error);
    }
    if (result) {
      jwt.sign(
        { username: userFind.username, id: userFind._id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            const error = new CustomError("Token error", 500);
            return next(error);
          }
          res.cookie("token", token).json(userFind);
        }
      );
    } else {
      const error = new CustomError("Invalid Credential", 500);
      return next(error);
    }
  });
});

export { registerUser, loginUser };

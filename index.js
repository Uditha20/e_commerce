import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import billRouter from "./routes/billRouter.js";
import { CustomError } from "./utils/customerError.js";
import globalErrorHandler from "./controller/errorController.js";

dotenv.config();
const app = express();
const port = 5000;
app.use(json());

// user route
app.use("/auth/user", userRouter);

// products router
app.use("/products", productRouter);

// order bill
app.use("/bill", billRouter);

// default error handling
app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

// globale error handling middleware
app.use(globalErrorHandler);

// mongodb connection
mongoose
  .connect(process.env.CONNECT_STR)
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`server running ${port}`);
});

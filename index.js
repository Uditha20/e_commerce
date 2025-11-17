import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import billRouter from "./routes/billRouter.js";
import authRouter from "./routes/auth.js";
import orderRouter from "./routes/orderRoute.js";
import countRouter from "./routes/countDetailsRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
       
import { CustomError } from "./utils/customerError.js";
import globalErrorHandler from "./controller/errorController.js";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cookieParser());

const port = 5000;
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      process.env.BASE_URL,      // http://localhost:3000
      process.env.DASH_URL       // http://localhost:3001
    ],
    credentials: true,
  })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/bill", billRouter);
app.use("/auth", authRouter);
app.use("/order", orderRouter);
app.use("/feedback", feedbackRouter);
app.use("/dashboard", countRouter);


// not found route
app.all("*", (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
  next(err);
});

// global error handling
app.use(globalErrorHandler);

// connect to MongoDB
mongoose
  .connect(process.env.CONNECT_STR)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

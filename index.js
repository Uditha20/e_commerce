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
// import passportStrategy from "./passport.js";
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

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			callbackURL: "/auth/google/callback",
// 			scope: ["profile", "email"],
// 		},
// 		function (accessToken, refreshToken, profile, callback) {
// 			callback(null, profile);
// 		}
// 	)
// );

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: [process.env.BASE_URL,process.env.BASE_URL_TWO,process.env.DASH_URL],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// user route
app.use("/user", userRouter);

// products router
app.use("/products", productRouter);

// order bill
app.use("/bill", billRouter);

app.use("/auth", authRouter);

app.use("/order", orderRouter);
app.use("/feedback",feedbackRouter);


app.use("/dashboard", countRouter);
// app.use(errorHandler);
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

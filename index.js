import express,{json} from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import billRouter from "./routes/billRouter.js";

dotenv.config();
const app=express();
const port =5000;
app.use(json());

// user route
app.use("/auth/user",userRouter);

// products router
app.use("/products",productRouter);

// order bill
app.use("/bill",billRouter);


// mongodb connection
mongoose.connect(process.env.CONNECT_STR).then(()=>{
    console.log("connect")
})
.catch((err)=>{
        console.log(err)
})


app.listen(port,()=>{
    console.log(`server running ${port}`)
}
)

import mongoose from "mongoose";
import User from "./userModel.js";
import Order from "./order.js";

const billSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        require:true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Order,
        require:true
    },
    firstName:{
        type:String,
        require:[true,"enter your name"]
    },
    companyName:{
        type:String,
        require:[true,"enter company name"]
    },
    streetAddress:{
        type:String,
        require:[true,"enter street"]
    },
    floor:{
        type:String
    },
    city:{
        type:String,
        require:[true,"enter city"]
    },
    phoneNumber:{
        type:String,
        require:[true,"enter phone number"]
    },
    email:{
        type:String,
        require:[true,"enter gmail"]
    }

})

const Bill=mongoose.model('bill',billSchema);

export default Bill;